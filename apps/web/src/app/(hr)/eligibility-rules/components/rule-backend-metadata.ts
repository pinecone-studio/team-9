import {
  EmploymentStatus,
  RuleType,
  RuleValueType,
} from "@/shared/apollo/generated";

export type RuleTemplate = {
  businessLabel: string;
  configLabel: string;
  enumOptions: string[];
  helpText: string;
  ruleType: RuleType;
  unitOptions: string[];
  valueType: RuleValueType;
};

type RuleTemplateOptions = {
  employeeRoles: string[];
};

const EMPLOYMENT_STATUS_OPTIONS = [
  EmploymentStatus.Active,
  EmploymentStatus.Probation,
  EmploymentStatus.Leave,
  EmploymentStatus.Terminated,
];

function toSentenceCase(value: string) {
  return value
    .split(/[_-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getRoleOptions(employeeRoles: string[]) {
  const uniqueRoles = Array.from(
    new Set(employeeRoles.map((role) => role.trim()).filter(Boolean)),
  );

  return uniqueRoles.sort((left, right) => left.localeCompare(right));
}

export function getBackendRuleTemplates(
  sectionTitle: string,
  options: RuleTemplateOptions,
): RuleTemplate[] {
  if (sectionTitle === "Gate Rules") {
    return [
      {
        businessLabel: "Employee status",
        configLabel: "Employment status",
        enumOptions: EMPLOYMENT_STATUS_OPTIONS.map(toSentenceCase),
        helpText: "Use this for rules based on whether someone is active, on probation, on leave, or terminated.",
        ruleType: RuleType.EmploymentStatus,
        unitOptions: [],
        valueType: RuleValueType.Enum,
      },
      {
        businessLabel: "OKR completion",
        configLabel: "OKR submitted",
        enumOptions: [],
        helpText: "Use this when the rule depends on whether the employee has submitted their OKR.",
        ruleType: RuleType.OkrSubmitted,
        unitOptions: [],
        valueType: RuleValueType.Boolean,
      },
      {
        businessLabel: "Job role",
        configLabel: "Role",
        enumOptions: getRoleOptions(options.employeeRoles),
        helpText: "Use this when a benefit should apply only to certain positions or job roles.",
        ruleType: RuleType.Role,
        unitOptions: [],
        valueType: RuleValueType.Enum,
      },
    ];
  }

  if (sectionTitle === "Threshold Rules") {
    return [
      {
        businessLabel: "Attendance and lateness",
        configLabel: "Late arrival count",
        enumOptions: [],
        helpText: "Use this for lateness rules, for example how many times an employee arrived late.",
        ruleType: RuleType.Attendance,
        unitOptions: ["times"],
        valueType: RuleValueType.Number,
      },
    ];
  }

  if (sectionTitle === "Tenure Rules") {
    return [
      {
        businessLabel: "Length of employment",
        configLabel: "Tenure in days",
        enumOptions: [],
        helpText: "Use this when the rule depends on how many days the employee has worked since hire date.",
        ruleType: RuleType.TenureDays,
        unitOptions: ["days"],
        valueType: RuleValueType.Number,
      },
    ];
  }

  return [
    {
      businessLabel: "Employee level",
      configLabel: "Responsibility level",
      enumOptions: [],
      helpText: "Use this when eligibility depends on the employee's responsibility or seniority level.",
      ruleType: RuleType.ResponsibilityLevel,
      unitOptions: ["level"],
      valueType: RuleValueType.Number,
    },
  ];
}

export function getTemplateByRuleType(
  ruleType: RuleType,
  options: RuleTemplateOptions,
): RuleTemplate {
  if (ruleType === RuleType.EmploymentStatus) {
    return getBackendRuleTemplates("Gate Rules", options)[0];
  }

  if (ruleType === RuleType.OkrSubmitted) {
    return getBackendRuleTemplates("Gate Rules", options)[1];
  }

  if (ruleType === RuleType.Role) {
    return getBackendRuleTemplates("Gate Rules", options)[2];
  }

  if (ruleType === RuleType.Attendance) {
    return getBackendRuleTemplates("Threshold Rules", options)[0];
  }

  if (ruleType === RuleType.TenureDays) {
    return getBackendRuleTemplates("Tenure Rules", options)[0];
  }

  return getBackendRuleTemplates("Level Rules", options)[0];
}

export function getDefaultValueForTemplate(template: RuleTemplate): string {
  if (template.valueType === RuleValueType.Boolean) {
    return "true";
  }

  if (template.valueType === RuleValueType.Enum) {
    return template.enumOptions[0] ?? "";
  }

  if (template.ruleType === RuleType.ResponsibilityLevel) {
    return "1";
  }

  if (template.ruleType === RuleType.TenureDays) {
    return "30";
  }

  return "0";
}

export function getOperatorForValueType(valueType: RuleValueType) {
  if (valueType === RuleValueType.Boolean || valueType === RuleValueType.Enum) {
    return "eq";
  }

  return "lte";
}
