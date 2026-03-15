import { getDb } from '../../../db';
import { approvalRequests } from '../../../db/schema/approval-requests';
import {
	ApprovalActionType,
	ApprovalEntityType,
	ApprovalRequestStatus,
	type ApprovalRequest,
	type MutationSubmitBenefitUpdateRequestArgs,
} from '../../generated/resolvers-types';
import { mapApprovalRequest } from '../approval-request-mappers';
import { getBenefitSnapshot, prepareUpdateBenefit } from './benefit-service';

export async function submitBenefitUpdateRequest(
	DB: D1Database,
	args: MutationSubmitBenefitUpdateRequestArgs,
): Promise<ApprovalRequest> {
	const db = getDb({ DB });
	const id = crypto.randomUUID();
	const input = args.input;
	const createdAt = new Date().toISOString();
	const prepared = await prepareUpdateBenefit(DB, input.benefit);
	const snapshot = await getBenefitSnapshot(DB, input.benefit.id);
	const requestedBy = input.requestedBy.trim();

	if (!requestedBy) {
		throw new Error('requestedBy is required');
	}

	const payloadJson = JSON.stringify({
		benefit: input.benefit,
		ruleAssignments: input.ruleAssignments ?? [],
	});
	const snapshotJson = JSON.stringify(snapshot);

	await db.insert(approvalRequests).values({
		id,
		entityType: ApprovalEntityType.Benefit,
		entityId: input.benefit.id,
		actionType: ApprovalActionType.Update,
		status: ApprovalRequestStatus.Pending,
		targetRole: prepared.approvalRole,
		requestedBy,
		payloadJson,
		snapshotJson,
		createdAt,
		isActive: true,
	});

	return mapApprovalRequest({
		id,
		entityType: ApprovalEntityType.Benefit,
		entityId: input.benefit.id,
		actionType: ApprovalActionType.Update,
		status: ApprovalRequestStatus.Pending,
		targetRole: prepared.approvalRole,
		requestedBy,
		reviewedBy: null,
		reviewComment: null,
		payloadJson,
		snapshotJson,
		createdAt,
		reviewedAt: null,
		isActive: true,
	});
}
