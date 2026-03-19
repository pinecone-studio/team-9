import {
  BenefitCreateRuleDetailsDocument,
  type BenefitCreateRuleDetailsQuery,
} from "@/shared/apollo/generated";

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

export type BenefitCreateRuleDefinitionsQuery = BenefitCreateRuleDetailsQuery;

export const BENEFIT_CREATE_RULE_DETAILS_QUERY = BenefitCreateRuleDetailsDocument;

export function parseBenefitCreatePayloadRecord(value: string) {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return {};
  }
}
