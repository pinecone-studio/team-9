import type { SummaryCard } from "./requests-data";
import { statusStyles, type RequestStatus } from "./requests-data";

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-flex h-[22px] items-center justify-center rounded-[8px] border px-2 text-center text-[12px] leading-4 font-medium ${statusStyles[status]}`}
    >
      {status === "approved"
        ? "Approved"
        : status === "rejected"
          ? "Rejected"
          : "Pending"}
    </span>
  );
}

export function SectionTab({ count, label }: { count: number; label: string }) {
  return (
    <div className="inline-flex h-[29px] items-center gap-[14px] rounded-[8px] bg-white px-2 py-1 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
        {label}
      </span>
      <span className="inline-flex h-[22px] min-w-[26px] items-center justify-center rounded-[8px] bg-[#F5F5F5] px-2 text-[12px] leading-4 font-medium text-[#171717]">
        {count}
      </span>
    </div>
  );
}

export function ReviewButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      className="inline-flex h-8 items-center justify-center rounded-[8px] px-3 text-[14px] leading-5 font-medium text-[#0A0A0A]"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

export function SummaryMetricCard({ icon: Icon, label, value }: SummaryCard) {
  return (
    <article className="flex h-[74px] flex-col justify-between rounded-[14px] border border-[#E5E5E5] bg-white px-4 py-3">
      <p className="text-[12px] leading-4 font-medium text-[#737373]">{label}</p>
      <div className="flex items-center justify-between">
        <span className="text-[24px] leading-8 font-semibold text-[#0A0A0A]">
          {value}
        </span>
        <Icon className="h-6 w-6 text-[#737373]" strokeWidth={1.8} />
      </div>
    </article>
  );
}
