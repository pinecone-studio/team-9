import { Operator } from "@/shared/apollo/generated";
import type { RuleCardModel } from "../types";

function getFormattedValue(
  metricValue: RuleCardModel["metricValue"],
  metricSuffix: RuleCardModel["metricSuffix"],
) {
  if (!metricValue) return "a value";
  return metricSuffix ? `${metricValue} ${metricSuffix}` : metricValue;
}

export function getRuleConditionLabel(
  metricLabel: RuleCardModel["metricLabel"],
  metricValue: RuleCardModel["metricValue"],
  metricSuffix: RuleCardModel["metricSuffix"],
  operator: RuleCardModel["operator"],
) {
  const label = metricLabel ?? "Rule value";
  const formattedValue = getFormattedValue(metricValue, metricSuffix);

  if (operator === Operator.Eq) return `${label} is ${formattedValue}`;
  if (operator === Operator.Neq) return `${label} is not ${formattedValue}`;
  if (operator === Operator.Gt) return `${label} is greater than ${formattedValue}`;
  if (operator === Operator.Gte) return `${label} is at least ${formattedValue}`;
  if (operator === Operator.Lt) return `${label} is less than ${formattedValue}`;
  if (operator === Operator.Lte) return `${label} is at most ${formattedValue}`;
  if (operator === Operator.In) return `${label} matches ${formattedValue}`;
  if (operator === Operator.NotIn) return `${label} excludes ${formattedValue}`;
  return `${label} uses ${formattedValue}`;
}
