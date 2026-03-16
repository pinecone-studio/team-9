import { RuleValueType } from "@/shared/apollo/generated";

type ValidateRuleInputParams = {
  description: string;
  enumOptions: string[];
  name: string;
  value: string;
  valueType: RuleValueType;
};

export function validateRuleInput({
  description,
  enumOptions,
  name,
  value,
  valueType,
}: ValidateRuleInputParams) {
  if (!name.trim() || !description.trim()) {
    return "Rule name and description are required.";
  }

  if (
    (valueType === RuleValueType.Number || valueType === RuleValueType.Date) &&
    !Number.isFinite(Number(value))
  ) {
    return "Default value must be a valid number.";
  }

  if (
    valueType === RuleValueType.Enum &&
    (enumOptions.length === 0 || !enumOptions.includes(value))
  ) {
    return "Default value must match one of the backend options.";
  }

  if (valueType === RuleValueType.Boolean && !["true", "false"].includes(value)) {
    return "Boolean type default value must be true or false.";
  }

  return null;
}

export function buildRuleOptionsJson(params: {
  configLabel: string;
  enumOptions: string[];
  valueType: RuleValueType;
}) {
  if (params.valueType === RuleValueType.Boolean) {
    return JSON.stringify({ configLabel: params.configLabel, options: [true, false] });
  }

  if (params.valueType === RuleValueType.Enum) {
    return JSON.stringify({
      configLabel: params.configLabel,
      options: params.enumOptions,
    });
  }

  return JSON.stringify({ configLabel: params.configLabel });
}
