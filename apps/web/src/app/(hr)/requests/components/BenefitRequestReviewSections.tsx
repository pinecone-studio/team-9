import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Timer,
  UserRound,
} from "lucide-react";

type StatusBadge = {
  bgClassName: string;
  iconClassName: string;
  label: string;
  textClassName: string;
};

export function BenefitRequestOverviewSection({
  approvalRoute,
  benefitTitle,
  employeeName,
  employeePosition,
  primaryValue,
  reviewedByLabel,
  secondaryValue,
  statusBadge,
  isPending,
}: {
  approvalRoute: string;
  benefitTitle: string;
  employeeName: string;
  employeePosition: string;
  isPending: boolean;
  primaryValue: string;
  reviewedByLabel: string;
  secondaryValue: string;
  statusBadge: StatusBadge;
}) {
  return (
    <section className="grid gap-4 rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] p-4 md:grid-cols-2">
      <div className="flex flex-col gap-[10px]">
        <div className="flex flex-col gap-[6px]">
          <span className="text-[12px] leading-4 text-[#737373]">Employee</span>
          <div className="flex flex-col">
            <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
              {employeeName}
            </span>
            <span className="text-[14px] leading-5 text-[#737373]">{employeePosition}</span>
          </div>
        </div>
        <div className="flex flex-col gap-[6px]">
          <span className="text-[12px] leading-4 text-[#737373]">
            {isPending ? "Category" : "Submitted"}
          </span>
          <span className="text-[14px] leading-5 text-[#0A0A0A]">{primaryValue}</span>
        </div>
        {isPending ? (
          <div className="flex flex-col gap-[6px]">
            <span className="text-[12px] leading-4 text-[#737373]">Status</span>
            <span className={`inline-flex w-fit items-center gap-[6px] rounded-[4px] px-2 py-[2px] text-[12px] leading-4 font-medium ${statusBadge.bgClassName} ${statusBadge.textClassName}`}>
              <Clock3 className={`h-3 w-3 ${statusBadge.iconClassName}`} />
              {statusBadge.label}
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-[10px]">
        <div className="flex flex-col gap-[6px]">
          <span className="text-[12px] leading-4 text-[#737373]">Benefit</span>
          <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
            {benefitTitle}
          </span>
        </div>
        <div className="flex flex-col gap-[6px]">
          <span className="text-[12px] leading-4 text-[#737373]">
            {isPending ? "Submitted" : "Approved By"}
          </span>
          <span className="text-[14px] leading-5 text-[#0A0A0A]">
            {isPending ? secondaryValue : reviewedByLabel}
          </span>
        </div>
        {isPending ? (
          <div className="flex flex-col gap-[6px]">
            <span className="text-[12px] leading-4 text-[#737373]">Approval Route</span>
            <span className="text-[14px] leading-5 text-[#0A0A0A]">{approvalRoute}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function BenefitRequestEmployeeSnapshotSection({
  department,
  employmentStatus,
  lateArrivalCount,
  level,
  okrSubmitted,
  position,
}: {
  department: string;
  employmentStatus: string;
  lateArrivalCount: number;
  level: number | null;
  okrSubmitted: boolean;
  position: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Employee Snapshot</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SnapshotItem icon={<BriefcaseBusiness className="h-4 w-4 text-[#737373]" />} label="Role" value={position} />
        <SnapshotItem icon={<Building2 className="h-4 w-4 text-[#737373]" />} label="Department" value={department} />
        <SnapshotItem icon={<UserRound className="h-4 w-4 text-[#737373]" />} label="Status" value={employmentStatus} />
        <SnapshotItem icon={<CalendarDays className="h-4 w-4 text-[#737373]" />} label="Level" value={`Level ${level ?? "-"}`} />
        <SnapshotItem
          icon={<CheckCircle2 className="h-4 w-4 text-[#00C950]" />}
          label="OKR"
          value={okrSubmitted ? "Submitted" : "Not submitted"}
        />
        <SnapshotItem
          icon={<Timer className="h-4 w-4 text-[#737373]" />}
          label="Late Arrivals"
          value={String(lateArrivalCount)}
        />
      </div>
    </section>
  );
}

function SnapshotItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <div className="text-[12px] leading-4 text-[#737373]">{label}</div>
        <div className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{value}</div>
      </div>
    </div>
  );
}

export function BenefitRequestEligibilitySection() {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Eligibility Checks</h3>
      <div className="flex flex-wrap gap-x-[30px] gap-y-2">
        <span className="text-[14px] leading-5 text-[#737373]">
          Eligibility details will appear after the API schema is updated.
        </span>
      </div>
    </section>
  );
}

export function BenefitRequestNotesSection({
  reviewComment,
}: {
  reviewComment: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Decision Notes</h3>
      <div className="rounded-[10px] border border-[#E2E8F0] bg-white px-4 py-3 text-[14px] leading-6 text-[#0A0A0A]">
        {reviewComment}
      </div>
    </section>
  );
}
