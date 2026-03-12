"use client";

import type { Employee } from "@/lib/apollo/employees";
import {
  getInitials,
  getStatusTone,
  getTenureMonths,
  type EligibilitySummary,
} from "@/components/graphql/employees-page-utils";

function EligibilityCount({
  label,
  tone,
  value,
}: {
  label: string;
  tone: string;
  value: number;
}) {
  return (
    <div className="min-w-15 text-center">
      <p className={`text-[30px] leading-none font-semibold ${tone}`}>{value}</p>
      <p className="mt-2 text-[13px] text-slate-500">{label}</p>
    </div>
  );
}

type EmployeeEligibilityCardProps = {
  eligibility: EligibilitySummary;
  employee: Employee;
  isRefreshing: boolean;
  onRecalculate: (employee: Employee) => void;
};

export default function EmployeeEligibilityCard({
  eligibility,
  employee,
  isRefreshing,
  onRecalculate,
}: EmployeeEligibilityCardProps) {
  return (
    <article className="rounded-3xl border border-[#ddd6d6] bg-white px-5 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.03)] sm:px-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-4 sm:gap-6">
          <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-[#dbe9fb] text-[24px] font-semibold text-[#2563b8]">
            {getInitials(employee.name)}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[20px] font-semibold text-slate-950">
                {employee.name}
              </h2>
              <span
                className={`rounded-xl border px-3 py-1 text-[13px] font-medium ${getStatusTone(employee.employmentStatus)}`}
              >
                {employee.employmentStatus}
              </span>
            </div>

            <p className="mt-1 text-[16px] text-slate-500">{employee.email}</p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-slate-500">
              <span>{employee.department}</span>
              <span>{getTenureMonths(employee.hireDate)}</span>
              <span>Level {employee.responsibilityLevel}</span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-[13px] text-slate-600">
                {employee.position}
              </span>

              <button
                className="rounded-full border border-[#d6dbe4] px-4 py-2 text-[13px] font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isRefreshing}
                onClick={() => onRecalculate(employee)}
                type="button"
              >
                {isRefreshing ? "Refreshing..." : "Recalculate"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 self-end xl:self-auto">
          <EligibilityCount
            label="Active"
            tone="text-[#179331]"
            value={eligibility.active}
          />
          <EligibilityCount
            label="Eligible"
            tone="text-[#1e73d8]"
            value={eligibility.eligible}
          />
          <EligibilityCount
            label="Locked"
            tone="text-slate-500"
            value={eligibility.locked}
          />
        </div>
      </div>
    </article>
  );
}
