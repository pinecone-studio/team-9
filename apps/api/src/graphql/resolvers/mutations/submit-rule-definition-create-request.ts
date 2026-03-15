import { getDb } from '../../../db';
import { approvalRequests } from '../../../db/schema/approval-requests';
import {
	ApprovalActionType,
	ApprovalEntityType,
	ApprovalRequestStatus,
	ApprovalRole,
	type ApprovalRequest,
	type MutationSubmitRuleDefinitionCreateRequestArgs,
} from '../../generated/resolvers-types';
import { mapApprovalRequest } from '../approval-request-mappers';
import { prepareCreateRuleDefinition } from './rule-definition-service';

export async function submitRuleDefinitionCreateRequest(
	DB: D1Database,
	args: MutationSubmitRuleDefinitionCreateRequestArgs,
): Promise<ApprovalRequest> {
	const db = getDb({ DB });
	const input = args.input;
	const id = crypto.randomUUID();
	const createdAt = new Date().toISOString();

	await prepareCreateRuleDefinition(DB, input.rule);

	const payloadJson = JSON.stringify({ rule: input.rule });

	await db.insert(approvalRequests).values({
		id,
		entityType: ApprovalEntityType.Rule,
		entityId: null,
		actionType: ApprovalActionType.Create,
		status: ApprovalRequestStatus.Pending,
		targetRole: ApprovalRole.HrAdmin,
		requestedBy: input.requestedBy.trim(),
		payloadJson,
		snapshotJson: null,
		createdAt,
		isActive: true,
	});

	return mapApprovalRequest({
		id,
		entityType: ApprovalEntityType.Rule,
		entityId: null,
		actionType: ApprovalActionType.Create,
		status: ApprovalRequestStatus.Pending,
		targetRole: ApprovalRole.HrAdmin,
		requestedBy: input.requestedBy.trim(),
		reviewedBy: null,
		reviewComment: null,
		payloadJson,
		snapshotJson: null,
		createdAt,
		reviewedAt: null,
		isActive: true,
	});
}
