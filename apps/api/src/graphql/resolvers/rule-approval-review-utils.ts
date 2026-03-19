type ApprovalActionTypeValue = "create" | "delete" | "update";

type LinkedBenefit = {
  id: string;
  name: string;
};

type RuleReviewSource = {
  description: string;
  linkedBenefits: LinkedBenefit[];
  name: string;
  operator: string;
  ruleType: string;
  unit: string | null;
  value: string | null;
};

function parseJson<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function toTitleCase(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatPersonLabel(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  const normalized = value.trim();
  if (!normalized) {
    return "-";
  }

  const localValue = normalized.includes("@")
    ? (normalized.split("@")[0] ?? normalized)
    : normalized;

  return localValue
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatRuleTypeLabel(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase() ?? "";
  if (!normalized) return "-";
  if (normalized === "tenure_days") return "Tenure";
  if (normalized === "employment_status") return "Employment Status";
  if (normalized === "okr_submitted") return "OKR Submitted";
  if (normalized === "responsibility_level") return "Responsibility Level";
  if (normalized === "attendance") return "Attendance";
  if (normalized === "role") return "Role";
  return toTitleCase(normalized);
}

export function getRuleFieldLabel(ruleType: string | null | undefined) {
  const normalized = ruleType?.trim().toLowerCase() ?? "";
  if (normalized === "tenure_days") return "Employment Months";
  if (normalized === "attendance") return "Late Arrival Count";
  if (normalized === "employment_status") return "Employment Status";
  if (normalized === "okr_submitted") return "OKR Submitted";
  if (normalized === "responsibility_level") return "Responsibility Level";
  if (normalized === "role") return "Role";
  return "Rule Value";
}

export function getRuleFieldKey(ruleType: string | null | undefined) {
  const normalized = ruleType?.trim().toLowerCase() ?? "";
  if (normalized === "tenure_days") return "employment_months";
  if (normalized === "attendance") return "late_arrival_count";
  if (normalized === "employment_status") return "employment_status";
  if (normalized === "okr_submitted") return "okr_submitted";
  if (normalized === "responsibility_level") return "responsibility_level";
  if (normalized === "role") return "role";
  return normalized || "value";
}

export function parseRuleScalar(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

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

export function getOperatorSymbol(operator: string | null | undefined) {
  if (operator === "neq") return "!=";
  if (operator === "gte") return ">=";
  if (operator === "lte") return "<=";
  if (operator === "gt") return ">";
  if (operator === "lt") return "<";
  if (operator === "in") return "in";
  if (operator === "not_in") return "not in";
  return "=";
}

export function resolveRuleReviewSource(
  payloadJson: string,
  snapshotJson: string | null,
): RuleReviewSource {
  const payload = readRecord(parseJson<Record<string, unknown>>(payloadJson));
  const snapshot = readRecord(parseJson<Record<string, unknown>>(snapshotJson));
  const payloadRule = readRecord(payload?.rule);
  const linkedBenefitsJson = readString(snapshot?.linked_benefits_json);
  const linkedBenefitsFromSnapshot = Array.isArray(snapshot?.linkedBenefits)
    ? snapshot?.linkedBenefits
    : parseJson<unknown[]>(linkedBenefitsJson);

  return {
    description:
      readString(payloadRule?.description) ??
      readString(snapshot?.description) ??
      "-",
    linkedBenefits: Array.isArray(linkedBenefitsFromSnapshot)
      ? linkedBenefitsFromSnapshot.flatMap((value) => {
          const benefit = readRecord(value);
          const name = readString(benefit?.name);
          if (!name) {
            return [];
          }

          return [
            {
              id: readString(benefit?.id) ?? name,
              name,
            },
          ];
        })
      : [],
    name: readString(payloadRule?.name) ?? readString(snapshot?.name) ?? "Untitled Rule",
    operator:
      readString(payloadRule?.defaultOperator) ??
      readString(snapshot?.default_operator) ??
      readString(snapshot?.defaultOperator) ??
      readString(snapshot?.operator) ??
      "eq",
    ruleType:
      readString(payloadRule?.ruleType) ??
      readString(snapshot?.rule_type) ??
      readString(snapshot?.ruleType) ??
      "",
    unit:
      readString(payloadRule?.defaultUnit) ??
      readString(snapshot?.default_unit) ??
      readString(snapshot?.defaultUnit),
    value:
      readString(payloadRule?.defaultValue) ??
      readString(snapshot?.default_value) ??
      readString(snapshot?.defaultValue),
  };
}

export function getRuleActionCopy(actionType: ApprovalActionTypeValue) {
  if (actionType === "create") {
    return {
      actionBadgeLabel: "New Rule",
      actionBadgeTone: "success",
      subtitle: "Review the rule details and approve or reject it.",
      title: "Review New Rule",
    };
  }

  if (actionType === "delete") {
    return {
      actionBadgeLabel: "Delete Rule",
      actionBadgeTone: "danger",
      subtitle: "Review the rule details and approve or reject it.",
      title: "Review Rule Removal",
    };
  }

  return {
    actionBadgeLabel: "Rule Change",
    actionBadgeTone: "neutral",
    subtitle: "Review the rule details and approve or reject it.",
    title: "Review Rule Change",
  };
}

export function formatMeasurement(value: string | null | undefined) {
  return toTitleCase(value);
}
