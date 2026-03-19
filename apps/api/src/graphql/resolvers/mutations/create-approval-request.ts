import { getDb } from "../../../db";
import { approvalRequests } from "../../../db/schema/approval-requests";
import {
  ApprovalRequestStatus,
  type ApprovalRequest,
  type MutationCreateApprovalRequestArgs,
} from "../../generated/resolvers-types";
import {
  scheduleNotification,
  sendApprovalRequestSubmittedNotification,
  type NotificationRuntime,
} from "../../../notifications";
import { mapApprovalRequest } from "../approval-request-mappers";

function hasEmployeeRequestPayload(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const employeeRequest = (payload as Record<string, unknown>).employeeRequest;
  return Boolean(employeeRequest && typeof employeeRequest === "object");
}

export async function createApprovalRequest(
  env: NotificationRuntime,
  args: MutationCreateApprovalRequestArgs,
): Promise<ApprovalRequest> {
  const db = getDb({ DB: env.DB });
  const input = args.input;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const status = ApprovalRequestStatus.Pending;
  const requestedBy = input.requestedBy.trim();
  const entityId = input.entityId?.trim() || null;

  if (!requestedBy) {
    throw new Error("requestedBy is required");
  }

  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(input.payloadJson) as unknown;
    if (input.snapshotJson) {
      JSON.parse(input.snapshotJson);
    }
  } catch (error) {
    throw new Error(
      `Invalid request payload: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (hasEmployeeRequestPayload(parsedPayload)) {
    throw new Error(
      "Employee benefit requests must use submitEmployeeBenefitRequest.",
    );
  }

  await db.insert(approvalRequests).values({
    id,
    entityType: input.entityType,
    entityId,
    actionType: input.actionType,
    status,
    targetRole: input.targetRole,
    requestedBy,
    payloadJson: input.payloadJson,
    snapshotJson: input.snapshotJson ?? null,
    createdAt: now,
    isActive: true,
  });

  scheduleNotification(env, "approval_request_submitted", () =>
    sendApprovalRequestSubmittedNotification(env, {
      actionType: input.actionType,
      entityType: input.entityType,
      requestId: id,
      requestedBy,
      targetRole: input.targetRole,
    }),
  );

  return mapApprovalRequest({
    id,
    entityType: input.entityType,
    entityId,
    actionType: input.actionType,
    status,
    targetRole: input.targetRole,
    requestedBy,
    reviewedBy: null,
    reviewComment: null,
    payloadJson: input.payloadJson,
    snapshotJson: input.snapshotJson ?? null,
    createdAt: now,
    reviewedAt: null,
    isActive: true,
  });
}
