import type { EmployeeBenefitDialogQuery } from "@/shared/apollo/generated";

type BenefitRequestRule = EmployeeBenefitDialogQuery["eligibilityRules"][number];
type RuleEvaluationResult = { passed?: unknown; ruleType?: unknown };

function parseJsonValue(value: string | null | undefined) {
  if (!value) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function formatRuleOperator(operator: BenefitRequestRule["operator"]) {
  if (operator === "eq") return "=";
  if (operator === "neq") return "!=";
  if (operator === "gte") return ">=";
  if (operator === "lte") return "<=";
  if (operator === "gt") return ">";
  if (operator === "lt") return "<";
  if (operator === "in") return "in";
  return "not in";
}

function formatTenureValue(value: number) {
  if (value >= 60) return `${Math.round(value / 30)} Months`;
  return `${value} Days`;
}

function formatRuleValue(rawValue: string, defaultUnit?: string | null) {
  const parsedValue = parseJsonValue(rawValue);
  if (Array.isArray(parsedValue)) return parsedValue.join(", ");
  if (typeof parsedValue === "boolean") return parsedValue ? "Yes" : "No";
  if (typeof parsedValue === "number") {
    if (defaultUnit === "days") return formatTenureValue(parsedValue);
    if (defaultUnit === "level" || defaultUnit === "times") return String(parsedValue);
    return defaultUnit ? `${parsedValue} ${defaultUnit}` : String(parsedValue);
  }
  if (typeof parsedValue === "string") {
    return parsedValue
      .split(/[_\s]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }
  return rawValue.replace(/^"|"$/g, "");
}

export function buildRuleLabel(
  ruleType: BenefitRequestRule["rule_type"],
  rule: BenefitRequestRule | null,
) {
  const rawValue = rule ? formatRuleValue(rule.value, rule.default_unit) : null;
  if (ruleType === "employment_status") return "Employment Status";
  if (ruleType === "okr_submitted") return "OKR Submitted";
  if (ruleType === "attendance") {
    if (!rule || !rawValue) return "Late Arrivals";
    if (rule.operator === "lte") return `Late Arrivals ${rawValue} or fewer`;
    if (rule.operator === "lt") return `Late Arrivals under ${rawValue}`;
    if (rule.operator === "gte") return `Late Arrivals ${rawValue}+`;
    if (rule.operator === "gt") return `Late Arrivals over ${rawValue}`;
    return `Late Arrivals ${formatRuleOperator(rule.operator)} ${rawValue}`;
  }
  if (ruleType === "responsibility_level") {
    if (!rule || !rawValue) return "Responsibility Level";
    if (rule.operator === "gte") return `Level ${rawValue}+`;
    if (rule.operator === "gt") return `Above Level ${rawValue}`;
    if (rule.operator === "lte") return `Level ${rawValue} or below`;
    if (rule.operator === "lt") return `Below Level ${rawValue}`;
    return `Level ${formatRuleOperator(rule.operator)} ${rawValue}`;
  }
  if (ruleType === "role") return rule?.name?.trim() || "Role";
  if (ruleType === "tenure_days") {
    if (!rule || !rawValue) return "Tenure Requirement";
    if (rule.operator === "gte") return `Tenure ${rawValue}+`;
    if (rule.operator === "gt") return `Tenure over ${rawValue}`;
    if (rule.operator === "lte") return `Tenure up to ${rawValue}`;
    if (rule.operator === "lt") return `Tenure under ${rawValue}`;
    return `Tenure ${formatRuleOperator(rule.operator)} ${rawValue}`;
  }
  return rule?.name?.trim() || "Eligibility Requirement";
}

export function buildRuleDescription(rule: BenefitRequestRule | null, passed: boolean) {
  if (!rule) return passed ? "Requirement satisfied." : "Requirement not met.";
  if (!passed) return rule.error_message?.trim() || rule.description?.trim() || "Requirement not met.";
  return rule.description?.trim() || "Requirement satisfied.";
}

export function buildRulePassQueue(ruleEvaluationJson: string | null | undefined) {
  const parsedValue = parseJsonValue(ruleEvaluationJson);
  const queueByRuleType = new Map<string, boolean[]>();
  if (!Array.isArray(parsedValue)) return queueByRuleType;

  for (const entry of parsedValue) {
    if (!entry || typeof entry !== "object") continue;
    const result = entry as RuleEvaluationResult;
    if (typeof result.ruleType !== "string" || typeof result.passed !== "boolean") continue;
    const current = queueByRuleType.get(result.ruleType) ?? [];
    current.push(result.passed);
    queueByRuleType.set(result.ruleType, current);
  }

  return queueByRuleType;
}

export function readRulePassState(
  queueByRuleType: Map<string, boolean[]>,
  ruleType: string,
  fallbackValue: boolean,
) {
  const queue = queueByRuleType.get(ruleType);
  if (!queue?.length) return fallbackValue;
  const nextValue = queue.shift();
  return typeof nextValue === "boolean" ? nextValue : fallbackValue;
}
