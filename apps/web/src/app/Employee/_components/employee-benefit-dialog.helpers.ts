import type { EmployeeBenefitDialogQuery } from "@/shared/apollo/generated";

import { parseJsonValue } from "./employee-dashboard-json";
import type { EmployeeBenefitCard } from "./employee-types";

type DialogRule = EmployeeBenefitDialogQuery["eligibilityRules"][number];
type BenefitContractDates = Pick<
  NonNullable<EmployeeBenefitDialogQuery["benefitContract"]>,
  "effectiveDate" | "expiryDate"
>;

type RuleEvaluationResult = {
  passed?: unknown;
  ruleType?: unknown;
};

export type BenefitDialogRuleItem = {
  description: string;
  id: string;
  label: string;
  passed: boolean;
};

const CONTRACT_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function formatRuleOperator(operator: DialogRule["operator"]) {
  if (operator === "eq") return "=";
  if (operator === "neq") return "!=";
  if (operator === "gte") return ">=";
  if (operator === "lte") return "<=";
  if (operator === "gt") return ">";
  if (operator === "lt") return "<";
  if (operator === "in") return "in";
  return "not in";
}

function formatRuleValue(rawValue: string, defaultUnit?: string | null) {
  const parsedValue = parseJsonValue(rawValue);

  if (Array.isArray(parsedValue)) {
    return parsedValue.join(", ");
  }
  if (typeof parsedValue === "boolean") {
    return parsedValue ? "Yes" : "No";
  }
  if (typeof parsedValue === "number") {
    return defaultUnit ? `${parsedValue} ${defaultUnit}` : String(parsedValue);
  }
  if (typeof parsedValue === "string") {
    return parsedValue;
  }

  return rawValue.replace(/^"|"$/g, "");
}

function buildRuleLabel(rule: DialogRule) {
  const formattedValue = formatRuleValue(rule.value, rule.default_unit);
  const operatorLabel = formatRuleOperator(rule.operator);

  if (rule.rule_type === "employment_status") {
    return `Employment Status ${operatorLabel} ${formattedValue}`;
  }
  if (rule.rule_type === "okr_submitted") {
    return formattedValue === "Yes" ? "OKR Submitted" : "OKR Not Submitted";
  }
  if (rule.rule_type === "attendance") {
    return `Late Arrivals ${operatorLabel} ${formattedValue}`;
  }
  if (rule.rule_type === "responsibility_level") {
    return `Responsibility Level ${operatorLabel} ${formattedValue}`;
  }
  if (rule.rule_type === "role") {
    return `Role ${operatorLabel} ${formattedValue}`;
  }
  if (rule.rule_type === "tenure_days") {
    return `Tenure ${operatorLabel} ${formattedValue}`;
  }

  return rule.name;
}

function buildRulePassQueue(ruleEvaluationJson: string) {
  const parsedValue = parseJsonValue(ruleEvaluationJson);
  const queueByRuleType = new Map<string, boolean[]>();

  if (!Array.isArray(parsedValue)) {
    return queueByRuleType;
  }

  for (const entry of parsedValue) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const result = entry as RuleEvaluationResult;
    if (typeof result.ruleType !== "string" || typeof result.passed !== "boolean") {
      continue;
    }

    const existing = queueByRuleType.get(result.ruleType) ?? [];
    existing.push(result.passed);
    queueByRuleType.set(result.ruleType, existing);
  }

  return queueByRuleType;
}

function readRulePassState(
  ruleType: string,
  queueByRuleType: Map<string, boolean[]>,
  fallbackValue: boolean,
) {
  const queue = queueByRuleType.get(ruleType);

  if (!queue || queue.length === 0) {
    return fallbackValue;
  }

  const nextValue = queue.shift();
  return typeof nextValue === "boolean" ? nextValue : fallbackValue;
}

export function buildBenefitDialogRuleItems(
  card: EmployeeBenefitCard,
  rules: EmployeeBenefitDialogQuery["eligibilityRules"],
) {
  const queueByRuleType = buildRulePassQueue(card.ruleEvaluationJson);
  const fallbackValue = card.status === "Eligible" || card.status === "Active";

  return [...rules]
    .sort((left, right) => left.priority - right.priority)
    .map((rule) => {
      const passed = readRulePassState(rule.rule_type, queueByRuleType, fallbackValue);

      return {
        description: passed ? rule.description : rule.error_message || rule.description,
        id: rule.id,
        label: buildRuleLabel(rule),
        passed,
      };
    });
}

function parseContractDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const dateOnlyMatch = CONTRACT_DATE_PATTERN.exec(value.trim());

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12));
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toUtcDayNumber(value: string | null | undefined) {
  const date = parseContractDate(value);

  if (!date) {
    return null;
  }

  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
      DAY_IN_MILLISECONDS,
  );
}

export function formatContractDate(value: string | null | undefined) {
  const date = parseContractDate(value);

  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
}

export function formatContractPeriod(effectiveDate: string, expiryDate: string) {
  return `${formatContractDate(effectiveDate)} - ${formatContractDate(expiryDate)}`;
}

export function buildContractDateItems(contract: BenefitContractDates | null) {
  if (!contract) {
    return [];
  }

  return [
    {
      id: "contract-effective-date",
      label: "Effective Date",
      timestamp: formatContractDate(contract.effectiveDate),
      tone: "success" as const,
    },
    {
      id: "contract-expiry-date",
      label: "Expiry Date",
      timestamp: formatContractDate(contract.expiryDate),
      tone: isContractExpired(contract.expiryDate) ? ("danger" as const) : ("neutral" as const),
    },
  ];
}

export function isContractExpired(
  expiryDate: string | null | undefined,
  referenceDate = new Date(),
) {
  const expiryDayNumber = toUtcDayNumber(expiryDate);

  if (expiryDayNumber === null) {
    return false;
  }

  const referenceDayNumber = Math.floor(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate(),
    ) / DAY_IN_MILLISECONDS,
  );

  return referenceDayNumber > expiryDayNumber;
}

export function buildExpiredContractMessage(expiryDate: string | null | undefined) {
  const formattedExpiryDate = formatContractDate(expiryDate);

  if (formattedExpiryDate === "-") {
    return "This benefit is locked because the current contract has expired. Please wait for HR to upload a renewed contract.";
  }

  return `This benefit is locked because the current contract expired on ${formattedExpiryDate}. Please wait for HR to upload a renewed contract.`;
}

export function getContractFileName(r2ObjectKey: string) {
  const parts = r2ObjectKey.split("/");
  return parts[parts.length - 1] || "Benefit contract";
}

export function resolveSignedContractUrl(signedUrl: string) {
  if (/^https?:\/\//i.test(signedUrl)) {
    return signedUrl;
  }

  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
  if (endpoint) {
    return new URL(signedUrl, new URL(endpoint).origin).toString();
  }

  return new URL(signedUrl, window.location.origin).toString();
}
