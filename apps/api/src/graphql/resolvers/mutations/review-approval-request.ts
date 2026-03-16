import { eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { approvalRequests } from '../../../db/schema/approval-requests';
import { benefits } from '../../../db/schema/benefits';
import { contracts } from '../../../db/schema/contracts';
import { deleteFromR2 } from '../../../lib/r2';
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
} from '../../generated/resolvers-types';
import { mapApprovalRequest } from '../approval-request-mappers';
import { applyCreateBenefit, applyUpdateBenefit } from './benefit-service';
import { applyCreateRuleDefinition, applyUpdateRuleDefinition } from './rule-definition-service';

type ReviewApprovalEnv = {
	DB: D1Database;
	CONTRACTS_BUCKET: R2Bucket;
};

type ContractUploadPayload = {
	effectiveDate: string;
	expiryDate: string;
	fileName: string;
	r2ObjectKey: string;
	sha256Hash: string;
	version: string;
};

function isContractUploadPayload(value: unknown): value is ContractUploadPayload {
	if (!value || typeof value !== 'object') {
		return false;
	}

	const candidate = value as Record<string, unknown>;
	return (
		typeof candidate.effectiveDate === 'string' &&
		typeof candidate.expiryDate === 'string' &&
		typeof candidate.fileName === 'string' &&
		typeof candidate.r2ObjectKey === 'string' &&
		typeof candidate.sha256Hash === 'string' &&
		typeof candidate.version === 'string'
	);
}

async function createBenefitContractRecord(
	DB: D1Database,
	benefitId: string,
	vendorName: string,
	contractUpload: ContractUploadPayload,
) {
	const db = getDb({ DB });

	await db.update(contracts).set({ isActive: false }).where(eq(contracts.benefitId, benefitId));

	const contractId = crypto.randomUUID();
	await db.insert(contracts).values({
		id: contractId,
		benefitId,
		vendorName,
		version: contractUpload.version,
		r2ObjectKey: contractUpload.r2ObjectKey,
		sha256Hash: contractUpload.sha256Hash,
		effectiveDate: contractUpload.effectiveDate,
		expiryDate: contractUpload.expiryDate,
		isActive: true,
	});

	await db.update(benefits).set({ activeContractId: contractId }).where(eq(benefits.id, benefitId));
}

export async function reviewApprovalRequest(
  env: ReviewApprovalEnv,
  args: MutationReviewApprovalRequestArgs,
): Promise<ApprovalRequest> {
  const db = getDb({ DB: env.DB });
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
        const created = await applyCreateRuleDefinition(env.DB, payload.rule as CreateRuleDefinitionInput);
        entityId = created.id;
      } else if (existing.actionType === "update") {
        const updated = await applyUpdateRuleDefinition(env.DB, payload.rule as UpdateRuleDefinitionInput);
        entityId = updated.id;
      }
    }

    if (existing.entityType === ApprovalEntityType.Benefit) {
      const payload = JSON.parse(existing.payloadJson) as {
        benefit?: CreateBenefitInput | UpdateBenefitInput;
        contractUpload?: unknown;
        ruleAssignments?: BenefitRuleAssignmentInput[];
      };

      if (!payload.benefit) {
        throw new Error("Approval request payload is missing benefit data");
      }

      if (existing.actionType === "create") {
        const created = await applyCreateBenefit(
          env.DB,
          payload.benefit as CreateBenefitInput,
          payload.ruleAssignments ?? [],
        );
        entityId = created.id;
      } else if (existing.actionType === "update") {
        const updated = await applyUpdateBenefit(
          env.DB,
          payload.benefit as UpdateBenefitInput,
          payload.ruleAssignments ?? [],
        );
        entityId = updated.id;
      }

      if (entityId && isContractUploadPayload(payload.contractUpload)) {
        const vendorName = payload.benefit.vendorName?.trim();
        if (!vendorName) {
          throw new Error('Benefit vendorName is required to persist contract metadata');
        }
        await createBenefitContractRecord(env.DB, entityId, vendorName, payload.contractUpload);
      }
    }
  } else if (existing.entityType === ApprovalEntityType.Benefit) {
    const payload = JSON.parse(existing.payloadJson) as {
      contractUpload?: unknown;
    };

    if (isContractUploadPayload(payload.contractUpload)) {
      await deleteFromR2(env.CONTRACTS_BUCKET, payload.contractUpload.r2ObjectKey);
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
