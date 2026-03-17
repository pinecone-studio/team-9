import type {
  DashboardQueryResult,
  EmployeeBenefitStatusOverride,
} from "./employee-dashboard.graphql";
import { buildDots, getRuleStats } from "./employee-dashboard-rule-stats";
import { toBadgeClass, toStatusLabel } from "./employee-dashboard-status";
import type { EmployeeBenefitCard, EmployeeBenefitSection } from "./employee-types";

type EmployeeEligibility = NonNullable<DashboardQueryResult["employeeEligibility"]>;
type BenefitSummary = NonNullable<DashboardQueryResult["listBenefitEligibilitySummary"]>;

export function mapBenefitSections(
  eligibilities: EmployeeEligibility,
  statusOverridesByBenefitId: Map<string, EmployeeBenefitStatusOverride>,
  benefitRuleCountByBenefitId: Map<string, number>,
  activeBenefitIds: Set<string> | null,
) {
  const latestByBenefitId = new Map<string, EmployeeEligibility[number]>();

  for (const entry of eligibilities) {
    const benefitId = entry.benefit.id;
    const previous = latestByBenefitId.get(benefitId);

    if (!previous) {
      latestByBenefitId.set(benefitId, entry);
      continue;
    }

    const previousTimestamp = new Date(previous.computedAt).getTime();
    const currentTimestamp = new Date(entry.computedAt).getTime();

    if (currentTimestamp >= previousTimestamp) {
      latestByBenefitId.set(benefitId, entry);
    }
  }

  const byCategory = new Map<string, EmployeeBenefitCard[]>();

  for (const eligibility of latestByBenefitId.values()) {
    const isExplicitlyActive =
      !activeBenefitIds || activeBenefitIds.has(eligibility.benefit.id);

    if (!eligibility.benefit.isActive || !isExplicitlyActive) {
      continue;
    }

    const baseStatus = toStatusLabel(eligibility.status);

    if (baseStatus === "Inactive") {
      continue;
    }

    const status = statusOverridesByBenefitId.get(eligibility.benefit.id) ?? baseStatus;
    const stats = getRuleStats(eligibility.ruleEvaluationJson);
    const configuredRuleCount = benefitRuleCountByBenefitId.get(eligibility.benefit.id) ?? 0;
    const total = configuredRuleCount > 0 ? configuredRuleCount : stats.total;
    const passed = Math.min(stats.passed, total);
    const subsidy = eligibility.benefit.subsidyPercent;
    const vendorName = eligibility.benefit.vendorName?.trim() ?? "";
    const subsidyLabel =
      typeof subsidy === "number"
        ? `${subsidy}% subsidy${vendorName ? ` by ${vendorName}` : ""}`
        : vendorName || "No subsidy details";
    const card: EmployeeBenefitCard = {
      accent: "",
      action: status === "Eligible",
      approvalRole: eligibility.benefit.approvalRole,
      badge: toBadgeClass(status),
      categoryId: eligibility.benefit.categoryId,
      description: eligibility.benefit.description,
      dots: buildDots(passed, total),
      id: eligibility.benefit.id,
      isActive: eligibility.benefit.isActive,
      isCore: eligibility.benefit.isCore,
      note: status === "Locked" ? "Does not meet all requirements" : undefined,
      passed: total > 0 ? `${passed}/${total} passed` : "",
      requiresContract: eligibility.benefit.requiresContract,
      status,
      subsidyPercent: typeof subsidy === "number" ? subsidy : null,
      subsidyLabel,
      title: eligibility.benefit.title,
      vendorName: vendorName || null,
    };
    const category = eligibility.benefit.category?.trim() || "Other";
    const existing = byCategory.get(category) ?? [];
    existing.push(card);
    byCategory.set(category, existing);
  }

  return Array.from(byCategory.entries())
    .map(([title, items]): EmployeeBenefitSection => ({
      id: title.toLowerCase().replace(/\s+/g, "-"),
      items,
      title,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function hasMissingActiveBenefitRecords(
  eligibilities: EmployeeEligibility,
  benefitSummary: BenefitSummary,
) {
  if (benefitSummary.length === 0) {
    return false;
  }

  const activeBenefitIds = benefitSummary
    .filter((summary) => summary.status.trim().toLowerCase() === "active")
    .map((summary) => summary.benefitId);

  if (activeBenefitIds.length === 0) {
    return false;
  }

  const eligibilityBenefitIds = new Set(
    eligibilities.map((eligibility) => eligibility.benefit.id),
  );

  return activeBenefitIds.some((benefitId) => !eligibilityBenefitIds.has(benefitId));
}
