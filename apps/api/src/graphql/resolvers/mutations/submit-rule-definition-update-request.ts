import { getDb } from '../../../db';
import { approvalRequests } from '../../../db/schema/approval-requests';
import {
	ApprovalActionType,
	ApprovalEntityType,
	ApprovalRequestStatus,
	ApprovalRole,
	type ApprovalRequest,
	type MutationSubmitRuleDefinitionUpdateRequestArgs,
} from '../../generated/resolvers-types';
import { mapApprovalRequest } from '../approval-request-mappers';
import { getRuleDefinitionSnapshot, prepareUpdateRuleDefinition } from './rule-definition-service';

export async function submitRuleDefinitionUpdateRequest(
	DB: D1Database,
	args: MutationSubmitRuleDefinitionUpdateRequestArgs,
): Promise<ApprovalRequest> {
	const db = getDb({ DB });
	const input = args.input;
	const id = crypto.randomUUID();
	const createdAt = new Date().toISOString();

	await prepareUpdateRuleDefinition(DB, input.rule);
	const snapshot = await getRuleDefinitionSnapshot(DB, input.rule.id);

	const payloadJson = JSON.stringify({ rule: input.rule });
	const snapshotJson = JSON.stringify(snapshot);
	const targetRole = input.approvalRole ?? ApprovalRole.HrAdmin;

	await db.insert(approvalRequests).values({
		id,
		entityType: ApprovalEntityType.Rule,
		entityId: input.rule.id,
		actionType: ApprovalActionType.Update,
		status: ApprovalRequestStatus.Pending,
		targetRole,
		requestedBy: input.requestedBy.trim(),
		payloadJson,
		snapshotJson,
		createdAt,
		isActive: true,
	});

	return mapApprovalRequest({
		id,
		entityType: ApprovalEntityType.Rule,
		entityId: input.rule.id,
		actionType: ApprovalActionType.Update,
		status: ApprovalRequestStatus.Pending,
		targetRole,
		requestedBy: input.requestedBy.trim(),
		reviewedBy: null,
		reviewComment: null,
		payloadJson,
		snapshotJson,
		createdAt,
		reviewedAt: null,
		isActive: true,
	});
}
