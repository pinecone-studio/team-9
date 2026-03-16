import { getDb } from "../../../db";
import { approvalRequests } from "../../../db/schema/approval-requests";
import {
  ApprovalRequestStatus,
  type ApprovalRequest,
  type MutationCreateApprovalRequestArgs,
} from "../../generated/resolvers-types";
import { mapApprovalRequest } from "../approval-request-mappers";

export async function createApprovalRequest(
  DB: D1Database,
  args: MutationCreateApprovalRequestArgs,
): Promise<ApprovalRequest> {
  const db = getDb({ DB });
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const input = args.input;

  JSON.parse(input.payloadJson);
  if (input.snapshotJson) JSON.parse(input.snapshotJson);
  const status = ApprovalRequestStatus.Pending;

  await db.insert(approvalRequests).values({
    id,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    actionType: input.actionType,
    status,
    targetRole: input.targetRole,
    requestedBy: input.requestedBy,
    payloadJson: input.payloadJson,
    snapshotJson: input.snapshotJson ?? null,
    createdAt: now,
    isActive: true,
  });

  return mapApprovalRequest({
    id,
    entityType: input.entityType,
    entityId: input.entityId ?? null,
    actionType: input.actionType,
    status,
    targetRole: input.targetRole,
    requestedBy: input.requestedBy,
    reviewedBy: null,
    reviewComment: null,
    payloadJson: input.payloadJson,
    snapshotJson: input.snapshotJson ?? null,
    createdAt: now,
    reviewedAt: null,
    isActive: true,
  });
}
