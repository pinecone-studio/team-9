import { gql } from "@apollo/client";

export type ApprovalActionValue = "create" | "update";
export type ApprovalEntityValue = "benefit" | "rule";
export type ApprovalRequestStatusValue = "approved" | "pending" | "rejected";
export type ApprovalRoleValue = "finance_manager" | "hr_admin";

export type ApprovalRequestRecord = {
  action_type: ApprovalActionValue;
  created_at: string;
  entity_id?: string | null;
  entity_type: ApprovalEntityValue;
  id: string;
  is_active: boolean;
  payload_json: string;
  requested_by: string;
  review_comment?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  snapshot_json?: string | null;
  status: ApprovalRequestStatusValue;
  target_role: ApprovalRoleValue;
};

export type ApprovalRequestsQuery = {
  approvalRequests: ApprovalRequestRecord[];
};

export type ApprovalRequestQuery = {
  approvalRequest?: ApprovalRequestRecord | null;
};

export type ApprovalRequestQueryVariables = {
  id: string;
};

export type ReviewApprovalRequestMutation = {
  reviewApprovalRequest: ApprovalRequestRecord;
};

export type ReviewApprovalRequestVariables = {
  input: {
    approved: boolean;
    id: string;
    reviewComment?: string | null;
    reviewedBy: string;
  };
};

export const APPROVAL_REQUESTS_QUERY = gql`
  query ApprovalRequests {
    approvalRequests {
      id
      entity_id
      entity_type
      action_type
      status
      target_role
      requested_by
      reviewed_by
      review_comment
      payload_json
      snapshot_json
      created_at
      reviewed_at
      is_active
    }
  }
`;

export const APPROVAL_REQUEST_QUERY = gql`
  query ApprovalRequest($id: ID!) {
    approvalRequest(id: $id) {
      id
      entity_id
      entity_type
      action_type
      status
      target_role
      requested_by
      reviewed_by
      review_comment
      payload_json
      snapshot_json
      created_at
      reviewed_at
      is_active
    }
  }
`;

export const REVIEW_APPROVAL_REQUEST_MUTATION = gql`
  mutation ReviewApprovalRequest($input: ReviewApprovalRequestInput!) {
    reviewApprovalRequest(input: $input) {
      id
      entity_id
      entity_type
      action_type
      status
      target_role
      requested_by
      reviewed_by
      review_comment
      payload_json
      snapshot_json
      created_at
      reviewed_at
      is_active
    }
  }
`;
