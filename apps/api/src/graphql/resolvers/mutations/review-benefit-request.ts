import { eq, or } from "drizzle-orm";

import { getDb } from "../../../db";
import { benefitRequests } from "../../../db/schema/benefit-requests";
import { employees } from "../../../db/schema/employees";
import type {
  BenefitRequest,
  MutationReviewBenefitRequestArgs,
} from "../../generated/resolvers-types";
import { listBenefitRequests } from "../queries/list-benefit-requests";

export async function reviewBenefitRequest(
  DB: D1Database,
  args: MutationReviewBenefitRequestArgs,
): Promise<BenefitRequest> {
  const db = getDb({ DB });
  const input = args.input;

  const [existing] = await db
    .select()
    .from(benefitRequests)
    .where(eq(benefitRequests.id, input.id))
    .limit(1);

  if (!existing) {
    throw new Error(`Benefit request not found: ${input.id}`);
  }

  if (existing.status !== "pending") {
    throw new Error("Only pending benefit requests can be reviewed");
  }

  const [reviewer] = await db
    .select({ id: employees.id })
    .from(employees)
    .where(or(eq(employees.id, input.reviewedBy), eq(employees.email, input.reviewedBy)))
    .limit(1);

  if (!reviewer) {
    throw new Error("Reviewer employee record not found");
  }

  const nextStatus = input.approved ? "approved" : "rejected";
  const updatedAt = new Date().toISOString();

  await db
    .update(benefitRequests)
    .set({
      reviewedBy: reviewer.id,
      status: nextStatus,
      updatedAt,
    })
    .where(eq(benefitRequests.id, input.id));

  const result = (await listBenefitRequests(DB, {})).find((request) => request.id === input.id);
  if (!result) {
    throw new Error("Reviewed benefit request could not be loaded");
  }

  return result;
}
