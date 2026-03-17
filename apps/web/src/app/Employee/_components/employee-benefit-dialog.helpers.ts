import type { EmployeeBenefitDialogQuery } from "@/shared/apollo/generated";

import { parseJsonValue } from "./employee-dashboard-json";
import type { EmployeeBenefitCard } from "./employee-types";

type DialogRule = EmployeeBenefitDialogQuery["eligibilityRules"][number];

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

export function formatContractPeriod(effectiveDate: string, expiryDate: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${formatter.format(new Date(effectiveDate))} - ${formatter.format(new Date(expiryDate))}`;
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
