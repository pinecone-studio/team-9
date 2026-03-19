import { buildEmployeeMetrics, type EmployeeRow } from "../../utils/build-employee-metrics";
import { evaluateRule } from "../../utils/eveluate-rule";
import type { RuleReviewState } from "./rule-approval-review-state";

type RuleApprovalActionType = "create" | "delete" | "update";

function countEligibleEmployees(
  employees: EmployeeRow[],
  rule: RuleReviewState | null,
) {
  const ruleValue = rule?.value;

  if (!rule?.ruleType || !ruleValue) {
    return employees.length;
  }

  return employees.filter((employee) =>
    evaluateRule(
      {
        operator: rule.operator as Parameters<typeof evaluateRule>[0]["operator"],
        rule_type: rule.ruleType as Parameters<typeof evaluateRule>[0]["rule_type"],
        value: ruleValue,
      },
      buildEmployeeMetrics(employee),
    ),
  ).length;
}

function buildImpactSummary(delta: number) {
  if (delta < 0) {
    return `${Math.abs(delta)} employees will become newly restricted if this change is approved.`;
  }

  if (delta > 0) {
    return `${delta} employees will become newly eligible if this change is approved.`;
  }

  return "This change does not alter employee eligibility counts with the current data.";
}

export function buildRuleApprovalImpact(params: {
  actionType: RuleApprovalActionType;
  currentRule: RuleReviewState;
  employees: EmployeeRow[];
  previousRule: RuleReviewState | null;
}) {
  const { actionType, currentRule, employees, previousRule } = params;
  const totalEmployees = employees.length;
  const previousEligibleEmployees =
    actionType === "create"
      ? totalEmployees
      : countEligibleEmployees(employees, previousRule);
  const nextEligibleEmployees =
    actionType === "delete"
      ? totalEmployees
      : countEligibleEmployees(employees, currentRule);
  const delta = nextEligibleEmployees - previousEligibleEmployees;

  return {
    affectedEmployees: totalEmployees,
    eligibilityEffect:
      delta < 0 ? "Restrictive" : delta > 0 ? "Expanded" : "Unchanged",
    newlyRestrictedEmployees: delta,
    summary: buildImpactSummary(delta),
  };
}
