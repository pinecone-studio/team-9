"use client";

import {
  CheckCircle2,
  Hourglass,
  Shield,
  Users,
} from "lucide-react";
import EmployeesDirectoryTable from "@/shared/graphql/employees-directory-table";
import {
  getFlags,
  normalizeStatus,
  OverviewCard,
} from "@/shared/graphql/employees-page-view-utils";
import {
  useEmployeesPageData,
} from "@/shared/graphql/use-employees-page-data";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} />;
}

function EmployeesPageSkeleton() {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="rounded-[14px] border border-[#E5E5E5] bg-white p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
            key={index}
          >
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="mt-4 h-10 w-16" />
            <SkeletonBlock className="mt-3 h-3 w-36" />
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col gap-4 px-6 pt-6 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <SkeletonBlock className="h-5 w-40" />
            <SkeletonBlock className="mt-2 h-4 w-72" />
          </div>
          <SkeletonBlock className="h-9 w-full md:w-[256px]" />
        </div>

        <div className="border-t border-[#E5E5E5] px-6 py-4">
          <div className="grid grid-cols-6 gap-6 pb-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock className="h-4 w-20" key={`header-${index}`} />
            ))}
          </div>
          <div className="space-y-4 pt-2">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div className="grid grid-cols-6 gap-6" key={`row-${rowIndex}`}>
                <SkeletonBlock className="h-5 w-24" />
                <SkeletonBlock className="h-5 w-20" />
                <SkeletonBlock className="h-5 w-20" />
                <SkeletonBlock className="h-5 w-16" />
                <SkeletonBlock className="h-5 w-20" />
                <SkeletonBlock className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function EmployeesPageContent() {
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
    return sum + getFlags(employee.name, employee.employmentStatus).length;
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
    <div className="space-y-6">
      {error ? (
        <div className="rounded-[10px] border border-[#f0c5c5] bg-[#fff8f8] px-5 py-4 text-[14px] text-[#b14a4a]">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          caption={String(totalEmployees)}
          icon={Users}
          subtitle="Employees in system"
          title="Total Employees"
        />
        <OverviewCard
          caption={String(eligibleEmployees)}
          icon={CheckCircle2}
          subtitle="Eligible for standard benefit rules"
          title="Eligible for Benefits"
        />
        <OverviewCard
          caption={String(probationEmployees)}
          icon={Hourglass}
          subtitle="Currently in probation period"
          title="On Probation"
        />
        <OverviewCard
          caption={String(weeklyOverrides)}
          icon={Shield}
          subtitle="Eligibility Overrides"
          title="Employees Overrides this week"
        />
      </section>

      <EmployeesDirectoryTable
        eligibilityByEmployee={eligibilityByEmployee}
        filteredEmployees={filteredEmployees}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {filteredEmployees.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-[#d7d3d3] bg-white px-6 py-10 text-center text-[15px] text-slate-500">
          No employees match the current search.
        </div>
      ) : null}
    </div>
  );
}
