import {
  ApprovalActionType,
  ApprovalEntityType,
  ApprovalRequestStatus,
  type ApprovalRequestsQuery,
  type Operator,
  RuleValueType,
} from "@/shared/apollo/generated";
import type { RuleType } from "@/shared/apollo/generated";
import type { PendingRuleRequest, RuleCardModel } from "../types";
import {
  getMetricLabel,
  getMetricLabelFromOptionsJson,
  parseDisplayValue,
  parseLinkedBenefits,
  toTitleCase,
} from "./rule-section-list.utils";

export type RuleDefinitionRow = {
  allowed_operators_json: string;
  category_id: string;
  category_name: string;
  default_operator: Operator;
  default_unit?: string | null;
  default_value?: string | null;
  description: string;
  id: string;
  is_active: boolean;
  linked_benefits_json: string;
  name: string;
  options_json?: string | null;
  rule_type: RuleType;
  usage_count: number;
  value_type: RuleValueType;
};

export function getSectionTitleFromCategoryId(categoryId?: string | null): string {
  if (categoryId === "cat_gate_rules") return "Gate Rules";
  if (categoryId === "cat_threshold_rules") return "Threshold Rules";
  if (categoryId === "cat_tenure_rules") return "Tenure Rules";
  if (categoryId === "cat_level_rules") return "Level Rules";
  return "Threshold Rules";
}

export function toPendingRuleRequest(
  request: ApprovalRequestsQuery["approvalRequests"][number],
): PendingRuleRequest {
  return {
    actionType: request.action_type,
    createdAt: request.created_at,
    id: request.id,
    requestedBy: request.requested_by,
    status: request.status,
    targetRole: request.target_role,
  };
}

export function buildDefinitionRuleCard(row: RuleDefinitionRow): RuleCardModel {
  return {
    categoryId: row.category_id,
    categoryName: row.category_name,
    defaultUnit: row.default_unit,
    defaultValue: row.default_value,
    description: row.description,
    id: row.id,
    linkedBenefits: parseLinkedBenefits(row.linked_benefits_json),
    metricLabel:
      getMetricLabelFromOptionsJson(row.options_json) ??
      getMetricLabel(row.rule_type),
    metricSuffix: toTitleCase(row.default_unit),
    metricValue: parseDisplayValue(row.default_value, row.value_type),
    metricVariant:
      row.value_type === RuleValueType.Enum || row.value_type === RuleValueType.Boolean
        ? "select"
        : "number",
    name: row.name,
    optionsJson: row.options_json,
    operator: row.default_operator,
    pendingRequest: null,
    ruleType: row.rule_type,
    usageCount: row.usage_count,
    valueType: row.value_type,
  };
}

export function buildPendingCreateRuleCard(
  request: ApprovalRequestsQuery["approvalRequests"][number],
): RuleCardModel | null {
  if (
    request.entity_type !== ApprovalEntityType.Rule ||
    request.action_type !== ApprovalActionType.Create ||
    request.status !== ApprovalRequestStatus.Pending
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(request.payload_json) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const rulePayload = (parsed as { rule?: unknown }).rule;
    if (!rulePayload || typeof rulePayload !== "object" || Array.isArray(rulePayload)) {
      return null;
    }

    const record = rulePayload as {
      categoryId?: unknown;
      defaultOperator?: unknown;
      defaultUnit?: unknown;
      defaultValue?: unknown;
      description?: unknown;
      name?: unknown;
      optionsJson?: unknown;
      ruleType?: unknown;
      valueType?: unknown;
    };

    if (
      typeof record.name !== "string" ||
      typeof record.description !== "string" ||
      typeof record.categoryId !== "string" ||
      typeof record.defaultOperator !== "string" ||
      typeof record.ruleType !== "string" ||
      typeof record.valueType !== "string"
    ) {
      return null;
    }

    const categoryName = getSectionTitleFromCategoryId(record.categoryId);
    const valueType = record.valueType as RuleValueType;
    const ruleType = record.ruleType as RuleType;
    const defaultValue =
      typeof record.defaultValue === "string" ? record.defaultValue : undefined;
    const defaultUnit =
      typeof record.defaultUnit === "string" ? record.defaultUnit : undefined;
    const optionsJson =
      typeof record.optionsJson === "string" ? record.optionsJson : undefined;

    return {
      categoryId: record.categoryId,
      categoryName,
      defaultUnit,
      defaultValue,
      description: record.description,
      id: `pending-rule-${request.id}`,
      linkedBenefits: [],
      metricLabel:
        getMetricLabelFromOptionsJson(optionsJson) ?? getMetricLabel(ruleType),
      metricSuffix: toTitleCase(defaultUnit),
      metricValue: parseDisplayValue(defaultValue, valueType),
      metricVariant:
        valueType === RuleValueType.Enum || valueType === RuleValueType.Boolean
          ? "select"
          : "number",
      name: record.name,
      optionsJson,
      operator: record.defaultOperator as Operator,
      pendingRequest: toPendingRuleRequest(request),
      ruleType,
      usageCount: 0,
      valueType,
    };
  } catch {
    return null;
  }
}
