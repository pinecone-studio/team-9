import { eq } from "drizzle-orm";

import { getDb } from "../../../db";
import { approvalRequests } from "../../../db/schema/approval-requests";
import {
	ApprovalRequestStatus,
	ApprovalEntityType,
	type BenefitRuleAssignmentInput,
	type CreateBenefitInput,
	type ApprovalRequest,
	type CreateRuleDefinitionInput,
	type MutationReviewApprovalRequestArgs,
	type UpdateRuleDefinitionInput,
	type UpdateBenefitInput,
} from "../../generated/resolvers-types";
import { mapApprovalRequest } from "../approval-request-mappers";
import { applyCreateBenefit, applyUpdateBenefit } from "./benefit-service";
import { applyCreateRuleDefinition, applyUpdateRuleDefinition } from "./rule-definition-service";

export async function reviewApprovalRequest(
  DB: D1Database,
  args: MutationReviewApprovalRequestArgs,
): Promise<ApprovalRequest> {
  const db = getDb({ DB });
  const input = args.input;

  const [existing] = await db
    .select()
    .from(approvalRequests)
    .where(eq(approvalRequests.id, input.id))
    .limit(1);

  if (!existing) {
    throw new Error(`Approval request not found: ${input.id}`);
  }

  if (existing.status !== ApprovalRequestStatus.Pending) {
    throw new Error("Only pending approval requests can be reviewed");
  }

  if (existing.requestedBy === input.reviewedBy) {
    throw new Error("The requester cannot approve or reject their own request");
  }

  const nextStatus = input.approved ? ApprovalRequestStatus.Approved : ApprovalRequestStatus.Rejected;
  const reviewComment = input.reviewComment?.trim() || null;
  const reviewedAt = new Date().toISOString();
  let entityId = existing.entityId;

  if (input.approved) {
    if (existing.entityType === ApprovalEntityType.Rule) {
      const payload = JSON.parse(existing.payloadJson) as {
        rule?: CreateRuleDefinitionInput | UpdateRuleDefinitionInput;
      };

      if (!payload.rule) {
        throw new Error("Approval request payload is missing rule data");
      }

      if (existing.actionType === "create") {
        const created = await applyCreateRuleDefinition(DB, payload.rule as CreateRuleDefinitionInput);
        entityId = created.id;
      } else if (existing.actionType === "update") {
        const updated = await applyUpdateRuleDefinition(DB, payload.rule as UpdateRuleDefinitionInput);
        entityId = updated.id;
      }
    }

    if (existing.entityType === ApprovalEntityType.Benefit) {
      const payload = JSON.parse(existing.payloadJson) as {
        benefit?: CreateBenefitInput | UpdateBenefitInput;
        ruleAssignments?: BenefitRuleAssignmentInput[];
      };

      if (!payload.benefit) {
        throw new Error("Approval request payload is missing benefit data");
      }

      if (existing.actionType === "create") {
        const created = await applyCreateBenefit(
          DB,
          payload.benefit as CreateBenefitInput,
          payload.ruleAssignments ?? [],
        );
        entityId = created.id;
      } else if (existing.actionType === "update") {
        const updated = await applyUpdateBenefit(
          DB,
          payload.benefit as UpdateBenefitInput,
          payload.ruleAssignments ?? [],
        );
        entityId = updated.id;
      }
    }
  }

  await db
    .update(approvalRequests)
    .set({
      entityId,
      status: nextStatus,
      reviewedBy: input.reviewedBy,
      reviewComment,
      reviewedAt,
    })
    .where(eq(approvalRequests.id, input.id));

  return mapApprovalRequest({
    id: existing.id,
    entityType: existing.entityType,
    entityId,
    actionType: existing.actionType,
    status: nextStatus,
    targetRole: existing.targetRole,
    requestedBy: existing.requestedBy,
    reviewedBy: input.reviewedBy,
    reviewComment,
    payloadJson: existing.payloadJson,
    snapshotJson: existing.snapshotJson,
    createdAt: existing.createdAt,
    reviewedAt,
    isActive: existing.isActive,
  });
}
