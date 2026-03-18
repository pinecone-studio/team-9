"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  Edit3,
  type LucideIcon,
  ShieldCheck,
} from "lucide-react";
import type {
  EmployeeDirectoryBenefit,
  EmployeeDirectoryEmployee,
} from "@/shared/graphql/employee-directory-dialog-utils";
import {
  formatDateLabel,
  formatStatusLabel,
  getBooleanSignalClass,
  getProbationSignal,
  getTenureLabel,
  groupBenefitsByStatus,
} from "@/shared/graphql/employee-directory-dialog-utils";

type EmployeeDirectoryDialogOverviewProps = {
  benefits: EmployeeDirectoryBenefit[];
  employee: EmployeeDirectoryEmployee;
  onEditEmployee: () => void;
};

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[#0A0A0A]">
      <Icon className="h-[18px] w-[18px]" />
      <h3 className="text-[16px] leading-5 font-medium">{title}</h3>
    </div>
  );
}

function SummaryCard({
  accentClassName,
  label,
  value,
}: {
  accentClassName: string;
  label: string;
  value: number;
}) {
  return (
    <article className="flex min-h-[66px] flex-col items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] px-3 py-3">
      <p className={`text-[18px] leading-7 font-semibold ${accentClassName}`}>{value}</p>
      <p className="text-[12px] leading-4 text-[#737373]">{label}</p>
    </article>
  );
}

export default function EmployeeDirectoryDialogOverview({
  benefits,
  employee,
  onEditEmployee,
}: EmployeeDirectoryDialogOverviewProps) {
  const groupedBenefits = groupBenefitsByStatus(benefits);

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <SectionTitle icon={BriefcaseBusiness} title="Employee Overview" />
          <button
            className="inline-flex items-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-white px-3 py-2 text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#FAFAFA]"
            onClick={onEditEmployee}
            type="button"
          >
            <Edit3 className="h-4 w-4" />
            Edit Employee Data
          </button>
        </div>

        <div className="grid gap-4 text-[14px] leading-5 md:grid-cols-3">
          <div><p className="text-[12px] leading-4 text-[#737373]">Role</p><p className="mt-1 font-medium text-[#0A0A0A]">{employee.position}</p></div>
          <div><p className="text-[12px] leading-4 text-[#737373]">Department</p><p className="mt-1 font-medium text-[#0A0A0A]">{employee.department}</p></div>
          <div><p className="text-[12px] leading-4 text-[#737373]">Responsibility Level</p><p className="mt-1 font-medium text-[#0A0A0A]">Level {employee.responsibilityLevel}</p></div>
          <div><p className="text-[12px] leading-4 text-[#737373]">Employment Status</p><p className="mt-1 font-medium text-[#0A0A0A]">{formatStatusLabel(employee.employmentStatus)}</p></div>
          <div><p className="text-[12px] leading-4 text-[#737373]">Hire Date</p><p className="mt-1 flex items-center gap-2 font-medium text-[#0A0A0A]"><CalendarDays className="h-4 w-4 text-[#737373]" />{formatDateLabel(employee.hireDate)}</p></div>
          <div><p className="text-[12px] leading-4 text-[#737373]">Tenure</p><p className="mt-1 font-medium text-[#0A0A0A]">{getTenureLabel(employee.hireDate)}</p></div>
        </div>
      </section>

      <section className="space-y-4 border-t border-[#E5E5E5] pt-6">
        <SectionTitle icon={ClipboardList} title="Eligibility Signals" />
        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex items-center justify-between rounded-[8px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] px-3 py-3"><p className="text-[14px] leading-5 text-[#0A0A0A]">OKR Submitted</p><span className={`rounded-[4px] px-2 py-1 text-[12px] leading-4 font-medium ${getBooleanSignalClass(employee.okrSubmitted)}`}>{employee.okrSubmitted ? "Yes" : "No"}</span></div>
          <div className="flex items-center justify-between rounded-[8px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] px-3 py-3"><p className="text-[14px] leading-5 text-[#0A0A0A]">Late Arrivals (30d)</p><span className="rounded-[4px] border border-[#E5E5E5] px-2 py-1 text-[12px] leading-4 font-medium text-[#0A0A0A]">{employee.lateArrivalCount}</span></div>
          <div className="flex items-center justify-between rounded-[8px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] px-3 py-3"><p className="text-[14px] leading-5 text-[#0A0A0A]">Probation</p><span className={`rounded-[4px] px-2 py-1 text-[12px] leading-4 font-medium ${getBooleanSignalClass(getProbationSignal(employee.employmentStatus) === "Completed")}`}>{getProbationSignal(employee.employmentStatus)}</span></div>
        </div>
      </section>

      <section className="space-y-4 border-t border-[#E5E5E5] pt-6">
        <SectionTitle icon={ShieldCheck} title="Benefit Summary" />
        <div className="grid gap-3 md:grid-cols-4">
          <SummaryCard accentClassName="text-[#00A63E]" label="Active" value={groupedBenefits.active.length} />
          <SummaryCard accentClassName="text-[#155DFC]" label="Eligible" value={groupedBenefits.eligible.length} />
          <SummaryCard accentClassName="text-[#E7000B]" label="Locked" value={groupedBenefits.locked.length} />
          <SummaryCard accentClassName="text-[#E17100]" label="Pending" value={groupedBenefits.pending.length} />
        </div>
      </section>
    </div>
  );
}
