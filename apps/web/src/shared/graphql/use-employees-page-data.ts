"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  useEmployeesPageQuery,
  useRecalculateEmployeeEligibilityMutation,
} from "@/shared/apollo/generated";
import { type Employee } from "@/shared/apollo/types";
import {
  buildEligibilitySummary,
  type EligibilitySummary,
} from "@/shared/graphql/employees-page-utils";

export type StatusFilter = "all" | "active" | "probation" | "terminated";

export function useEmployeesPageData() {
  const [overriddenSummaries, setOverriddenSummaries] = useState<
    Record<string, EligibilitySummary>
  >({});
  const [manualError, setManualError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [refreshingEmployeeId, setRefreshingEmployeeId] = useState<
    string | null
  >(null);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const {
    data: employeesData,
    error: employeesQueryError,
    loading: isEmployeesLoading,
  } = useEmployeesPageQuery({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const [recalculateEmployeeEligibility] =
    useRecalculateEmployeeEligibilityMutation();

  const employees = useMemo(
    () =>
      (employeesData?.employees ?? []).filter((e): e is Employee => e !== null),
    [employeesData],
  );
  const queriedSummaries = useMemo<Record<string, EligibilitySummary>>(
    () =>
      Object.fromEntries(
        (employeesData?.employeeEligibilitySummaries ?? []).map((summary) => [
          summary.employeeId,
          {
            active: summary.active,
            eligible: summary.eligible,
            locked: summary.locked,
          },
        ]),
      ),
    [employeesData?.employeeEligibilitySummaries],
  );
  const eligibilityByEmployee = useMemo(
    () => ({ ...queriedSummaries, ...overriddenSummaries }),
    [overriddenSummaries, queriedSummaries],
  );

  async function handleRecalculate(employee: Employee) {
    setRefreshingEmployeeId(employee.id);
    setManualError(null);

    try {
      const result = await recalculateEmployeeEligibility({
        variables: { employeeId: employee.id },
      });

      setOverriddenSummaries((current) => ({
        ...current,
        [employee.id]: buildEligibilitySummary(
          result.data?.recalculateEmployeeEligibility ?? [],
        ),
      }));
    } catch (caughtError) {
      setManualError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to recalculate eligibility.",
      );
    } finally {
      setRefreshingEmployeeId(null);
    }
  }

  const normalizedSearch = deferredSearchTerm.trim().toLowerCase();
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      employee.name.toLowerCase().includes(normalizedSearch) ||
      employee.email.toLowerCase().includes(normalizedSearch) ||
      employee.department.toLowerCase().includes(normalizedSearch) ||
      employee.position.toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      statusFilter === "all" ||
      employee.employmentStatus.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const error = manualError ?? employeesQueryError?.message ?? null;
  const loading = isEmployeesLoading;

  return {
    eligibilityByEmployee,
    employees,
    error,
    filteredEmployees,
    handleRecalculate,
    loading,
    refreshingEmployeeId,
    searchTerm,
    setSearchTerm,
    setStatusFilter,
    statusFilter,
  };
}
