import "server-only";

import type { EmployeeRecord } from "@/shared/auth/get-employee-record-by-email";
import { postGraphql } from "./employee-dashboard-api";
import { hasMissingActiveBenefitRecords } from "./employee-dashboard-benefits";
import {
  BENEFIT_REQUESTS_QUERY,
  EMPLOYEE_DASHBOARD_QUERY,
  type BenefitRequestsQueryResult,
  type DashboardQueryResult,
  RECALCULATE_EMPLOYEE_ELIGIBILITY_MUTATION,
  type RecalculateEligibilityMutationResult,
} from "./employee-dashboard.graphql";
import {
  buildEmployeeDashboardViewData,
  buildEmptyDashboardData,
} from "./employee-dashboard-view-data";
import type { EmployeeDashboardViewData } from "./employee-types";

export async function getEmployeeDashboardData({
  employee,
  employeeName,
}: {
  employee: EmployeeRecord | null;
  employeeName: string;
}): Promise<EmployeeDashboardViewData> {
  if (!employee?.id) {
    return buildEmptyDashboardData(
      employee?.employmentStatus ?? "Unknown",
      employee?.responsibilityLevel ?? null,
    );
  }

  let dashboardData: DashboardQueryResult | null = null;
  let employeeEligibility: NonNullable<DashboardQueryResult["employeeEligibility"]> =
    [];
  let benefitSummary: NonNullable<
    DashboardQueryResult["listBenefitEligibilitySummary"]
  > = [];

  try {
    dashboardData =
      (await postGraphql<DashboardQueryResult>(EMPLOYEE_DASHBOARD_QUERY, {
        employeeId: employee.id,
      })) ?? null;
    employeeEligibility = dashboardData?.employeeEligibility ?? [];
    benefitSummary = dashboardData?.listBenefitEligibilitySummary ?? [];
  } catch (error) {
    console.warn("[employee] dashboard data could not be loaded.", {
      employeeId: employee.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }

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

  let benefitRequests: NonNullable<BenefitRequestsQueryResult["benefitRequests"]> =
    [];

  try {
    const requestData = await postGraphql<BenefitRequestsQueryResult>(
      BENEFIT_REQUESTS_QUERY,
      { employeeId: employee.id },
    );
    benefitRequests = requestData?.benefitRequests ?? [];
  } catch (error) {
    console.warn("[employee] benefit requests could not be loaded.", {
      employeeId: employee.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return buildEmployeeDashboardViewData({
    approvalRequests: dashboardData?.approvalRequests ?? [],
    employeeEligibility,
    employeeEmail: employee.email,
    employeeLateArrivals30Days:
      typeof dashboardData?.employee?.lateArrivalCount30Days === "number"
        ? dashboardData.employee.lateArrivalCount30Days
        : typeof employee.lateArrivalCount30Days === "number"
        ? employee.lateArrivalCount30Days
        : null,
    employeeName,
    employeeOkrSubmitted:
      typeof dashboardData?.employee?.okrSubmitted === "boolean"
        ? dashboardData.employee.okrSubmitted
        : typeof employee.okrSubmitted === "boolean"
          ? employee.okrSubmitted
          : null,
    employeeResponsibilityLevel:
      dashboardData?.employee?.responsibilityLevel ??
      employee.responsibilityLevel ??
      null,
    employmentStatus:
      dashboardData?.employee?.employmentStatus ??
      employee.employmentStatus ??
      "Unknown",
    requestRows: benefitRequests,
    summaryRows: benefitSummary,
  });
}
