import type { RuleType } from "@/shared/apollo/generated";
import { RuleValueType } from "@/shared/apollo/generated";

import { formatRulePreview } from "./rule-backend-formatters";
import { getBackendRuleTemplates, getTemplateByRuleType } from "./rule-backend-metadata";
import type { RuleCardModel } from "../types";

type ParsedOptions = {
  configLabel?: string;
  options: string[];
};

type EditRuleGateConfigParams = {
  employeeRoles: string[];
  measurement: string;
  parsedOptions: ParsedOptions;
  rule: RuleCardModel;
  selectedRuleType: RuleType;
  value: string;
};

export function getEditRuleGateConfig(params: EditRuleGateConfigParams) {
  const { employeeRoles, measurement, parsedOptions, rule, selectedRuleType, value } =
    params;
  const gateTemplates = getBackendRuleTemplates("Gate Rules", { employeeRoles });
  const isGateRule = gateTemplates.some(
    (gateTemplate) => gateTemplate.ruleType === rule.ruleType,
  );
  const selectedTemplate = isGateRule
    ? gateTemplates.find((gateTemplate) => gateTemplate.ruleType === selectedRuleType) ??
      gateTemplates[0]
    : getTemplateByRuleType(rule.ruleType, { employeeRoles });
  const valueType = isGateRule ? selectedTemplate.valueType : rule.valueType;
  const enumOptions =
    isGateRule && selectedRuleType !== rule.ruleType
      ? selectedTemplate.enumOptions
      : parsedOptions.options.length > 0
        ? parsedOptions.options
        : selectedTemplate.enumOptions;
  const configLabel =
    isGateRule && selectedRuleType !== rule.ruleType
      ? selectedTemplate.configLabel
      : parsedOptions.configLabel ?? selectedTemplate.configLabel;
  const sourceFieldOptions = gateTemplates.map((gateTemplate) => ({
    label: gateTemplate.configLabel
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    value: gateTemplate.ruleType,
  }));
  const requiredValueOptions =
    valueType === RuleValueType.Boolean
      ? [
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ]
      : enumOptions.map((option) => ({ label: option, value: option }));
  const selectedSourceFieldLabel =
    sourceFieldOptions.find((option) => option.value === selectedRuleType)?.label ??
    configLabel;
  const previewText = isGateRule
    ? `This gate rule checks whether "${selectedSourceFieldLabel}" matches "${
        valueType === RuleValueType.Boolean
          ? value.toLowerCase() === "false"
            ? "No"
            : "Yes"
          : value || "the selected option"
      }".`
    : formatRulePreview({
        configLabel,
        ruleLabel: rule.categoryName.replace(/ Rules$/, ""),
        unit: measurement,
        value,
        valueType,
      });

  return {
    configLabel,
    enumOptions,
    gateTemplates,
    helpText: selectedTemplate.helpText,
    isGateRule,
    previewText,
    requiredValueOptions,
    selectedTemplate,
    sourceFieldOptions,
    valueType,
  };
}

export function getNextGateRuleValue(params: {
  currentValue: string;
  gateTemplates: ReturnType<typeof getBackendRuleTemplates>;
  nextRuleType: RuleType;
}) {
  const { currentValue, gateTemplates, nextRuleType } = params;
  const nextTemplate = gateTemplates.find(
    (gateTemplate) => gateTemplate.ruleType === nextRuleType,
  );

  if (!nextTemplate) return currentValue;

  if (nextTemplate.valueType === RuleValueType.Boolean) {
    return currentValue.toLowerCase() === "false" ? "false" : "true";
  }

  if (nextTemplate.enumOptions.includes(currentValue)) {
    return currentValue;
  }

  return nextTemplate.enumOptions[0] ?? "";
}
