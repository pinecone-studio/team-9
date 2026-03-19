import {
  getPendingBenefitIds,
  mapBenefitSections,
} from "./employee-dashboard-benefits";
import {
  buildRequestSummary,
  mapRequests,
} from "./employee-dashboard-requests";
import {
  findFirstBooleanMetric,
  findFirstNumericMetric,
} from "./employee-dashboard-signals";
import { buildSummaryCards } from "./employee-dashboard-summary";
import type { DashboardQueryResult } from "./employee-dashboard.graphql";
import type {
  EmployeeDashboardViewData,
  EmployeeEligibilitySignals,
} from "./employee-types";

type BuildDashboardViewDataInput = {
  approvalRequests: NonNullable<DashboardQueryResult["approvalRequests"]>;
  employeeEligibility: NonNullable<DashboardQueryResult["employeeEligibility"]>;
  employeeEmail: string | null;
  employeeLateArrivals30Days: number | null;
  employeeName: string;
  employeeOkrSubmitted: boolean | null;
  employeeResponsibilityLevel: number | null;
  employmentStatus: string;
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
  approvalRequests,
  employeeEligibility,
  employeeEmail,
  employeeLateArrivals30Days,
  employeeName,
  employeeOkrSubmitted,
  employeeResponsibilityLevel,
  employmentStatus,
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
  const pendingBenefitIds = getPendingBenefitIds(approvalRequests);
  const requestSummary = buildRequestSummary(requestRows, employeeEmail, employeeName);
  const sections = mapBenefitSections(
    employeeEligibility,
    requestSummary.statusByBenefitId,
    benefitRuleCountByBenefitId,
    activeBenefitIds,
    pendingBenefitIds,
  );
  const allBenefits = sections.flatMap((section) => section.items);
  const requests = mapRequests(
    requestSummary.requests,
    new Map(allBenefits.map((benefit) => [benefit.id, benefit])),
  );
  const okrSubmitted =
    employeeOkrSubmitted ??
    findFirstBooleanMetric(
      employeeEligibility,
      (key) => key.toLowerCase().includes("okr"),
    );
  const lateArrivals30Days =
    employeeLateArrivals30Days ??
    findFirstNumericMetric(
      employeeEligibility,
      (key) => key.toLowerCase().includes("late") || key.toLowerCase().includes("attendance"),
    );

  return {
    requests,
    sections,
    signals: {
      employmentStatus,
      lateArrivals30Days,
      okrSubmitted,
      responsibilityLevel: employeeResponsibilityLevel,
    },
    summaryCards: buildSummaryCards(allBenefits, requestSummary.pendingCount),
  };
}
