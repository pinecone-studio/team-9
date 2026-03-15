import { getDb } from '../../../db';
import { approvalRequests } from '../../../db/schema/approval-requests';
import {
	ApprovalActionType,
	ApprovalEntityType,
	ApprovalRequestStatus,
	type ApprovalRequest,
	type MutationSubmitBenefitCreateRequestArgs,
} from '../../generated/resolvers-types';
import { mapApprovalRequest } from '../approval-request-mappers';
import { prepareCreateBenefit } from './benefit-service';

export async function submitBenefitCreateRequest(
	DB: D1Database,
	args: MutationSubmitBenefitCreateRequestArgs,
): Promise<ApprovalRequest> {
	const db = getDb({ DB });
	const id = crypto.randomUUID();
	const input = args.input;
	const createdAt = new Date().toISOString();
	const prepared = await prepareCreateBenefit(DB, input.benefit);
	const requestedBy = input.requestedBy.trim();

	if (!requestedBy) {
		throw new Error('requestedBy is required');
	}

	const payloadJson = JSON.stringify({
		benefit: input.benefit,
		ruleAssignments: input.ruleAssignments ?? [],
	});

	await db.insert(approvalRequests).values({
		id,
		entityType: ApprovalEntityType.Benefit,
		entityId: null,
		actionType: ApprovalActionType.Create,
		status: ApprovalRequestStatus.Pending,
		targetRole: prepared.approvalRole,
		requestedBy,
		payloadJson,
		snapshotJson: null,
		createdAt,
		isActive: true,
	});

	return mapApprovalRequest({
		id,
		entityType: ApprovalEntityType.Benefit,
		entityId: null,
		actionType: ApprovalActionType.Create,
		status: ApprovalRequestStatus.Pending,
		targetRole: prepared.approvalRole,
		requestedBy,
		reviewedBy: null,
		reviewComment: null,
		payloadJson,
		snapshotJson: null,
		createdAt,
		reviewedAt: null,
		isActive: true,
	});
}
