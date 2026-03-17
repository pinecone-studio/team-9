import { gql } from "@apollo/client";

export type ApprovalRoleValue = "finance_manager" | "hr_admin";

export type CreateApprovalRequestMutation = {
  createApprovalRequest: {
    id: string;
    status: "approved" | "pending" | "rejected";
  };
};

export type CreateApprovalRequestVariables = {
  input: {
    actionType: "create" | "update";
    entityId?: string | null;
    entityType: "benefit" | "rule";
    payloadJson: string;
    requestedBy: string;
    snapshotJson?: string | null;
    targetRole: ApprovalRoleValue;
  };
};

export const CREATE_APPROVAL_REQUEST_MUTATION = gql`
  mutation CreateApprovalRequest($input: CreateApprovalRequestInput!) {
    createApprovalRequest(input: $input) {
      id
      status
    }
  }
`;
