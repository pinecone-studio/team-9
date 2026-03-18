import { gql } from "@apollo/client";

export type ApprovalRoleValue = "finance_manager" | "hr_admin";

export type BenefitRequestRecord = {
  approval_role: ApprovalRoleValue;
  benefit: {
    category: string;
    description: string;
    id: string;
    requiresContract: boolean;
    subsidyPercent?: number | null;
    title: string;
    vendorName?: string | null;
  };
  contractAcceptedAt?: string | null;
  contractVersionAccepted?: string | null;
  created_at: string;
  employee: {
    department: string;
    email: string;
    employmentStatus: string;
    id: string;
    name: string;
    position: string;
    responsibilityLevel: number;
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

export type BenefitRequestContractQuery = {
  contractSignedUrlByBenefit: {
    contractId: string;
    expiresAt: string;
    signedUrl: string;
  };
};

export type BenefitRequestContractVariables = {
  benefitId: string;
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
        department
        employmentStatus
        responsibilityLevel
      }
      benefit {
        id
        title
        category
        description
        requiresContract
        subsidyPercent
        vendorName
      }
      contractAcceptedAt
      contractVersionAccepted
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
        department
        employmentStatus
        responsibilityLevel
      }
      benefit {
        id
        title
        category
        description
        requiresContract
        subsidyPercent
        vendorName
      }
      contractAcceptedAt
      contractVersionAccepted
      reviewed_by {
        id
        name
        email
        position
      }
    }
  }
`;

export const BENEFIT_REQUEST_CONTRACT_QUERY = gql`
  query BenefitRequestContract($benefitId: ID!) {
    contractSignedUrlByBenefit(benefitId: $benefitId) {
      contractId
      expiresAt
      signedUrl
    }
  }
`;
