"use client";

import { Search, TriangleAlert } from "lucide-react";
import type { Employee } from "@/shared/apollo/types";
import type { EligibilitySummary } from "@/shared/graphql/employees-page-utils";
import {
  getFlags,
  getFlagTone,
  getStatusBadgeTone,
} from "@/shared/graphql/employees-page-view-utils";

type EmployeesDirectoryTableProps = {
  eligibilityByEmployee: Record<string, EligibilitySummary>;
  filteredEmployees: Employee[];
  onEmployeeSelect: (employee: Employee) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export default function EmployeesDirectoryTable({
  eligibilityByEmployee,
  filteredEmployees,
  onEmployeeSelect,
  searchTerm,
  setSearchTerm,
}: EmployeesDirectoryTableProps) {
  return (
    <section className="overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-4 px-6 pt-6 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-[16px] leading-6 font-semibold text-[#0A0A0A]">
            Employee Directory
          </h2>
          <p className="mt-1 text-[14px] leading-5 text-[#737373]">
            Click on a row to view employee details and eligibility
          </p>
        </div>

        <label className="relative block w-full md:w-[256px]">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#737373]"
          />
          <input
            className="h-9 w-full rounded-[8px] border border-[#E5E5E5] bg-white py-2 pr-3 pl-9 text-[14px] leading-[18px] text-[#0A0A0A] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373] focus:border-[#D4D4D8]"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search employees..."
            value={searchTerm}
          />
        </label>
      </div>

      <div className="max-h-[320px] overflow-auto border-t border-[#E5E5E5] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full min-w-[980px] border-collapse">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-[#E5E5E5] text-left">
              <th className="px-8 py-2.5 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                Employee
              </th>
              <th className="px-8 py-2.5 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                Role
              </th>
              <th className="px-8 py-2.5 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                Department
              </th>
              <th className="px-8 py-2.5 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                Status
              </th>
              <th className="px-8 py-2.5 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                Flags
              </th>
              <th className="px-8 py-2.5 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                Benefits
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {filteredEmployees.map((employee) => {
              const eligibility = eligibilityByEmployee[employee.id] ?? {
                active: 0,
                eligible: 0,
                locked: 0,
              };
              const flags = getFlags(employee);

              return (
                <tr
                  className="cursor-pointer transition-colors hover:bg-[#FAFAFA]"
                  key={employee.id}
                  onClick={() => onEmployeeSelect(employee)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onEmployeeSelect(employee);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <td className="px-8 py-3.5 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                    {employee.name}
                  </td>
                  <td className="px-8 py-3.5 text-[14px] leading-5 text-[#737373]">
                    {employee.position}
                  </td>
                  <td className="px-8 py-3.5 text-[14px] leading-5 text-[#737373]">
                    {employee.department}
                  </td>
                  <td className="px-8 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-[8px] px-[8px] py-[2px] text-[12px] leading-4 font-medium ${getStatusBadgeTone(employee.employmentStatus)}`}
                    >
                      {employee.employmentStatus}
                    </span>
                  </td>
                  <td className="px-8 py-3.5">
                    {flags.length === 0 ? (
                      <span className="text-[14px] leading-5 text-[#737373]">-</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {flags.map((flag) => (
                          <span
                            className={`inline-flex items-center gap-1 rounded-[8px] border px-[8px] py-[2px] text-[12px] leading-4 font-medium ${getFlagTone(flag.tone)}`}
                            key={flag.label}
                          >
                            <TriangleAlert className="h-3 w-3" />
                            {flag.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-3.5">
                    <span className="inline-flex items-center rounded-[8px] border border-[#E5E5E5] px-[8px] py-[2px] text-[12px] leading-4 text-[#0A0A0A]">
                      {eligibility.eligible} eligible
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
