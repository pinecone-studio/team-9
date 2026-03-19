import {
  formatRuleTypeLabel,
  getOperatorSymbol,
  getRuleFieldKey,
  parseRuleScalar,
} from "./rule-approval-review-utils";

export type RuleReviewState = {
  description: string;
  name: string;
  operator: string;
  ruleType: string;
  unit: string | null;
  value: string | null;
};

export type RuleReviewChangeSummaryItem = {
  id: string;
  label: string;
  nextValue: string;
  previousValue: string;
};

function parseJson<T>(value: string | null) {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function readRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readRuleState(value: Record<string, unknown> | null) {
  if (!value) {
    return null;
  }

  return {
    description: readString(value.description) ?? "-",
    name: readString(value.name) ?? "Untitled Rule",
    operator:
      readString(value.default_operator) ??
      readString(value.defaultOperator) ??
      readString(value.operator) ??
      "eq",
    ruleType: readString(value.rule_type) ?? readString(value.ruleType) ?? "",
    unit: readString(value.default_unit) ?? readString(value.defaultUnit),
    value: readString(value.default_value) ?? readString(value.defaultValue),
  } satisfies RuleReviewState;
}

function mergeRuleState(
  previousRule: RuleReviewState | null,
  nextRule: RuleReviewState | null,
): RuleReviewState {
  return {
    description: nextRule?.description ?? previousRule?.description ?? "-",
    name: nextRule?.name ?? previousRule?.name ?? "Untitled Rule",
    operator: nextRule?.operator ?? previousRule?.operator ?? "eq",
    ruleType: nextRule?.ruleType ?? previousRule?.ruleType ?? "",
    unit:
      nextRule?.unit === undefined ? (previousRule?.unit ?? null) : nextRule.unit,
    value:
      nextRule?.value === undefined ? (previousRule?.value ?? null) : nextRule.value,
  };
}

function formatExpressionValue(rule: RuleReviewState) {
  const parsedValue = parseRuleScalar(rule.value);
  const normalizedUnit = rule.unit?.trim().toLowerCase() ?? "";

  if (
    !normalizedUnit ||
    normalizedUnit === "-" ||
    normalizedUnit === "times" ||
    parsedValue === "true" ||
    parsedValue === "false"
  ) {
    return parsedValue;
  }

  return `${parsedValue} ${normalizedUnit}`;
}

function pushChange(
  changes: RuleReviewChangeSummaryItem[],
  id: string,
  label: string,
  previousValue: string,
  nextValue: string,
) {
  if (previousValue === nextValue) {
    return;
  }

  changes.push({ id, label, nextValue, previousValue });
}

export function resolveRuleReviewStates(
  payloadJson: string,
  snapshotJson: string | null,
) {
  const payload = readRecord(parseJson<Record<string, unknown>>(payloadJson));
  const payloadRule = readRuleState(readRecord(payload?.rule));
  const previousRule = readRuleState(
    readRecord(parseJson<Record<string, unknown>>(snapshotJson)),
  );

  return {
    currentRule: mergeRuleState(previousRule, payloadRule),
    previousRule,
  };
}

export function buildRuleTechnicalExpression(rule: RuleReviewState) {
  return `${getRuleFieldKey(rule.ruleType)} ${getOperatorSymbol(rule.operator)} ${formatExpressionValue(rule)}`;
}

export function buildRuleChangeSummary(
  previousRule: RuleReviewState | null,
  currentRule: RuleReviewState,
) {
  if (!previousRule) {
    return [] as RuleReviewChangeSummaryItem[];
  }

  const changes: RuleReviewChangeSummaryItem[] = [];

  pushChange(
    changes,
    "condition",
    "Condition",
    buildRuleTechnicalExpression(previousRule),
    buildRuleTechnicalExpression(currentRule),
  );
  pushChange(
    changes,
    "blocking_message",
    "Blocking Message",
    previousRule.description,
    currentRule.description,
  );
  pushChange(
    changes,
    "rule_name",
    "Rule Name",
    previousRule.name,
    currentRule.name,
  );
  pushChange(
    changes,
    "rule_type",
    "Rule Type",
    formatRuleTypeLabel(previousRule.ruleType),
    formatRuleTypeLabel(currentRule.ruleType),
  );

  return changes;
}
