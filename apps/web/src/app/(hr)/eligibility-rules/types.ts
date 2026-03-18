import type { Operator, RuleType, RuleValueType } from "@/shared/apollo/generated";

export type PendingRuleRequest = {
  actionType: "create" | "delete" | "update";
  createdAt: string;
  id: string;
  requestedBy: string;
  status: "approved" | "pending" | "rejected";
  targetRole: "finance_manager" | "hr_admin";
};

export type RuleCardModel = {
  categoryId: string;
  categoryName: string;
  defaultUnit?: string | null;
  defaultValue?: string | null;
  description: string;
  id: string;
  linkedBenefits: Array<{ id: string; name: string }>;
  metricLabel?: string;
  metricSuffix?: string;
  metricValue?: string;
  metricVariant?: "number" | "select";
  name: string;
  optionsJson?: string | null;
  operator: Operator;
  pendingRequest?: PendingRuleRequest | null;
  ruleType: RuleType;
  usageCount: number;
  valueType: RuleValueType;
};

export type RuleSectionView = {
  cards: RuleCardModel[];
  count: string;
  title: string;
};
