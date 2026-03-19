const EMPTY_VALUE = "—";

export function getEmptyAuditLogValue() {
  return EMPTY_VALUE;
}

export function formatLabel(value: string | null | undefined) {
  if (!value?.trim()) {
    return EMPTY_VALUE;
  }

  return value
    .trim()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function parseJsonObject(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getRuleCategoryLabel(
  categoryId: string | null | undefined,
  ruleType: string | null | undefined,
) {
  const normalizedRuleType = ruleType?.trim().toLowerCase() ?? "";
  if (normalizedRuleType === "tenure_days") return "Tenure";
  if (normalizedRuleType === "okr_submitted") return "Performance";
  if (normalizedRuleType === "attendance") return "Performance";
  if (normalizedRuleType === "responsibility_level") return "Performance";
  if (normalizedRuleType === "employment_status") return "Status";
  if (normalizedRuleType === "role") return "Role";
  if (categoryId === "cat_gate_rules") return "Gate Rules";
  if (categoryId === "cat_threshold_rules") return "Performance";
  if (categoryId === "cat_tenure_rules") return "Tenure";
  if (categoryId === "cat_level_rules") return "Performance";
  return formatLabel(ruleType);
}

export function getRuleSourceFieldLabel(
  optionsJson: string | null | undefined,
  ruleType: string | null | undefined,
  unit: string | null | undefined,
) {
  const options = parseJsonObject(optionsJson);
  if (typeof options?.configLabel === "string" && options.configLabel.trim()) {
    return options.configLabel
      .trim()
      .replace(/\bokr\b/gi, "OKR")
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }

  const normalizedRuleType = ruleType?.trim().toLowerCase() ?? "";
  if (normalizedRuleType === "tenure_days") {
    if (unit?.trim().toLowerCase() === "months") return "Employment Months";
    if (unit?.trim().toLowerCase() === "years") return "Employment Years";
    return "Employment Days";
  }
  if (normalizedRuleType === "okr_submitted") return "OKR Submitted";

  return formatLabel(ruleType);
}

export function formatRuleRequirementValue(
  ruleType: string | null | undefined,
  operator: string | null | undefined,
  rawValue: string | null | undefined,
  unit: string | null | undefined,
) {
  const parsedValue = (() => {
    if (!rawValue) return EMPTY_VALUE;
    try {
      const value = JSON.parse(rawValue) as unknown;
      if (typeof value === "string" || typeof value === "number") return String(value);
      if (typeof value === "boolean") return value ? "Yes" : "No";
      if (Array.isArray(value)) return value.join(", ");
      return rawValue;
    } catch {
      return rawValue;
    }
  })();

  const suffix = unit?.trim() ? (unit.trim() === "%" ? "%" : ` ${unit.trim()}`) : "";
  const normalizedOperator = operator?.trim().toLowerCase() ?? "";
  const normalizedRuleType = ruleType?.trim().toLowerCase() ?? "";

  if (normalizedRuleType === "okr_submitted") {
    if (parsedValue === "Yes") return "Required";
    if (parsedValue === "No") return "Not Required";
  }

  if (normalizedRuleType === "tenure_days") {
    if (normalizedOperator === "gte" || normalizedOperator === "gt") {
      return `${parsedValue}${suffix} minimum`;
    }
    if (normalizedOperator === "lte" || normalizedOperator === "lt") {
      return `${parsedValue}${suffix} maximum`;
    }
  }

  if (normalizedOperator === "gte" || normalizedOperator === "gt") {
    return `Above ${parsedValue}${suffix}`;
  }
  if (normalizedOperator === "lte" || normalizedOperator === "lt") {
    return `Below ${parsedValue}${suffix}`;
  }
  if (normalizedOperator === "neq" || normalizedOperator === "not_in") {
    return `Not ${parsedValue}${suffix}`;
  }

  return `${parsedValue}${suffix}`;
}

export function parseRuleTargetBenefits(
  snapshotJson: string | null | undefined,
  payloadBenefits: Array<{ name?: string | null }> | undefined,
) {
  if (Array.isArray(payloadBenefits) && payloadBenefits.length > 0) {
    return payloadBenefits
      .map((benefit) => benefit.name?.trim())
      .filter((name): name is string => Boolean(name));
  }

  const snapshot = parseJsonObject(snapshotJson);
  const linkedBenefitsJson = snapshot?.linked_benefits_json;
  if (typeof linkedBenefitsJson !== "string") {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(linkedBenefitsJson) as Array<{ name?: unknown }>;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((benefit) => (typeof benefit?.name === "string" ? benefit.name.trim() : ""))
      .filter(Boolean);
  } catch {
    return [];
  }
}
