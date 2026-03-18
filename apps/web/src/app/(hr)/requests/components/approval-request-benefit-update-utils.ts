import { formatApprovalRole } from "./approval-request-utils";
import { formatDetailSubsidy } from "./request-detail-formatters";

export type BenefitUpdateShape = {
  approvalRole?: string;
  category?: string;
  categoryId?: string;
  description?: string;
  name?: string;
  subsidyPercent?: number | string | null;
  vendorName?: string | null;
};

export type BenefitUpdateRuleAssignment = {
  errorMessage?: string;
  name?: string;
  ruleId?: string;
  value?: string;
};

export function getBenefitUpdateChangeRows(
  currentBenefit: BenefitUpdateShape | null,
  previousBenefit: BenefitUpdateShape | null,
  nextRules: BenefitUpdateRuleAssignment[],
  previousRules: BenefitUpdateRuleAssignment[],
) {
  const rows = [
    {
      label: "Subsidy Percentage",
      nextValue: formatDetailSubsidy(currentBenefit?.subsidyPercent),
      previousValue: formatDetailSubsidy(previousBenefit?.subsidyPercent),
    },
    {
      label: "Vendor",
      nextValue: currentBenefit?.vendorName?.trim() || "-",
      previousValue: previousBenefit?.vendorName?.trim() || "-",
    },
    {
      label: "Approver",
      nextValue: formatApprovalRole(
        currentBenefit?.approvalRole === "finance_manager" ? "finance_manager" : "hr_admin",
      ),
      previousValue: formatApprovalRole(
        previousBenefit?.approvalRole === "finance_manager" ? "finance_manager" : "hr_admin",
      ),
    },
  ];

  const changedRows = rows.filter((row) =>
    row.previousValue !== "-" || row.nextValue !== "-"
      ? row.previousValue !== row.nextValue
      : false,
  );

  if (changedRows.length > 0) {
    return changedRows;
  }

  if (nextRules.length > 0 || previousRules.length > 0) {
    return [
      {
        label: "Rule Assignments",
        nextValue: `${nextRules.length} rule${nextRules.length === 1 ? "" : "s"}`,
        previousValue: `${previousRules.length} rule${previousRules.length === 1 ? "" : "s"}`,
      },
    ];
  }

  return rows.slice(0, 1);
}
