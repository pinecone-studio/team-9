import { RuleValueType } from "@/shared/apollo/generated";

export function formatRulePreview(params: {
  configLabel: string;
  ruleLabel: string;
  unit?: string;
  value: string;
  valueType: RuleValueType;
}) {
  const { configLabel, ruleLabel, unit, value, valueType } = params;

  if (valueType === RuleValueType.Boolean) {
    const normalizedValue = value.toLowerCase() === "true" ? "yes" : "no";
    return `This ${ruleLabel.toLowerCase()} rule checks whether "${configLabel}" is ${normalizedValue}.`;
  }

  if (valueType === RuleValueType.Enum) {
    return `This ${ruleLabel.toLowerCase()} rule checks whether "${configLabel}" matches "${value || "the selected option"}".`;
  }

  const suffix = unit ? ` ${unit}` : "";
  return `This ${ruleLabel.toLowerCase()} rule checks whether "${configLabel}" is at most ${value || "0"}${suffix}.`;
}

export function getValueTypeLabel(valueType: RuleValueType) {
  if (valueType === RuleValueType.Boolean) {
    return "Yes / No";
  }
  if (valueType === RuleValueType.Enum) {
    return "Choose one";
  }
  return "Number";
}
