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
  const [recalculatedEligibility, setRecalculatedEligibility] = useState<{
    employeeId: string;
    records: NonNullable<DashboardQueryResult["employeeEligibility"]>;
  } | null>(null);
  const [manualError, setManualError] = useState<{ employeeId: string; message: string } | null>(
    null,
  );
  const attemptedRecalculationRef = useRef(false);
  const dashboardQuery = useEmployeeDashboardDataQuery({
    fetchPolicy: "network-only",
    skip: shouldSkip,
    variables: { employeeId },
  });
  const benefitRequestsQuery = useEmployeeBenefitRequestsQuery({
    fetchPolicy: "network-only",
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
      .then((result) => {
        setRecalculatedEligibility({
          employeeId,
          records: result.data?.recalculateEmployeeEligibility ?? employeeEligibility,
        });
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
      isLoading: false,
    };
  }

  const rawEligibility = dashboardQuery.data?.employeeEligibility ?? [];
  const employeeEligibility =
    recalculatedEligibility?.employeeId === employeeId
      ? recalculatedEligibility.records
      : rawEligibility;
  const dashboardData = buildEmployeeDashboardViewData({
    benefitStatusOverrides: new Map(),
    employeeEligibility,
    employeeEmail,
    employeeLateArrivals30Days,
    employeeName,
    employeeOkrSubmitted,
    employeeResponsibilityLevel:
      dashboardQuery.data?.employee?.responsibilityLevel ?? employeeResponsibilityLevel,
    employmentStatus:
      dashboardQuery.data?.employee?.employmentStatus ?? employmentStatus,
    rawEligibility,
    requestRows: benefitRequestsQuery.data?.benefitRequests ?? [],
    summaryRows: dashboardQuery.data?.listBenefitEligibilitySummary ?? [],
  });
  const errorMessage =
    (manualError?.employeeId === employeeId ? manualError.message : null) ??
    dashboardQuery.error?.message ??
    benefitRequestsQuery.error?.message ??
    null;

  return {
    dashboardData,
    errorMessage,
    isLoading:
      dashboardQuery.loading ||
      benefitRequestsQuery.loading ||
      recalculateLoading,
  };
}
