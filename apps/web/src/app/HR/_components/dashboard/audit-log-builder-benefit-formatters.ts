import { getEmptyAuditLogValue } from "./audit-log-builder-formatters";

const EMPTY_VALUE = getEmptyAuditLogValue();

export function formatPercentageValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${value}%`;
  }

  if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();
    return trimmed.endsWith("%") ? trimmed : `${trimmed}%`;
  }

  return EMPTY_VALUE;
}

export function formatCurrencyValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `$${value}`;
  }

  if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();
    return trimmed.startsWith("$") ? trimmed : `$${trimmed}`;
  }

  return EMPTY_VALUE;
}

export function resolveBenefitMonthlyValue(
  benefit: {
    monthlyAmount?: number | string | null;
    monthlyCap?: number | string | null;
    monthly_amount?: number | string | null;
    monthly_cap?: number | string | null;
  } | null | undefined,
) {
  return (
    benefit?.monthlyAmount ??
    benefit?.monthly_amount ??
    benefit?.monthlyCap ??
    benefit?.monthly_cap ??
    null
  );
}

export function parseBenefitRuleNames(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .map((rule) => {
      if (typeof rule === "string") return rule.trim();
      if (rule && typeof rule === "object" && "name" in rule && typeof rule.name === "string") {
        return rule.name.trim();
      }
      return "";
    })
    .filter(Boolean);
}
