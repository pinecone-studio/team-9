import type { ApprovalRequestsQuery } from "@/shared/apollo/generated";

import type { PendingBenefitRequest } from "./benefit-types";

export function normalizePendingBenefitRequest(
  pendingRequest: PendingBenefitRequest | ApprovalRequestsQuery["approvalRequests"][number] | null,
): PendingBenefitRequest | null {
  if (!pendingRequest) {
    return null;
  }

  if ("actionType" in pendingRequest) {
    return pendingRequest;
  }

  return {
    actionType: pendingRequest.action_type,
    createdAt: pendingRequest.created_at,
    id: pendingRequest.id,
    requestedBy: pendingRequest.requested_by,
    status: pendingRequest.status,
    targetRole: pendingRequest.target_role,
  };
}
