import { gql } from "@apollo/client";
import type { ApprovalActionType, ApprovalEntityType, ApprovalRequestStatus } from "@/shared/apollo/generated";

export type ApprovalRoleValue = "finance_manager" | "hr_admin";
export type UpdatedBenefitPayload = {
  approvalRole: ApprovalRoleValue;
  category: string;
  categoryId: string;
  description: string;
  id: string;
  isCore: boolean;
  requiresContract: boolean;
  subsidyPercent?: number | null;
  title: string;
  vendorName?: string | null;
};

export type CreateBenefitDeleteApprovalRequestMutation = {
  createApprovalRequest: {
    id: string;
    status: ApprovalRequestStatus;
  };
};

export type CreateBenefitDeleteApprovalRequestVariables = {
  input: {
    actionType: ApprovalActionType;
    entityId?: string | null;
    entityType: ApprovalEntityType;
    payloadJson: string;
    requestedBy: string;
    snapshotJson?: string | null;
    targetRole: ApprovalRoleValue;
  };
};

export type AvailableRuleDefinition = {
  default_operator: string;
  default_unit?: string | null;
  default_value?: string | null;
  description: string;
  id: string;
  name: string;
  rule_type: string;
};

export type ExistingEligibilityRule = {
  default_unit?: string | null;
  error_message: string;
  id: string;
  name: string;
  operator: string;
  rule_id: string;
  value: string;
};

export type BenefitEditRulesQuery = {
  employees?: Array<{
    email: string;
    id: string;
    name: string;
    position: string;
  } | null> | null;
  eligibilityRules: ExistingEligibilityRule[];
  ruleDefinitions: AvailableRuleDefinition[];
};

export type BenefitEditRulesVariables = {
  benefitId: string;
};

export type SubmitBenefitUpdateRequestMutation = {
  submitBenefitUpdateRequest: {
    id: string;
    status: string;
    target_role: ApprovalRoleValue;
  };
};

export type SubmitBenefitUpdateRequestVariables = {
  input: {
    requestedBy: string;
    benefit: {
      approvalRole: ApprovalRoleValue;
      categoryId: string;
      description: string;
      id: string;
      isActive?: boolean | null;
      isCore: boolean;
      name: string;
      requiresContract: boolean;
      subsidyPercent: number;
      vendorName?: string | null;
    };
    contractUpload?: {
      effectiveDate: string;
      expiryDate: string;
      fileBase64: string;
      fileName: string;
      version: string;
    } | null;
    ruleAssignments?: Array<{
      errorMessage: string;
      isActive?: boolean;
      operator: string;
      priority?: number;
      ruleId: string;
      value: string;
    }>;
  };
};

export type ContractSignedUrlByBenefitQuery = {
  contractSignedUrlByBenefit: {
    contractId: string;
    expiresAt: string;
    signedUrl: string;
  };
};

export type ContractSignedUrlByBenefitVariables = {
  benefitId: string;
};

export const CREATE_BENEFIT_DELETE_APPROVAL_REQUEST_MUTATION = gql`
  mutation CreateBenefitDeleteApprovalRequest($input: CreateApprovalRequestInput!) {
    createApprovalRequest(input: $input) {
      id
      status
    }
  }
`;

export const BENEFIT_EDIT_RULES_QUERY = gql`
  query BenefitEditRules($benefitId: ID!) {
    employees {
      id
      name
      email
      position
    }
    ruleDefinitions {
      id
      name
      description
      rule_type
      default_operator
      default_value
      default_unit
    }
    eligibilityRules(benefitId: $benefitId) {
      id
      rule_id
      name
      operator
      value
      default_unit
      error_message
    }
  }
`;
export const SUBMIT_BENEFIT_UPDATE_REQUEST_MUTATION = gql`
  mutation SubmitBenefitUpdateRequest($input: SubmitBenefitUpdateRequestInput!) {
    submitBenefitUpdateRequest(input: $input) {
      id
      status
      target_role
    }
  }
`;
export const CONTRACT_SIGNED_URL_BY_BENEFIT_QUERY = gql`
  query ContractSignedUrlByBenefit($benefitId: ID!) {
    contractSignedUrlByBenefit(benefitId: $benefitId) {
      contractId
      signedUrl
      expiresAt
    }
  }
`;
