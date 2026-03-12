"use client";

import { useApolloClient } from "@apollo/client/react";
import { useDeferredValue, useEffect, useState } from "react";
import {
  EmployeesPageDocument,
  EmployeeEligibilityDocument,
  RecalculateEmployeeEligibilityDocument,
  type EmployeesPageQuery,
} from "@/lib/apollo/__generated__/graphql";
import {
  buildEligibilitySummary,
  type EligibilitySummary,
} from "@/components/graphql/employees-page-utils";

export type StatusFilter = "all" | "active" | "probation" | "terminated";

type Employee = EmployeesPageQuery["employees"][number];

export function useEmployeesPageData() {
  const client = useApolloClient();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [eligibilityByEmployee, setEligibilityByEmployee] = useState<
    Record<string, EligibilitySummary>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [refreshingEmployeeId, setRefreshingEmployeeId] = useState<
    string | null
  >(null);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    let isActive = true;

    async function loadEmployees() {
      setLoading(true);
      setError(null);

      try {
        const employeesResult = await client.query({
          fetchPolicy: "network-only",
          query: EmployeesPageDocument,
        });

        const loadedEmployees = employeesResult.data?.employees ?? [];

        const eligibilityEntries = await Promise.all(
          loadedEmployees.map(async (employee) => {
            const eligibilityResult = await client.query({
              fetchPolicy: "network-only",
              query: EmployeeEligibilityDocument,
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

        setEmployees(loadedEmployees);
        setEligibilityByEmployee(Object.fromEntries(eligibilityEntries));
      } catch (caughtError) {
        if (!isActive) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load employees.",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadEmployees();

    return () => {
      isActive = false;
    };
  }, [client]);

  async function handleRecalculate(employee: Employee) {
    setRefreshingEmployeeId(employee.id);
    setError(null);

    try {
      const result = await client.mutate({
        mutation: RecalculateEmployeeEligibilityDocument,
        variables: { employeeId: employee.id },
      });

      setEligibilityByEmployee((current) => ({
        ...current,
        [employee.id]: buildEligibilitySummary(
          result.data?.recalculateEmployeeEligibility ?? [],
        ),
      }));
    } catch (caughtError) {
      setError(
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
