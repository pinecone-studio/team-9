import {
  parseJsonObject,
} from "./audit-log-builder-formatters";
import {
  parseBenefitRuleNames,
  resolveBenefitMonthlyValue,
} from "./audit-log-builder-benefit-formatters";

export function extractBenefitSnapshot(snapshotJson: string | null | undefined) {
  const snapshot = parseJsonObject(snapshotJson);
  if (!snapshot) {
    return null;
  }

  return {
    approvalRole:
      typeof snapshot.approvalRole === "string"
        ? snapshot.approvalRole
        : typeof snapshot.approval_role === "string"
          ? snapshot.approval_role
          : null,
    attachedRules: parseBenefitRuleNames(
      snapshot.linkedRules ?? snapshot.attachedRules ?? snapshot.rulesApplied ?? snapshot.rules,
    ),
    category: typeof snapshot.category === "string" ? snapshot.category : null,
    description: typeof snapshot.description === "string" ? snapshot.description : null,
    monthlyCap: resolveBenefitMonthlyValue({
      monthlyAmount:
        typeof snapshot.monthlyAmount === "number" || typeof snapshot.monthlyAmount === "string"
          ? snapshot.monthlyAmount
          : null,
      monthlyCap:
        typeof snapshot.monthlyCap === "number" || typeof snapshot.monthlyCap === "string"
          ? snapshot.monthlyCap
          : null,
      monthly_amount:
        typeof snapshot.monthly_amount === "number" || typeof snapshot.monthly_amount === "string"
          ? snapshot.monthly_amount
          : null,
      monthly_cap:
        typeof snapshot.monthly_cap === "number" || typeof snapshot.monthly_cap === "string"
          ? snapshot.monthly_cap
          : null,
    }),
    name: typeof snapshot.name === "string" ? snapshot.name : null,
    requiresContract:
      typeof snapshot.requiresContract === "boolean"
        ? snapshot.requiresContract
        : typeof snapshot.requires_contract === "boolean"
          ? snapshot.requires_contract
          : null,
    subsidyPercentage:
      snapshot.subsidyPercentage ??
      snapshot.subsidyPercent ??
      snapshot.subsidy_percentage ??
      null,
    vendorName:
      typeof snapshot.vendorName === "string"
        ? snapshot.vendorName
        : typeof snapshot.vendor_name === "string"
          ? snapshot.vendor_name
          : null,
  };
}

export function extractRuleSnapshot(snapshotJson: string | null | undefined) {
  const snapshot = parseJsonObject(snapshotJson);
  if (!snapshot) {
    return null;
  }

  return {
    description: typeof snapshot.description === "string" ? snapshot.description : null,
    defaultOperator:
      typeof snapshot.defaultOperator === "string" ? snapshot.defaultOperator : null,
    defaultUnit: typeof snapshot.defaultUnit === "string" ? snapshot.defaultUnit : null,
    defaultValue:
      typeof snapshot.defaultValue === "string" ? snapshot.defaultValue : null,
  };
}
