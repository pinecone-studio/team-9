import { gql } from "@apollo/client";

export type ApprovalRoleValue = "finance_manager" | "hr_admin";

export type BenefitRequestRecord = {
  approval_role: ApprovalRoleValue;
  benefit: {
    category: string;
    id: string;
    title: string;
  };
  created_at: string;
  employee: {
    email: string;
    id: string;
    name: string;
    position: string;
  };
  id: string;
  reviewed_by?: {
    email: string;
    id: string;
    name: string;
    position: string;
  } | null;
  status: "approved" | "cancelled" | "pending" | "rejected";
  updated_at: string;
};

export type BenefitRequestsQuery = {
  benefitRequests: BenefitRequestRecord[];
};

export type ReviewBenefitRequestMutation = {
  reviewBenefitRequest: BenefitRequestRecord;
};

export type ReviewBenefitRequestVariables = {
  input: {
    approved: boolean;
    id: string;
    reviewedBy: string;
  };
};

export const BENEFIT_REQUESTS_QUERY = gql`
  query BenefitRequests($targetRole: ApprovalRole) {
    benefitRequests(targetRole: $targetRole) {
      id
      status
      created_at
      updated_at
      approval_role
      employee {
        id
        name
        email
        position
      }
      benefit {
        id
        title
        category
      }
      reviewed_by {
        id
        name
        email
        position
      }
    }
  }
`;

export const REVIEW_BENEFIT_REQUEST_MUTATION = gql`
  mutation ReviewBenefitRequest($input: ReviewBenefitRequestInput!) {
    reviewBenefitRequest(input: $input) {
      id
      status
      created_at
      updated_at
      approval_role
      employee {
        id
        name
        email
        position
      }
      benefit {
        id
        title
        category
      }
      reviewed_by {
        id
        name
        email
        position
      }
    }
  }
`;
