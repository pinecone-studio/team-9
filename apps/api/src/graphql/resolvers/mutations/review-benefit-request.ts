import { and, eq, or } from "drizzle-orm";

import { getDb } from "../../../db";
import { benefitEligibility } from "../../../db/schema/benefit-eligibility";
import { benefitRequests } from "../../../db/schema/benefit-requests";
import { employees } from "../../../db/schema/employees";
import type {
  BenefitRequest,
  MutationReviewBenefitRequestArgs,
} from "../../generated/resolvers-types";
import { listBenefitRequests } from "../queries/list-benefit-requests";

const ACTIVE_STATUS = "active";
const ELIGIBLE_STATUS = "eligible";
const PENDING_STATUS = "pending";

export async function reviewBenefitRequest(
  DB: D1Database,
  args: MutationReviewBenefitRequestArgs,
): Promise<BenefitRequest> {
  const db = getDb({ DB });
  const input = args.input;
  const reviewComment = input.reviewComment?.trim() || null;

  try {
    const [existing] = await db
      .select()
      .from(benefitRequests)
      .where(eq(benefitRequests.id, input.id))
      .limit(1);

    if (!existing) {
      throw new Error(`Benefit request not found: ${input.id}`);
    }
    if (existing.status !== PENDING_STATUS) {
      throw new Error("Only pending benefit requests can be reviewed");
    }

    const [reviewer] = await db
      .select({ id: employees.id })
      .from(employees)
      .where(
        or(eq(employees.id, input.reviewedBy), eq(employees.email, input.reviewedBy)),
      )
      .limit(1);

    if (!reviewer) {
      throw new Error("Reviewer employee record not found");
    }
    if (reviewer.id === existing.employeeId) {
      throw new Error("The requester cannot review their own request");
    }
    if (!input.approved && !reviewComment) {
      throw new Error("A rejection comment is required when rejecting a benefit request");
    }

    const [eligibility] = await db
      .select({ status: benefitEligibility.status })
      .from(benefitEligibility)
      .where(
        and(
          eq(benefitEligibility.employeeId, existing.employeeId),
          eq(benefitEligibility.benefitId, existing.benefitId),
        ),
      )
      .limit(1);

    if (!eligibility) {
      throw new Error("Employee eligibility record not found for this request");
    }
    if (eligibility.status !== PENDING_STATUS) {
      throw new Error("Only pending employee benefit requests can be reviewed");
    }

    const nextRequestStatus = input.approved ? "approved" : "rejected";
    const nextEligibilityStatus = input.approved ? ACTIVE_STATUS : ELIGIBLE_STATUS;
    const updatedAt = new Date().toISOString();

    await db
      .update(benefitEligibility)
      .set({
        computedAt: updatedAt,
        overrideBy: null,
        overrideExpiresAt: null,
        overrideReason: input.approved
          ? "Approved employee benefit activation request"
          : "Rejected employee benefit activation request",
        status: nextEligibilityStatus,
      })
      .where(
        and(
          eq(benefitEligibility.employeeId, existing.employeeId),
          eq(benefitEligibility.benefitId, existing.benefitId),
        ),
      );

    await db
      .update(benefitRequests)
      .set({
        reviewComment,
        reviewedBy: reviewer.id,
        status: nextRequestStatus,
        updatedAt,
      })
      .where(eq(benefitRequests.id, input.id))
      .catch(async (error) => {
        if (!isMissingReviewCommentColumnError(error)) {
          throw error;
        }

        console.warn(
          "[reviewBenefitRequest] review_comment column is unavailable. Saving review without comment persistence.",
        );

        await db
          .update(benefitRequests)
          .set({
            reviewedBy: reviewer.id,
            status: nextRequestStatus,
            updatedAt,
          })
          .where(eq(benefitRequests.id, input.id));
      });

    const result = (await listBenefitRequests(DB, {})).find(
      (request) => request.id === input.id,
    );
    if (!result) {
      throw new Error("Reviewed benefit request could not be loaded");
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to review benefit request.");
  }
}

function isMissingReviewCommentColumnError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    message.includes("review_comment") &&
    (message.includes("no such column") || message.includes("has no column named"))
  );
}
