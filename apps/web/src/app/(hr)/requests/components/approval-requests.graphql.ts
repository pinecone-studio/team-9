import {
  ApprovalRequestDocument,
  ApprovalRequestsDocument,
  RequestsEmployeesDirectoryDocument,
  ReviewApprovalRequestDocument,
  type ApprovalActionType,
  type ApprovalEntityType,
  type ApprovalRequestQuery,
  type ApprovalRequestQueryVariables,
  type ApprovalRequestsQuery,
  type ApprovalRole,
  type RequestsEmployeesDirectoryQuery,
  type ReviewApprovalRequestMutation,
  type ReviewApprovalRequestMutationVariables,
} from "@/shared/apollo/generated";

export type ApprovalActionValue = ApprovalActionType;
export type ApprovalEntityValue = ApprovalEntityType;
export type ApprovalRoleValue = ApprovalRole;
export type ApprovalRequestStatusValue = ApprovalRequestsQuery["approvalRequests"][number]["status"];
export type ApprovalRequestRecord = ApprovalRequestsQuery["approvalRequests"][number];
export type RequestsEmployeeDirectoryRecord =
  NonNullable<RequestsEmployeesDirectoryQuery["employees"]>[number];
export type ReviewApprovalRequestVariables =
  ReviewApprovalRequestMutationVariables;

export type {
  ApprovalRequestQuery,
  ApprovalRequestQueryVariables,
  ApprovalRequestsQuery,
  RequestsEmployeesDirectoryQuery,
  ReviewApprovalRequestMutation,
  ReviewApprovalRequestMutationVariables,
};

export const APPROVAL_REQUESTS_QUERY = ApprovalRequestsDocument;
export const REQUESTS_EMPLOYEES_DIRECTORY_QUERY = RequestsEmployeesDirectoryDocument;
export const APPROVAL_REQUEST_QUERY = ApprovalRequestDocument;
export const REVIEW_APPROVAL_REQUEST_MUTATION = ReviewApprovalRequestDocument;
