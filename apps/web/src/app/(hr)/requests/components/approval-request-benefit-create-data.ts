import { gql } from "@apollo/client";

export type BenefitCreateShape = {
  approvalRole?: string;
  category?: string;
  categoryId?: string;
  description?: string;
  isCore?: boolean;
  name?: string;
  requiresContract?: boolean;
  subsidyPercent?: number | string | null;
  vendorName?: string | null;
};

export type BenefitCreateRuleAssignment = {
  ruleId?: string;
};

export type BenefitCreateContractUpload = {
  fileName?: string;
  version?: string;
};

export type BenefitCreateRuleDefinitionsQuery = {
  employees: Array<{
    id: string;
  }> | null;
  ruleDefinitions: Array<{
    id: string;
    name: string;
  }>;
};

export const BENEFIT_CREATE_RULE_DETAILS_QUERY = gql`
  query BenefitCreateRuleDetails {
    ruleDefinitions {
      id
      name
    }
    employees {
      id
    }
  }
`;

export function parseBenefitCreatePayloadRecord(value: string) {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return {};
  }
}
