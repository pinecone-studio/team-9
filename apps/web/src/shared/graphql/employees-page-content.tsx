"use client";

import { useState } from "react";
import type { Employee } from "@/shared/apollo/types";
import EmployeeDirectoryDialog from "@/shared/graphql/employee-directory-dialog";
import EmployeesDirectoryTable from "@/shared/graphql/employees-directory-table";
import EmployeesHeroSection from "@/shared/graphql/employees-page-hero";
import EmployeesPageSkeleton from "@/shared/graphql/employees-page-skeleton";
import {
  getFlags,
  normalizeStatus,
} from "@/shared/graphql/employees-page-view-utils";
import { useEmployeesPageData } from "@/shared/graphql/use-employees-page-data";

type EmployeesPageContentProps = {
  currentUserIdentifier: string | null;
};

export default function EmployeesPageContent({
  currentUserIdentifier,
}: EmployeesPageContentProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const {
    eligibilityByEmployee,
    employees,
    error,
    filteredEmployees,
    loading,
    searchTerm,
    setSearchTerm,
  } = useEmployeesPageData();
  const totalEmployees = employees.length;
  const probationEmployees = employees.filter(
    (employee) => normalizeStatus(employee.employmentStatus) === "probation",
  ).length;
  const eligibleEmployees = employees.filter((employee) => {
    const eligibility = eligibilityByEmployee[employee.id];

    return (eligibility?.eligible ?? 0) > 0;
  }).length;
  const weeklyOverrides = employees.reduce((sum, employee) => {
    return sum + getFlags(employee).length;
  }, 0);

  if (loading) {
    return <EmployeesPageSkeleton />;
  }

  if (error && employees.length === 0) {
    return (
      <div className="rounded-[14px] border border-[#f0c5c5] bg-[#fff8f8] p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <p className="text-[18px] font-semibold text-slate-950">
          Employees data could not be loaded
        </p>
        <p className="mt-2 text-[15px] text-slate-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error ? (
        <div className="rounded-[10px] border border-[#f0c5c5] bg-[#fff8f8] px-5 py-4 text-[14px] text-[#b14a4a]">
          {error}
        </div>
      ) : null}

      <EmployeesHeroSection
        eligibleEmployees={eligibleEmployees}
        probationEmployees={probationEmployees}
        totalEmployees={totalEmployees}
        weeklyOverrides={weeklyOverrides}
      />

      <EmployeesDirectoryTable
        eligibilityByEmployee={eligibilityByEmployee}
        filteredEmployees={filteredEmployees}
        onEmployeeSelect={setSelectedEmployee}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {filteredEmployees.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-[#d7d3d3] bg-white px-6 py-10 text-center text-[15px] text-slate-500">
          No employees match the current search.
        </div>
      ) : null}

      {selectedEmployee ? (
        <EmployeeDirectoryDialog
          currentUserIdentifier={currentUserIdentifier}
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      ) : null}
    </div>
  );
}
