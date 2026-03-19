import { Operator, RuleType, RuleValueType } from "@/shared/apollo/generated";

export function getRuleTypeLabel(sectionTitle: string) {
  return sectionTitle.replace(/ Rules$/, "");
}

export function getRuleTypeFromSection(sectionTitle: string): RuleType {
  if (sectionTitle === "Gate Rules") return RuleType.EmploymentStatus;
  if (sectionTitle === "Threshold Rules") return RuleType.Attendance;
  if (sectionTitle === "Tenure Rules") return RuleType.TenureDays;
  return RuleType.ResponsibilityLevel;
}

export function getOperatorForValueType(valueType: RuleValueType): Operator {
  if (valueType === RuleValueType.Boolean || valueType === RuleValueType.Enum) {
    return Operator.Eq;
  }
  return Operator.Lte;
}

export function getDefaultValueForType(valueType: RuleValueType): string {
  if (valueType === RuleValueType.Boolean) return "true";
  if (valueType === RuleValueType.Enum) return "";
  if (valueType === RuleValueType.Date) return "30";
  return "0";
}

export function getDefaultEnumOptions(ruleType: RuleType): string[] {
  if (ruleType === RuleType.ResponsibilityLevel) {
    return ["Level 1 - Junior", "Level 2 - Senior", "Level 3 - Lead"];
  }
  if (ruleType === RuleType.EmploymentStatus) {
    return ["Probation", "Permanent", "Contract"];
  }
  if (ruleType === RuleType.Attendance) {
    return ["Teacher", "Non-Teacher"];
  }
  return ["Option A", "Option B"];
}

export function getConfigLabelOptions(
  ruleType: RuleType,
  valueType: RuleValueType,
): string[] {
  if (ruleType === RuleType.TenureDays) {
    if (valueType === RuleValueType.Number || valueType === RuleValueType.Date) {
      return ["Minimum Tenure"];
    }
    if (valueType === RuleValueType.Enum) return ["Tenure Band"];
    return ["Tenure Completed"];
  }

  if (ruleType === RuleType.Attendance) {
    if (valueType === RuleValueType.Number) return ["Late arrivals", "Late minutes"];
    if (valueType === RuleValueType.Date) return ["Late arrival time"];
    if (valueType === RuleValueType.Enum) return ["Shift type"];
    return ["Is late"];
  }

  if (ruleType === RuleType.ResponsibilityLevel) {
    if (valueType === RuleValueType.Enum) return ["Minimum Level"];
    if (valueType === RuleValueType.Number) return ["Minimum level score"];
    return ["Has required level"];
  }

  if (valueType === RuleValueType.Boolean) {
    return ["Employment active", "OKR submitted"];
  }
  if (valueType === RuleValueType.Enum) return ["Employment status", "Role"];
  if (valueType === RuleValueType.Date) return ["Probation days"];
  return ["Probation months"];
}

export function getUnitOptions(
  configLabel: string,
  valueType: RuleValueType,
): string[] {
  if (valueType === RuleValueType.Boolean || valueType === RuleValueType.Enum) {
    return [];
  }

  const normalized = configLabel.toLowerCase();
  if (normalized.includes("tenure") || normalized.includes("probation")) {
    return ["days", "months", "years"];
  }
  if (normalized.includes("arrival time")) {
    return ["AM", "PM", "hours"];
  }
  if (normalized.includes("late arrivals")) {
    return ["times"];
  }
  if (normalized.includes("late minutes")) {
    return ["minutes"];
  }
  return ["days", "months", "times"];
}

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
  return `This ${ruleLabel.toLowerCase()} rule checks whether "${configLabel}" is at least ${value || "0"}${suffix}.`;
}
