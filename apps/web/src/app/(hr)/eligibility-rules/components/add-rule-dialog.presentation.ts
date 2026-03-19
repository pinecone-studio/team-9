import { RuleValueType } from "@/shared/apollo/generated";
import type { RuleType } from "@/shared/apollo/generated";

import { formatRulePreview } from "./rule-backend-formatters";
import type { RuleTemplate } from "./rule-backend-metadata";

type AddRuleDialogPresentationParams = {
  configLabel: string;
  enumOptions: string[];
  ruleLabel: string;
  ruleType?: RuleType;
  sectionTitle: string;
  templates: RuleTemplate[];
  unit: string;
  value: string;
  valueType: RuleValueType;
};

export function getAddRuleDialogPresentation(params: AddRuleDialogPresentationParams) {
  const { configLabel, enumOptions, ruleLabel, ruleType, sectionTitle, templates, unit, value, valueType } = params;
  const isGateRule = sectionTitle === "Gate Rules";
  const isLevelRule = sectionTitle === "Level Rules";
  const sourceFieldOptions = templates.map((template) => ({
    label: template.configLabel
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    value: template.ruleType,
  }));
  const requiredValueOptions =
    valueType === RuleValueType.Boolean
      ? [
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ]
      : enumOptions.map((option) => ({ label: option, value: option }));
  const selectedSourceFieldLabel =
    sourceFieldOptions.find((option) => option.value === ruleType)?.label ?? configLabel;
  const previewText = isGateRule
    ? `This gate rule checks whether "${selectedSourceFieldLabel}" matches "${
        valueType === RuleValueType.Boolean ? (value.toLowerCase() === "false" ? "No" : "Yes") : value || "the selected option"
      }".`
    : isLevelRule
      ? `This level rule checks whether "Responsibility Level" is at least Level ${value || "1"}.`
      : formatRulePreview({ configLabel, ruleLabel, unit, value, valueType });

  return { isGateRule, isLevelRule, previewText, requiredValueOptions, sourceFieldOptions };
}
