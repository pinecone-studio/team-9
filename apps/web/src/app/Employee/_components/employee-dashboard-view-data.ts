import { mapBenefitSections } from "./employee-dashboard-benefits";
import { mapRequests } from "./employee-dashboard-requests";
import {
  findFirstBooleanMetric,
  findFirstNumericMetric,
} from "./employee-dashboard-signals";
import { buildSummaryCards } from "./employee-dashboard-summary";
import type {
  DashboardQueryResult,
  EmployeeBenefitStatusOverride,
} from "./employee-dashboard.graphql";
import type {
  EmployeeDashboardViewData,
  EmployeeEligibilitySignals,
} from "./employee-types";

type BuildDashboardViewDataInput = {
  benefitStatusOverrides: Map<string, EmployeeBenefitStatusOverride>;
  employeeEligibility: NonNullable<DashboardQueryResult["employeeEligibility"]>;
  employeeEmail: string | null;
  employeeLateArrivals30Days: number | null;
  employeeName: string;
  employeeOkrSubmitted: boolean | null;
  employeeResponsibilityLevel: number | null;
  employmentStatus: string;
  rawEligibility: NonNullable<DashboardQueryResult["employeeEligibility"]>;
  requestRows: Parameters<typeof mapRequests>[0];
  summaryRows: NonNullable<DashboardQueryResult["listBenefitEligibilitySummary"]>;
};

export function buildEmptyDashboardData(
  employmentStatus: string,
  employeeResponsibilityLevel: number | null,
): EmployeeDashboardViewData {
  const emptySignals: EmployeeEligibilitySignals = {
    employmentStatus,
    lateArrivals30Days: null,
    okrSubmitted: null,
    responsibilityLevel: employeeResponsibilityLevel,
  };

  return {
    requests: [],
    sections: [],
    signals: emptySignals,
    summaryCards: buildSummaryCards([], 0),
  };
}

export function buildEmployeeDashboardViewData({
  benefitStatusOverrides,
  employeeEligibility,
  employeeEmail,
  employeeLateArrivals30Days,
  employeeName,
  employeeOkrSubmitted,
  employeeResponsibilityLevel,
  employmentStatus,
  rawEligibility,
  requestRows,
  summaryRows,
}: BuildDashboardViewDataInput): EmployeeDashboardViewData {
  const benefitRuleCountByBenefitId = new Map(
    summaryRows.map((summary) => [summary.benefitId, summary.rulesApplied.length]),
  );
  const activeBenefitIds =
    summaryRows.length > 0
      ? new Set(
          summaryRows
            .filter((summary) => summary.status.trim().toLowerCase() === "active")
            .map((summary) => summary.benefitId),
        )
      : null;
  const baseSections = mapBenefitSections(
    rawEligibility,
    benefitStatusOverrides,
    benefitRuleCountByBenefitId,
    activeBenefitIds,
  );
  const baseBenefits = baseSections.flatMap((section) => section.items);
  const benefitNameById = new Map(baseBenefits.map((benefit) => [benefit.id, benefit.title]));
  const requestsPayload = mapRequests(requestRows, employeeEmail, employeeName, benefitNameById);
  const sections = mapBenefitSections(
    employeeEligibility,
    requestsPayload.statusByBenefitId,
    benefitRuleCountByBenefitId,
    activeBenefitIds,
  );
  const allBenefits = sections.flatMap((section) => section.items);
  const okrSubmitted =
    findFirstBooleanMetric(
      employeeEligibility,
      (key) => key.toLowerCase().includes("okr"),
    ) ?? employeeOkrSubmitted;
  const lateArrivals30Days =
    findFirstNumericMetric(
      employeeEligibility,
      (key) => key.toLowerCase().includes("late") || key.toLowerCase().includes("attendance"),
    ) ?? employeeLateArrivals30Days;

  return {
    requests: requestsPayload.requests,
    sections,
    signals: {
      employmentStatus,
      lateArrivals30Days,
      okrSubmitted,
      responsibilityLevel: employeeResponsibilityLevel,
    },
    summaryCards: buildSummaryCards(allBenefits, requestsPayload.pendingCount),
  };
}
