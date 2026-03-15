import { gql } from "@apollo/client";

export type ApprovalRoleValue = "finance_manager" | "hr_admin";

export type AvailableRuleDefinition = {
  default_operator: string;
  default_unit?: string | null;
  default_value?: string | null;
  description: string;
  id: string;
  name: string;
  rule_type: string;
};

export type AddBenefitRulesQuery = {
  ruleDefinitions: AvailableRuleDefinition[];
};

export type CreateBenefitMutation = {
  submitBenefitCreateRequest: {
    id: string;
    status: string;
    target_role: ApprovalRoleValue;
  };
};

export type CreateBenefitVariables = {
  input: {
    requestedBy: string;
    benefit: {
      approvalRole: ApprovalRoleValue;
      categoryId: string;
      description: string;
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

export const ADD_BENEFIT_RULES_QUERY = gql`
  query AddBenefitRules {
    ruleDefinitions {
      id
      name
      description
      rule_type
      default_operator
      default_value
      default_unit
    }
  }
`;

export const CREATE_BENEFIT_MUTATION = gql`
  mutation SubmitBenefitCreateRequest($input: SubmitBenefitCreateRequestInput!) {
    submitBenefitCreateRequest(input: $input) {
      id
      status
      target_role
    }
  }
`;
