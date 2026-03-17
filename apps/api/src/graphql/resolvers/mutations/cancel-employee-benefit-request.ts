import { and, eq } from "drizzle-orm";

import { getDb } from "../../../db";
import { benefitEligibility } from "../../../db/schema/benefit-eligibility";
import { benefitRequests } from "../../../db/schema/benefit-requests";
import { employees } from "../../../db/schema/employees";
import type {
  BenefitRequest,
  MutationCancelEmployeeBenefitRequestArgs,
} from "../../generated/resolvers-types";
import { listBenefitRequests } from "../queries/list-benefit-requests";

const CANCELLED_STATUS = "cancelled";
const ELIGIBLE_STATUS = "eligible";
const PENDING_STATUS = "pending";

export async function cancelEmployeeBenefitRequest(
  DB: D1Database,
  args: MutationCancelEmployeeBenefitRequestArgs,
): Promise<BenefitRequest> {
  const db = getDb({ DB });
  const requestId = args.input.id.trim();
  const cancelledBy = args.input.cancelledBy.trim();

  if (!requestId) {
    throw new Error("Request id is required");
  }
  if (!cancelledBy) {
    throw new Error("cancelledBy is required");
  }

  try {
    const [existing] = await db
      .select()
      .from(benefitRequests)
      .where(eq(benefitRequests.id, requestId))
      .limit(1);

    if (!existing) {
      throw new Error(`Benefit request not found: ${requestId}`);
    }
    if (existing.status !== PENDING_STATUS) {
      throw new Error("Only pending benefit requests can be cancelled");
    }

    const [requestOwner] = await db
      .select({
        email: employees.email,
        id: employees.id,
        name: employees.name,
      })
      .from(employees)
      .where(eq(employees.id, existing.employeeId))
      .limit(1);

    if (!requestOwner) {
      throw new Error("Request owner employee record not found");
    }

    const normalizedCancelledBy = cancelledBy.trim().toLowerCase();
    const isRequestOwner = [
      requestOwner.email,
      requestOwner.id,
      requestOwner.name,
    ].some((value) => value.trim().toLowerCase() === normalizedCancelledBy);

    if (!isRequestOwner) {
      throw new Error("Employees can only cancel their own benefit requests");
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

    const updatedAt = new Date().toISOString();

    if (eligibility?.status === PENDING_STATUS) {
      await db
        .update(benefitEligibility)
        .set({
          computedAt: updatedAt,
          overrideBy: null,
          overrideExpiresAt: null,
          overrideReason: "Cancelled employee benefit activation request",
          status: ELIGIBLE_STATUS,
        })
        .where(
          and(
            eq(benefitEligibility.employeeId, existing.employeeId),
            eq(benefitEligibility.benefitId, existing.benefitId),
          ),
        );
    }

    await db
      .update(benefitRequests)
      .set({
        status: CANCELLED_STATUS,
        updatedAt,
      })
      .where(eq(benefitRequests.id, requestId));

    const result = (await listBenefitRequests(DB, { employeeId: existing.employeeId })).find(
      (request) => request.id === requestId,
    );

    if (!result) {
      throw new Error("Cancelled benefit request could not be loaded");
    }

    return result;
  } catch (error) {
    console.error("[cancelEmployeeBenefitRequest] Failed to cancel employee benefit request.", {
      cancelledBy,
      error: error instanceof Error ? error.message : String(error),
      requestId,
    });

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to cancel benefit request.");
  }
}
