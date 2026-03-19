import { BadgeCheck, BriefcaseBusiness, Building2, CheckCircle2, Clock3, IdCard, Sparkles, UserRound } from "lucide-react";
import type { BenefitRequestEligibilityItem } from "./benefit-request-review-utils";
import { BenefitRequestStatusPill, type BenefitRequestStatusBadge, SnapshotItem } from "./BenefitRequestReviewSectionParts";

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
  statusBadge: BenefitRequestStatusBadge;
}) {
  const reviewerLabel =
    statusBadge.label === "Rejected"
      ? "Rejected By"
      : statusBadge.label === "Cancelled"
        ? "Reviewed By"
        : "Approved By";
  const primaryLabel = isPending ? "Category" : "Submitted";

  return (
    <section className="grid gap-x-8 gap-y-5 rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] p-[17px] md:grid-cols-2">
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
          <span className="text-[12px] leading-4 text-[#737373]">{primaryLabel}</span>
          <span className="text-[14px] leading-5 text-[#0A0A0A]">{primaryValue}</span>
        </div>
        {isPending ? (
          <div className="flex flex-col gap-[6px]">
            <span className="text-[12px] leading-4 text-[#737373]">Status</span>
            <BenefitRequestStatusPill statusBadge={statusBadge} />
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
            {isPending ? "Submitted" : reviewerLabel}
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
      <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        <SnapshotItem icon={<BriefcaseBusiness className="h-4 w-4 text-[#737373]" />} label="Role" value={position} />
        <SnapshotItem icon={<Building2 className="h-4 w-4 text-[#737373]" />} label="Department" value={department} />
        <SnapshotItem icon={<UserRound className="h-4 w-4 text-[#737373]" />} label="Status" value={employmentStatus} />
        <SnapshotItem icon={<IdCard className="h-4 w-4 text-[#737373]" />} label="Level" value={`Level ${level ?? "-"}`} />
        <SnapshotItem
          icon={<BadgeCheck className="h-4 w-4 text-[#00C950]" />}
          label="OKR"
          value={okrSubmitted ? "Submitted" : "Not submitted"}
        />
        <SnapshotItem icon={<Clock3 className="h-4 w-4 text-[#737373]" />} label="Late Arrivals" value={`${lateArrivalCount} (30 days)`} />
      </div>
    </section>
  );
}

export function BenefitRequestEligibilitySection({
  items,
  loading,
}: {
  items: BenefitRequestEligibilityItem[];
  loading: boolean;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Eligibility Checks</h3>
      {loading ? (
        <span className="text-[14px] leading-5 text-[#737373]">Loading eligibility details...</span>
      ) : items.length > 0 ? (
        <div className="flex flex-wrap gap-x-[30px] gap-y-3">
          {items.map((item) => (
            <div className="flex items-start gap-2" key={item.id}>
              <CheckCircle2
                className={`mt-0.5 h-4 w-4 shrink-0 ${item.passed ? "text-[#00C950]" : "text-[#DC2626]"}`}
              />
              <div className="min-w-0">
                <p className="text-[14px] leading-5 text-[#0A0A0A]">{item.label}</p>
                {!item.passed ? <p className="text-[12px] leading-5 text-[#737373]">{item.description}</p> : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-[12px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-4 py-3 text-[14px] leading-5 text-[#737373]">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
          <p>No configured eligibility rules were found for this benefit.</p>
        </div>
      )}
    </section>
  );
}

export function BenefitRequestNotesSection({
  reviewComment,
}: {
  reviewComment: string;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-[16px] leading-6 font-semibold text-[#0A0A0A]">Decision Notes</h3>
      <div className="rounded-[14px] border border-[#E2E8F0] bg-white px-4 py-3 text-[14px] leading-6 text-[#0A0A0A]">{reviewComment}</div>
    </section>
  );
}
