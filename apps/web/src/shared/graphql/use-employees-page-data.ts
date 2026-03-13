"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import {
  EmployeeEligibilityDocument,
  type EmployeeEligibilityQuery,
  type EmployeeEligibilityQueryVariables,
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
  const client = useApolloClient();

  const {
    data: employeesData,
    error: employeesQueryError,
    loading: isEmployeesLoading,
  } = useEmployeesPageQuery({
    fetchPolicy: "network-only",
  });

  const [recalculateEmployeeEligibility] =
    useRecalculateEmployeeEligibilityMutation();

  // 1. useMemo ашиглан reference-ийг тогтвортой байлгах
  const employees = useMemo(
    () =>
      (employeesData?.employees ?? []).filter((e): e is Employee => e !== null),
    [employeesData],
  );

  useEffect(() => {
    let isActive = true;

    async function loadAll() {
      if (isEmployeesLoading || employees.length === 0) {
        if (!isEmployeesLoading) setIsEligibilityLoading(false);
        return;
      }

      setIsEligibilityLoading(true);
      setManualError(null);
      try {
        const results = await Promise.all(
          employees.map(async (emp) => {
            const res = await client.query<
              EmployeeEligibilityQuery,
              EmployeeEligibilityQueryVariables
            >({
              query: EmployeeEligibilityDocument,
              variables: { employeeId: emp.id },
              fetchPolicy: "network-only",
            });

            return { id: emp.id, data: res.data?.employeeEligibility ?? [] };
          }),
        );

        if (isActive) {
          const newMap: Record<string, EligibilitySummary> = {};
          results.forEach((res) => {
            newMap[res.id] = buildEligibilitySummary(res.data);
          });
          setEligibilityByEmployee(newMap);
        }
      } catch {
        if (isActive) setManualError("Мэдээлэл авахад алдаа гарлаа.");
      } finally {
        if (isActive) setIsEligibilityLoading(false);
      }
    }

    void loadAll();
    return () => {
      isActive = false;
    };
  }, [employees, isEmployeesLoading]);

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
