import {
  ApprovalActionType,
  ApprovalEntityType,
  ApprovalRequestStatus,
  type ApprovalRequestsQuery,
} from "@/shared/apollo/generated";

export function isArchivedBenefit(
  benefitId: string,
  approvalRequests: ApprovalRequestsQuery["approvalRequests"],
) {
  return approvalRequests.some(
    (request) =>
      request.entity_type === ApprovalEntityType.Benefit &&
      request.entity_id === benefitId &&
      request.action_type === ApprovalActionType.Delete &&
      request.status === ApprovalRequestStatus.Approved,
  );
}

export function getPendingBenefitRequest(
  benefitId: string,
  approvalRequests: ApprovalRequestsQuery["approvalRequests"],
) {
  return approvalRequests
    .filter(
      (request) =>
        request.entity_type === ApprovalEntityType.Benefit &&
        request.entity_id === benefitId &&
        request.status === ApprovalRequestStatus.Pending &&
        (request.action_type === ApprovalActionType.Update ||
          request.action_type === ApprovalActionType.Delete),
    )
    .sort((left, right) => right.created_at.localeCompare(left.created_at))[0];
}
