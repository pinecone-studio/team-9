"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
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
  const [eligibilityByEmployee, setEligibilityByEmployee] = useState<Record<string, EligibilitySummary>>({});
  const [isEligibilityLoading, setIsEligibilityLoading] = useState(true);
  const [manualError, setManualError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [refreshingEmployeeId, setRefreshingEmployeeId] = useState<string | null>(null);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const { data: employeesData, error: employeesQueryError, loading: isEmployeesLoading } = useEmployeesPageQuery({
    fetchPolicy: "network-only",
  });

  const [loadEmployeeEligibility] = useEmployeeEligibilityLazyQuery({ fetchPolicy: "network-only" });
  const [recalculateEmployeeEligibility] = useRecalculateEmployeeEligibilityMutation();

  // 1. useMemo ашиглан reference-ийг тогтвортой байлгах
  const employees = useMemo(() =>
    (employeesData?.employees ?? []).filter((e): e is Employee => e !== null),
    [employeesData]
  );

  useEffect(() => {
    let isActive = true;

    async function loadAll() {
      if (isEmployeesLoading || employees.length === 0) {
        if (!isEmployeesLoading) setIsEligibilityLoading(false);
        return;
      }

      setIsEligibilityLoading(true);
      try {
        // Тайлбар: Энэ хэсгийг Backend дээр нэг Query болгох нь хамгийн зөв.
        // Одоохондоо байгаа кодоо оновчтой болгоё:
        const results = await Promise.all(
          employees.map(async (emp) => {
            const res = await loadEmployeeEligibility({ variables: { employeeId: emp.id } });
            return { id: emp.id, data: res.data?.employeeEligibility ?? [] };
          })
        );

        if (isActive) {
          const newMap: Record<string, EligibilitySummary> = {};
          results.forEach(res => {
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
    return () => { isActive = false; };
  }, [employees]);

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
