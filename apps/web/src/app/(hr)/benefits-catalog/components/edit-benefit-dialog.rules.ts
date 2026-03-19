import type { BenefitEditRulesQuery } from "./edit-benefit-dialog.graphql";

export function mapInitialAssignedRules(
  rules?: BenefitEditRulesQuery["eligibilityRules"],
) {
  return (rules ?? []).map((rule) => ({
    defaultUnit: rule.default_unit,
    errorMessage: rule.error_message,
    id: rule.id,
    name: rule.name,
    operator: rule.operator,
    ruleId: rule.rule_id,
    value: rule.value,
  }));
}
