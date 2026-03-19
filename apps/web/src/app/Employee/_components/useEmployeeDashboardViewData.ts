"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  useEmployeeBenefitRequestsQuery,
  useEmployeeDashboardDataQuery,
  useRecalculateEmployeeEligibilityMutation,
} from "@/shared/apollo/generated";

import { hasMissingActiveBenefitRecords } from "./employee-dashboard-benefits";
import type { DashboardQueryResult } from "./employee-dashboard.graphql";
import {
  buildEmployeeDashboardViewData,
  buildEmptyDashboardData,
} from "./employee-dashboard-view-data";

type UseEmployeeDashboardViewDataInput = {
  employeeEmail: string | null;
  employeeId: string;
  employeeLateArrivals30Days: number | null;
  employeeName: string;
  employeeOkrSubmitted: boolean | null;
  employeeResponsibilityLevel: number | null;
  employmentStatus: string;
};

export function useEmployeeDashboardViewData({
  employeeEmail,
  employeeId,
  employeeLateArrivals30Days,
  employeeName,
  employeeOkrSubmitted,
  employeeResponsibilityLevel,
  employmentStatus,
}: UseEmployeeDashboardViewDataInput) {
  const emptyDashboardData = useMemo(
    () => buildEmptyDashboardData(employmentStatus, employeeResponsibilityLevel),
    [employeeResponsibilityLevel, employmentStatus],
  );
  const shouldSkip = employeeId.length === 0;
  const [manualError, setManualError] = useState<{ employeeId: string; message: string } | null>(
    null,
  );
  const attemptedRecalculationRef = useRef(false);
  const dashboardQuery = useEmployeeDashboardDataQuery({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    skip: shouldSkip,
    variables: { employeeId },
  });
  const benefitRequestsQuery = useEmployeeBenefitRequestsQuery({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    skip: shouldSkip,
    variables: { employeeId },
  });
  const [recalculateEmployeeEligibility, { loading: recalculateLoading }] =
    useRecalculateEmployeeEligibilityMutation();

  useEffect(() => {
    attemptedRecalculationRef.current = false;
  }, [employeeId]);

  useEffect(() => {
    if (shouldSkip || dashboardQuery.loading) {
      return;
    }

    const employeeEligibility = dashboardQuery.data?.employeeEligibility ?? [];
    const benefitSummary = dashboardQuery.data?.listBenefitEligibilitySummary ?? [];

    if (
      attemptedRecalculationRef.current ||
      !hasMissingActiveBenefitRecords(employeeEligibility, benefitSummary)
    ) {
      return;
    }

    attemptedRecalculationRef.current = true;

    void recalculateEmployeeEligibility({ variables: { employeeId } })
      .then(async () => {
        await Promise.all([dashboardQuery.refetch(), benefitRequestsQuery.refetch()]);
      })
      .catch((error) => {
        setManualError({
          employeeId,
          message:
            error instanceof Error
              ? error.message
              : "Unable to refresh eligibility results.",
        });
      });
  }, [dashboardQuery, employeeId, recalculateEmployeeEligibility, shouldSkip]);

  if (shouldSkip) {
    return {
      dashboardData: emptyDashboardData,
      errorMessage: null,
      isInitialLoading: false,
      isLoading: false,
    };
  }

  const rawEligibility = dashboardQuery.data?.employeeEligibility ?? [];
  const dashboardData = buildEmployeeDashboardViewData({
    approvalRequests: dashboardQuery.data?.approvalRequests ?? [],
    employeeEligibility: rawEligibility,
    employeeEmail,
    employeeLateArrivals30Days:
      typeof dashboardQuery.data?.employee?.lateArrivalCount30Days === "number"
        ? dashboardQuery.data.employee.lateArrivalCount30Days
        : employeeLateArrivals30Days,
    employeeName,
    employeeOkrSubmitted:
      typeof dashboardQuery.data?.employee?.okrSubmitted === "boolean"
        ? dashboardQuery.data.employee.okrSubmitted
        : employeeOkrSubmitted,
    employeeResponsibilityLevel:
      dashboardQuery.data?.employee?.responsibilityLevel ?? employeeResponsibilityLevel,
    employmentStatus:
      dashboardQuery.data?.employee?.employmentStatus ?? employmentStatus,
    requestRows: benefitRequestsQuery.data?.benefitRequests ?? [],
    summaryRows: dashboardQuery.data?.listBenefitEligibilitySummary ?? [],
  });
  const errorMessage =
    (manualError?.employeeId === employeeId ? manualError.message : null) ??
    dashboardQuery.error?.message ??
    benefitRequestsQuery.error?.message ??
    null;
  const isInitialLoading =
    (dashboardQuery.loading && !dashboardQuery.data) ||
    (benefitRequestsQuery.loading && !benefitRequestsQuery.data);

  return {
    dashboardData,
    errorMessage,
    isInitialLoading,
    isLoading:
      dashboardQuery.loading ||
      benefitRequestsQuery.loading ||
      recalculateLoading,
  };
}
