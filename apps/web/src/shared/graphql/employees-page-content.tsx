"use client";

import EmployeeEligibilityCard from "@/shared/graphql/employee-eligibility-card";
import {
  useEmployeesPageData,
} from "@/shared/graphql/use-employees-page-data";

export default function EmployeesPageContent() {
  const {
    eligibilityByEmployee,
    employees,
    error,
    filteredEmployees,
    handleRecalculate,
    loading,
    refreshingEmployeeId,
  } = useEmployeesPageData();

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#ddd6d6] bg-white p-8 text-[16px] text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
        Loading employees...
      </div>
    );
  }

  if (error && employees.length === 0) {
    return (
      <div className="rounded-3xl border border-[#f0c5c5] bg-[#fff8f8] p-8 shadow-[0_10px_24px_rgba(15,23,42,0.03)]">
        <p className="text-[18px] font-semibold text-slate-950">
          Employees data could not be loaded
        </p>
        <p className="mt-2 text-[15px] text-slate-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-[20px] border border-[#f0c5c5] bg-[#fff8f8] px-5 py-4 text-[14px] text-[#b14a4a]">
          {error}
        </div>
      ) : null}

      <div className="space-y-5">
        {filteredEmployees.map((employee) => {
          const eligibility = eligibilityByEmployee[employee.id] ?? {
            active: 0,
            eligible: 0,
            locked: 0,
          };
          return (
            <EmployeeEligibilityCard
              eligibility={eligibility}
              employee={employee}
              isRefreshing={refreshingEmployeeId === employee.id}
              key={employee.id}
              onRecalculate={(targetEmployee) => {
                void handleRecalculate(targetEmployee);
              }}
            />
          );
        })}
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#d7d3d3] bg-white px-6 py-10 text-center text-[15px] text-slate-500">
          No employees match the current search and status filter.
        </div>
      ) : null}
    </div>
  );
}
