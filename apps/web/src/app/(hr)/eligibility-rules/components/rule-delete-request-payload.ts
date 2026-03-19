import type { RuleCardModel } from "../types";

export function buildRuleDeletePayload(
  editingRule: RuleCardModel | null,
  id: string,
) {
  if (!editingRule) {
    return { rule: { id } };
  }

  return {
    deleteComment: null,
    rule: {
      allowedOperators: [],
      categoryId: editingRule.categoryId,
      defaultOperator: editingRule.operator,
      defaultUnit: editingRule.defaultUnit ?? null,
      defaultValue: editingRule.defaultValue ?? null,
      description: editingRule.description,
      id: editingRule.id,
      isActive: true,
      name: editingRule.name,
      optionsJson: editingRule.optionsJson ?? null,
      ruleType: editingRule.ruleType,
      valueType: editingRule.valueType,
    },
  };
}

export function buildRuleDeleteSnapshot(
  editingRule: RuleCardModel | null,
  deleteComment: string,
  id: string,
) {
  if (!editingRule) {
    return { deleteComment, id };
  }

  return {
    category_id: editingRule.categoryId,
    category_name: editingRule.categoryName,
    defaultOperator: editingRule.operator,
    defaultUnit: editingRule.defaultUnit ?? null,
    defaultValue: editingRule.defaultValue ?? null,
    deleteComment,
    description: editingRule.description,
    id: editingRule.id,
    linked_benefits_json: JSON.stringify(editingRule.linkedBenefits),
    name: editingRule.name,
    options_json: editingRule.optionsJson ?? null,
    rule_type: editingRule.ruleType,
    usage_count: editingRule.usageCount,
    value_type: editingRule.valueType,
  };
}
