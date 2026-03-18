import { and, eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { approvalRequests } from '../../../db/schema/approval-requests';
import { benefitEligibility } from '../../../db/schema/benefit-eligibility';
import { benefits } from '../../../db/schema/benefits';
import { contracts } from '../../../db/schema/contracts';
import { employees } from '../../../db/schema/employees';
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
import { computeEmployeeEligibility } from './compute-employee-eligibility';
import { deleteRuleDefinition } from './delete-rule-definition';
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

type EmployeeBenefitRequestPayload = {
	benefitId?: unknown;
	employeeId?: unknown;
	requestedStatus?: unknown;
};

const EMPLOYEE_REQUEST_ACTIVE_STATUS = 'active';
const EMPLOYEE_REQUEST_DEFAULT_RESTORE_STATUS = 'eligible';

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

function readTrimmedString(value: unknown): string | null {
	return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function normalizeEligibilityStatus(value: unknown): 'active' | 'eligible' | 'locked' | 'pending' | null {
	if (typeof value !== 'string') {
		return null;
	}

	const normalized = value.trim().toLowerCase();
	if (
		normalized === 'active' ||
		normalized === 'eligible' ||
		normalized === 'locked' ||
		normalized === 'pending'
	) {
		return normalized;
	}

	return null;
}

function parseEmployeeBenefitRequestPayload(payload: unknown): EmployeeBenefitRequestPayload | null {
	if (!payload || typeof payload !== 'object') {
		return null;
	}

	const employeeRequest = (payload as Record<string, unknown>).employeeRequest;
	if (!employeeRequest || typeof employeeRequest !== 'object') {
		return null;
	}

	return employeeRequest as EmployeeBenefitRequestPayload;
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

async function recomputeAllEmployeeEligibility(DB: D1Database) {
	const db = getDb({ DB });
	const employeeRows = await db.select({ id: employees.id }).from(employees);

	for (const employee of employeeRows) {
		await computeEmployeeEligibility({ DB }, employee.id);
	}
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
  const payload = JSON.parse(existing.payloadJson) as Record<string, unknown>;
  const snapshot = existing.snapshotJson
    ? (JSON.parse(existing.snapshotJson) as Record<string, unknown>)
    : null;
  const employeeRequest = parseEmployeeBenefitRequestPayload(payload);

  if (input.approved) {
    if (existing.entityType === ApprovalEntityType.Rule) {
      const rulePayload = payload as {
        rule?: CreateRuleDefinitionInput | UpdateRuleDefinitionInput;
      };

      if (!rulePayload.rule) {
        throw new Error("Approval request payload is missing rule data");
      }

      if (existing.actionType === "create") {
        const created = await applyCreateRuleDefinition(env.DB, rulePayload.rule as CreateRuleDefinitionInput);
        entityId = created.id;
      } else if (existing.actionType === "update") {
        const updated = await applyUpdateRuleDefinition(env.DB, rulePayload.rule as UpdateRuleDefinitionInput);
        entityId = updated.id;
      } else if (existing.actionType === "delete") {
        if (!existing.entityId) {
          throw new Error("Delete approval request is missing entity id");
        }

        await deleteRuleDefinition(env.DB, existing.entityId);
      }
    }

    if (existing.entityType === ApprovalEntityType.Benefit) {
      const benefitPayload = payload as {
        benefit?: CreateBenefitInput | UpdateBenefitInput;
        contractUpload?: unknown;
        ruleAssignments?: BenefitRuleAssignmentInput[];
      };
      const employeeId = readTrimmedString(employeeRequest?.employeeId);
      const payloadBenefitId = readTrimmedString(employeeRequest?.benefitId);
      const requestedStatus = readTrimmedString(employeeRequest?.requestedStatus);
      const requestedBenefitId = payloadBenefitId ?? existing.entityId;
      const isEmployeeActivationRequest =
        existing.actionType === "update" && employeeId && requestedBenefitId;

      if (isEmployeeActivationRequest) {
        if (
          requestedStatus &&
          requestedStatus.toLowerCase() !== EMPLOYEE_REQUEST_ACTIVE_STATUS
        ) {
          throw new Error("Employee request can only activate a benefit");
        }

        const [eligibility] = await db
          .select({
            status: benefitEligibility.status,
          })
          .from(benefitEligibility)
          .where(
            and(
              eq(benefitEligibility.employeeId, employeeId),
              eq(benefitEligibility.benefitId, requestedBenefitId),
            ),
          )
          .limit(1);

        if (!eligibility) {
          throw new Error("Employee eligibility record not found for this request");
        }

        if (eligibility.status !== "pending") {
          throw new Error("Only pending employee benefit requests can be approved");
        }

        await db
          .update(benefitEligibility)
          .set({
            computedAt: reviewedAt,
            overrideBy: null,
            overrideExpiresAt: null,
            overrideReason:
              reviewComment ?? "Approved employee benefit activation request",
            status: EMPLOYEE_REQUEST_ACTIVE_STATUS,
          })
          .where(
            and(
              eq(benefitEligibility.employeeId, employeeId),
              eq(benefitEligibility.benefitId, requestedBenefitId),
            ),
          );

        entityId = requestedBenefitId;
      } else if (!benefitPayload.benefit) {
        throw new Error("Approval request payload is missing benefit data");
      } else {
        if (existing.actionType === "create") {
          const created = await applyCreateBenefit(
            env.DB,
            benefitPayload.benefit as CreateBenefitInput,
            benefitPayload.ruleAssignments ?? [],
          );
          entityId = created.id;
        } else if (existing.actionType === "update") {
          const updated = await applyUpdateBenefit(
            env.DB,
            benefitPayload.benefit as UpdateBenefitInput,
            benefitPayload.ruleAssignments ?? [],
          );
          entityId = updated.id;
        }

        if (entityId && isContractUploadPayload(benefitPayload.contractUpload)) {
          const vendorName = benefitPayload.benefit.vendorName?.trim();
          if (!vendorName) {
            throw new Error('Benefit vendorName is required to persist contract metadata');
          }
          await createBenefitContractRecord(env.DB, entityId, vendorName, benefitPayload.contractUpload);
        }

        await recomputeAllEmployeeEligibility(env.DB);
      }
    }
  } else if (existing.entityType === ApprovalEntityType.Benefit) {
    const benefitPayload = payload as {
      contractUpload?: unknown;
    };
    const employeeId = readTrimmedString(employeeRequest?.employeeId);
    const payloadBenefitId = readTrimmedString(employeeRequest?.benefitId);
    const requestedBenefitId = payloadBenefitId ?? existing.entityId;
    const isEmployeeActivationRequest =
      existing.actionType === "update" && employeeId && requestedBenefitId;

    if (isEmployeeActivationRequest) {
      const snapshotEmployeeRequest =
        snapshot &&
        typeof snapshot.employeeRequest === "object" &&
        snapshot.employeeRequest !== null
          ? (snapshot.employeeRequest as Record<string, unknown>)
          : null;
      const restoreStatus =
        normalizeEligibilityStatus(snapshotEmployeeRequest?.previousStatus) ??
        normalizeEligibilityStatus(snapshot?.previousStatus) ??
        EMPLOYEE_REQUEST_DEFAULT_RESTORE_STATUS;
      const nextEligibilityStatus =
        restoreStatus === "pending"
          ? EMPLOYEE_REQUEST_DEFAULT_RESTORE_STATUS
          : restoreStatus;

      await db
        .update(benefitEligibility)
        .set({
          computedAt: reviewedAt,
          overrideBy: null,
          overrideExpiresAt: null,
          overrideReason:
            reviewComment ?? "Rejected employee benefit activation request",
          status: nextEligibilityStatus,
        })
        .where(
          and(
            eq(benefitEligibility.employeeId, employeeId),
            eq(benefitEligibility.benefitId, requestedBenefitId),
          ),
        );
      entityId = requestedBenefitId;
    }

    if (isContractUploadPayload(benefitPayload.contractUpload)) {
      await deleteFromR2(env.CONTRACTS_BUCKET, benefitPayload.contractUpload.r2ObjectKey);
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
