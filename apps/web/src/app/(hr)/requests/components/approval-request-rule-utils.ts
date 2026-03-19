export type RuleShape = {
  defaultOperator?: string | null;
  defaultUnit?: string | null;
  defaultValue?: string | null;
  default_operator?: string | null;
  default_unit?: string | null;
  default_value?: string | null;
  description?: string | null;
  linked_benefits_json?: string | null;
  name?: string | null;
  ruleType?: string | null;
  rule_type?: string | null;
  usage_count?: number | null;
};

export type LinkedBenefit = {
  id?: string;
  name?: string;
};

export function normalizeRuleType(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

export function formatRuleTypeLabel(value: string | null | undefined) {
  const normalized = normalizeRuleType(value);
  if (!normalized) return "-";
  if (normalized === "tenure_days") return "Tenure";
  if (normalized === "employment_status") return "Employment Status";
  if (normalized === "okr_submitted") return "OKR Submitted";
  if (normalized === "responsibility_level") return "Responsibility Level";
  if (normalized === "attendance") return "Attendance";
  if (normalized === "role") return "Role";
  return normalized
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getRuleFieldLabel(ruleType: string | null | undefined) {
  const normalized = normalizeRuleType(ruleType);
  if (normalized === "tenure_days") return "Employment Months";
  if (normalized === "attendance") return "Late Arrival Count";
  if (normalized === "employment_status") return "Employment Status";
  if (normalized === "okr_submitted") return "OKR Submitted";
  if (normalized === "responsibility_level") return "Responsibility Level";
  if (normalized === "role") return "Role";
  return "Rule Value";
}

export function getRuleFieldKey(ruleType: string | null | undefined) {
  const normalized = normalizeRuleType(ruleType);
  if (normalized === "tenure_days") return "employment_months";
  if (normalized === "attendance") return "late_arrival_count";
  if (normalized === "employment_status") return "employment_status";
  if (normalized === "okr_submitted") return "okr_submitted";
  if (normalized === "responsibility_level") return "responsibility_level";
  if (normalized === "role") return "role";
  return normalized || "value";
}

export function parseRuleJsonScalar(value: string | null | undefined) {
  if (!value) return "-";
  try {
    const parsed = JSON.parse(value) as unknown;
    if (typeof parsed === "string" || typeof parsed === "number") return String(parsed);
    if (typeof parsed === "boolean") return parsed ? "true" : "false";
    if (Array.isArray(parsed)) return parsed.join(", ");
    return value;
  } catch {
    return value;
  }
}

export function getRuleOperator(rule: RuleShape | null | undefined) {
  return rule?.defaultOperator ?? rule?.default_operator ?? "=";
}

export function getRuleValue(rule: RuleShape | null | undefined) {
  return rule?.defaultValue ?? rule?.default_value ?? null;
}

export function parseLinkedBenefits(value: string | null | undefined) {
  if (!value) return [] as LinkedBenefit[];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is LinkedBenefit => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as LinkedBenefit;
      return typeof candidate.name === "string";
    });
  } catch {
    return [];
  }
}

export function getRuleTechnicalExpression(
  ruleType: string | null | undefined,
  operator: string | null | undefined,
  value: string,
) {
  const field = getRuleFieldKey(ruleType);
  const normalizedOperator = operator?.trim() || "=";
  return `${field} ${normalizedOperator} ${value}`;
}

export function getRuleChangeRows(currentRule: RuleShape, previousRule: RuleShape | null) {
  if (!previousRule) {
    return [] as Array<{ label: string; nextValue: string; previousValue: string }>;
  }

  const rows = [
    {
      label: "Condition",
      nextValue: getRuleTechnicalExpression(
        currentRule.ruleType,
        getRuleOperator(currentRule),
        parseRuleJsonScalar(getRuleValue(currentRule)),
      ),
      previousValue: getRuleTechnicalExpression(
        previousRule.rule_type,
        getRuleOperator(previousRule),
        parseRuleJsonScalar(getRuleValue(previousRule)),
      ),
    },
    {
      label: "Blocking Message",
      nextValue: currentRule.description?.trim() || "-",
      previousValue: previousRule.description?.trim() || "-",
    },
  ];

  return rows.filter((row) => row.nextValue !== row.previousValue);
}
