import "server-only";

import type { EmployeeRecord } from "@/shared/auth/get-employee-record-by-email";
import { postGraphql } from "./employee-dashboard-api";
import {
  hasMissingActiveBenefitRecords,
  mapBenefitSections,
} from "./employee-dashboard-benefits";
import {
  APPROVAL_REQUESTS_QUERY,
  EMPLOYEE_DASHBOARD_QUERY,
  RECALCULATE_EMPLOYEE_ELIGIBILITY_MUTATION,
  type ApprovalRequestsQueryResult,
  type DashboardQueryResult,
  type RecalculateEligibilityMutationResult,
} from "./employee-dashboard.graphql";
import { mapRequests } from "./employee-dashboard-requests";
import {
  findFirstBooleanMetric,
  findFirstNumericMetric,
} from "./employee-dashboard-signals";
import { buildSummaryCards } from "./employee-dashboard-summary";
import type {
  EmployeeDashboardViewData,
  EmployeeEligibilitySignals,
} from "./employee-types";

export async function getEmployeeDashboardData({
  employee,
  employeeName,
}: {
  employee: EmployeeRecord | null;
  employeeName: string;
}): Promise<EmployeeDashboardViewData> {
  const emptySignals: EmployeeEligibilitySignals = {
    employmentStatus: employee?.employmentStatus ?? "Unknown",
    lateArrivals30Days: null,
    okrSubmitted: null,
    responsibilityLevel: employee?.responsibilityLevel ?? null,
  };

  if (!employee?.id) {
    return {
      requests: [],
      sections: [],
      signals: emptySignals,
      summaryCards: buildSummaryCards([], 0),
    };
  }

  const dashboardData = await postGraphql<DashboardQueryResult>(
    EMPLOYEE_DASHBOARD_QUERY,
    {
      employeeId: employee.id,
    },
  );
  let employeeEligibility = dashboardData?.employeeEligibility ?? [];
  const benefitSummary = dashboardData?.listBenefitEligibilitySummary ?? [];

  if (hasMissingActiveBenefitRecords(employeeEligibility, benefitSummary)) {
    try {
      const recalculateResult =
        await postGraphql<RecalculateEligibilityMutationResult>(
          RECALCULATE_EMPLOYEE_ELIGIBILITY_MUTATION,
          { employeeId: employee.id },
        );
      employeeEligibility =
        recalculateResult?.recalculateEmployeeEligibility ?? employeeEligibility;
    } catch (error) {
      console.warn("[employee] eligibility recalculation failed.", {
        employeeId: employee.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const benefitRuleCountByBenefitId = new Map(
    benefitSummary.map((summary) => [
      summary.benefitId,
      summary.rulesApplied.length,
    ]),
  );
  const activeBenefitIds =
    benefitSummary.length > 0
      ? new Set(
          benefitSummary
            .filter((summary) => summary.status.trim().toLowerCase() === "active")
            .map((summary) => summary.benefitId),
        )
      : null;
  const baseSections = mapBenefitSections(
    employeeEligibility,
    new Map(),
    benefitRuleCountByBenefitId,
    activeBenefitIds,
  );
  const baseBenefits = baseSections.flatMap((section) => section.items);
  const benefitNameById = new Map(
    baseBenefits.map((benefit) => [benefit.id, benefit.title]),
  );

  let approvalRequests: NonNullable<ApprovalRequestsQueryResult["approvalRequests"]> =
    [];

  try {
    const approvalData =
      await postGraphql<ApprovalRequestsQueryResult>(APPROVAL_REQUESTS_QUERY);
    approvalRequests = approvalData?.approvalRequests ?? [];
  } catch (error) {
    console.warn("[employee] approval requests could not be loaded.", {
      employeeId: employee.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const requestsPayload = mapRequests(
    approvalRequests,
    employee.email,
    employeeName,
    benefitNameById,
  );
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
    ) ?? (typeof employee.okrSubmitted === "boolean" ? employee.okrSubmitted : null);
  const lateArrivals30Days =
    findFirstNumericMetric(
      employeeEligibility,
      (key) =>
        key.toLowerCase().includes("late") ||
        key.toLowerCase().includes("attendance"),
    ) ??
    (typeof employee.lateArrivalCount30Days === "number"
      ? employee.lateArrivalCount30Days
      : null);
  const signals: EmployeeEligibilitySignals = {
    employmentStatus:
      dashboardData?.employee?.employmentStatus ??
      employee.employmentStatus ??
      "Unknown",
    lateArrivals30Days,
    okrSubmitted,
    responsibilityLevel:
      dashboardData?.employee?.responsibilityLevel ??
      employee.responsibilityLevel ??
      null,
  };

  return {
    requests: requestsPayload.requests,
    sections,
    signals,
    summaryCards: buildSummaryCards(allBenefits, requestsPayload.pendingCount),
  };
}
