import { ArrowRight } from "lucide-react";

export function DetailSection({
  title,
  action,
  children,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export function DetailCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] p-[17px] ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export function LabeledValue({
  label,
  value,
  valueClassName = "text-[14px] leading-5 font-medium text-[#0A0A0A]",
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div>
      <div className="text-[12px] leading-4 text-[#737373]">{label}</div>
      <div className={valueClassName}>{value}</div>
    </div>
  );
}

export function ChangeSummaryRow({
  label,
  nextValue,
  previousValue,
}: {
  label: string;
  nextValue: React.ReactNode;
  previousValue: React.ReactNode;
}) {
  return (
    <DetailCard className="p-3">
      <div className="mb-2 text-[12px] leading-4 text-[#737373]">{label}</div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1 rounded-[4px] border border-[#FFC9C9] bg-[#FEF2F2] px-[9px] py-[9px] text-[14px] leading-5 text-[#C10007] line-through">
          {previousValue}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 self-center text-[#737373]" />
        <div className="flex-1 rounded-[4px] border border-[#B9F8CF] bg-[#F0FDF4] px-[9px] py-[9px] text-[14px] leading-5 text-[#008236]">
          {nextValue}
        </div>
      </div>
    </DetailCard>
  );
}

export function SubmissionDetailsCard({
  approverName,
  approverSubtitle,
  requesterName,
  requesterSubtitle,
  statusBadge,
  submittedAt,
}: {
  approverName: React.ReactNode;
  approverSubtitle: React.ReactNode;
  requesterName: React.ReactNode;
  requesterSubtitle: React.ReactNode;
  statusBadge: React.ReactNode;
  submittedAt: React.ReactNode;
}) {
  return (
    <DetailCard>
      <div className="grid gap-x-6 gap-y-8 md:grid-cols-2">
        <div className="space-y-8">
          <div>
            <div className="text-[12px] leading-4 text-[#737373]">Submitted by</div>
            <div className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
              {requesterName}
            </div>
            <div className="text-[12px] leading-4 text-[#737373]">{requesterSubtitle}</div>
          </div>
          <div>
            <div className="text-[12px] leading-4 text-[#737373]">Assigned Approver</div>
            <div className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
              {approverName}
            </div>
            <div className="text-[12px] leading-4 text-[#737373]">{approverSubtitle}</div>
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <div className="text-[12px] leading-4 text-[#737373]">Submitted</div>
            <div className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
              {submittedAt}
            </div>
          </div>
          <div>
            <div className="text-[12px] leading-4 text-[#737373]">Status</div>
            <div className="pt-1">{statusBadge}</div>
          </div>
        </div>
      </div>
    </DetailCard>
  );
}
