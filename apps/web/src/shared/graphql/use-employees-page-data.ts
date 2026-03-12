"use client";

import { useDeferredValue, useEffect, useState } from "react";
import {
  useEmployeeEligibilityLazyQuery,
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
  const [eligibilityByEmployee, setEligibilityByEmployee] = useState<
    Record<string, EligibilitySummary>
  >({});
  const [isEligibilityLoading, setIsEligibilityLoading] = useState(true);
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
  });
  const [loadEmployeeEligibility] = useEmployeeEligibilityLazyQuery(
    { fetchPolicy: "network-only" },
  );
  const [recalculateEmployeeEligibility] =
    useRecalculateEmployeeEligibilityMutation();

  const employees = (employeesData?.employees ?? []).filter(
    (employee): employee is Employee => employee !== null,
  );

  useEffect(() => {
    let isActive = true;

    async function loadEmployeeEligibilityMap() {
      if (isEmployeesLoading) {
        return;
      }

      if (employees.length === 0) {
        setEligibilityByEmployee({});
        setIsEligibilityLoading(false);
        return;
      }

      setIsEligibilityLoading(true);
      setManualError(null);

      try {
        const eligibilityEntries = await Promise.all(
          employees.map(async (employee) => {
            const eligibilityResult = await loadEmployeeEligibility({
              variables: { employeeId: employee.id },
            });

            return [
              employee.id,
              buildEligibilitySummary(
                eligibilityResult.data?.employeeEligibility ?? [],
              ),
            ] as const;
          }),
        );

        if (!isActive) {
          return;
        }

        setEligibilityByEmployee(Object.fromEntries(eligibilityEntries));
      } catch (caughtError) {
        if (!isActive) {
          return;
        }

        setManualError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load employee eligibility.",
        );
      } finally {
        if (isActive) {
          setIsEligibilityLoading(false);
        }
      }
    }

    void loadEmployeeEligibilityMap();

    return () => {
      isActive = false;
    };
  }, [employees, isEmployeesLoading, loadEmployeeEligibility]);

  async function handleRecalculate(employee: Employee) {
    setRefreshingEmployeeId(employee.id);
    setManualError(null);

    try {
      const result = await recalculateEmployeeEligibility({
        variables: { employeeId: employee.id },
      });

      setEligibilityByEmployee((current) => ({
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
  const loading = isEmployeesLoading || isEligibilityLoading;

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
