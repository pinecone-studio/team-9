/* eslint-disable max-lines */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  useEmployeeBenefitRequestsQuery,
  useEmployeeDashboardDataQuery,
  useRecalculateEmployeeEligibilityMutation,
} from "@/shared/apollo/generated";
import { EmployeeContent } from "./EmployeeContent";
import {
  hasMissingActiveBenefitRecords,
  mapBenefitSections,
} from "./employee-dashboard-benefits";
import {
  type DashboardQueryResult,
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

type EmployeeDashboardClientProps = {
  currentUserIdentifier: string;
  employeeEmail: string | null;
  employeeId: string;
  employeeLateArrivals30Days: number | null;
  employeeName: string;
  employeeOkrSubmitted: boolean | null;
  employeeResponsibilityLevel: number | null;
  employmentStatus: string;
};

export function EmployeeDashboardClient({
  currentUserIdentifier,
  employeeEmail,
  employeeId,
  employeeLateArrivals30Days,
  employeeName,
  employeeOkrSubmitted,
  employeeResponsibilityLevel,
  employmentStatus,
}: EmployeeDashboardClientProps) {
  const emptyDashboardData = useMemo(() => {
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
    } satisfies EmployeeDashboardViewData;
  }, [employeeResponsibilityLevel, employmentStatus]);

  const shouldSkip = employeeId.length === 0;
  const [recalculatedEligibility, setRecalculatedEligibility] = useState<
    {
      employeeId: string;
      records: NonNullable<DashboardQueryResult["employeeEligibility"]>;
    } | null
  >(null);
  const [manualError, setManualError] = useState<
    {
      employeeId: string;
      message: string;
    } | null
  >(null);
  const attemptedRecalculationRef = useRef(false);

  const {
    data: dashboardDataResponse,
    error: dashboardQueryError,
    loading: dashboardQueryLoading,
  } = useEmployeeDashboardDataQuery({
    fetchPolicy: "network-only",
    skip: shouldSkip,
    variables: {
      employeeId,
    },
  });
  const {
    data: benefitRequestsDataResponse,
    error: benefitRequestsQueryError,
    loading: benefitRequestsQueryLoading,
  } = useEmployeeBenefitRequestsQuery({
    fetchPolicy: "network-only",
    skip: shouldSkip,
    variables: {
      employeeId,
    },
  });
  const [recalculateEmployeeEligibility, { loading: recalculateLoading }] =
    useRecalculateEmployeeEligibilityMutation();

  useEffect(() => {
    attemptedRecalculationRef.current = false;
  }, [employeeId]);

  useEffect(() => {
    if (shouldSkip || dashboardQueryLoading) {
      return;
    }

    const employeeEligibility = dashboardDataResponse?.employeeEligibility ?? [];
    const benefitSummary = dashboardDataResponse?.listBenefitEligibilitySummary ?? [];

    if (
      attemptedRecalculationRef.current ||
      !hasMissingActiveBenefitRecords(employeeEligibility, benefitSummary)
    ) {
      return;
    }

    attemptedRecalculationRef.current = true;

    void recalculateEmployeeEligibility({
      variables: {
        employeeId,
      },
    })
      .then((result) => {
        setRecalculatedEligibility(
          {
            employeeId,
            records: result.data?.recalculateEmployeeEligibility ?? employeeEligibility,
          },
        );
      })
      .catch((error) => {
        setManualError(
          {
            employeeId,
            message:
              error instanceof Error
                ? error.message
                : "Unable to refresh eligibility results.",
          },
        );
      });
  }, [
    dashboardDataResponse,
    dashboardQueryLoading,
    employeeId,
    recalculateEmployeeEligibility,
    shouldSkip,
  ]);

  let dashboardData: EmployeeDashboardViewData = emptyDashboardData;

  if (!shouldSkip) {
    const rawEligibility = dashboardDataResponse?.employeeEligibility ?? [];
    const employeeEligibility =
      recalculatedEligibility?.employeeId === employeeId
        ? recalculatedEligibility.records
        : rawEligibility;
    const benefitSummary = dashboardDataResponse?.listBenefitEligibilitySummary ?? [];
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
      rawEligibility,
      new Map(),
      benefitRuleCountByBenefitId,
      activeBenefitIds,
    );
    const baseBenefits = baseSections.flatMap((section) => section.items);
    const benefitNameById = new Map(
      baseBenefits.map((benefit) => [benefit.id, benefit.title]),
    );
    const benefitRequests = benefitRequestsDataResponse?.benefitRequests ?? [];
    const requestsPayload = mapRequests(
      benefitRequests,
      employeeEmail,
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
      ) ?? employeeOkrSubmitted;
    const lateArrivals30Days =
      findFirstNumericMetric(
        employeeEligibility,
        (key) =>
          key.toLowerCase().includes("late") ||
          key.toLowerCase().includes("attendance"),
      ) ?? employeeLateArrivals30Days;
    const signals: EmployeeEligibilitySignals = {
      employmentStatus:
        dashboardDataResponse?.employee?.employmentStatus ?? employmentStatus,
      lateArrivals30Days,
      okrSubmitted,
      responsibilityLevel:
        dashboardDataResponse?.employee?.responsibilityLevel ??
        employeeResponsibilityLevel,
    };

    dashboardData = {
      requests: requestsPayload.requests,
      sections,
      signals,
      summaryCards: buildSummaryCards(allBenefits, requestsPayload.pendingCount),
    };
  }

  const errorMessage =
    (manualError?.employeeId === employeeId ? manualError.message : null) ??
    dashboardQueryError?.message ??
    benefitRequestsQueryError?.message ??
    null;
  const isLoading =
    !shouldSkip &&
    (dashboardQueryLoading || benefitRequestsQueryLoading || recalculateLoading);

  return (
    <EmployeeContent
      currentUserIdentifier={currentUserIdentifier}
      dashboardData={dashboardData}
      employeeId={employeeId}
      employeeName={employeeName}
      errorMessage={errorMessage}
      isLoading={isLoading}
    />
  );
}
