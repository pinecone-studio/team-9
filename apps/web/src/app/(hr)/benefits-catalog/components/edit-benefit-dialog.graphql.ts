import { gql } from "@apollo/client";

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

export type DeleteBenefitMutation = {
  deleteBenefit: boolean;
};

export type DeleteBenefitVariables = {
  id: string;
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
      isCore: boolean;
      name: string;
      requiresContract: boolean;
      subsidyPercent: number;
      vendorName?: string | null;
    };
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

export const DELETE_BENEFIT_MUTATION = gql`
  mutation DeleteBenefit($id: ID!) {
    deleteBenefit(id: $id)
  }
`;

export const BENEFIT_EDIT_RULES_QUERY = gql`
  query BenefitEditRules($benefitId: ID!) {
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
