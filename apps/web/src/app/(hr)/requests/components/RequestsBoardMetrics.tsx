import {
  AlertCircle,
  CheckCircle2,
  CircleX,
  Clock3,
  UserRound,
} from "lucide-react";
import type { ComponentType } from "react";

export type RequestsMetricKey =
  | "approvedToday"
  | "awaitingYourApproval"
  | "pendingOverrides"
  | "pendingRequests"
  | "rejectedToday";

type MetricCardProps = {
  active?: boolean;
  accent?: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  value: number;
};

export function SectionHeader({
  count,
  title,
}: {
  count: number;
  title: string;
}) {
  return (
    <div className="inline-flex items-center gap-[14px] rounded-[8px] bg-white px-2 py-1 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.08)]">
      <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{title}</span>
      <span className="inline-flex h-[22px] min-w-[26px] items-center justify-center rounded-[8px] bg-[#F5F5F5] px-2 text-[12px] leading-4 font-medium text-[#171717]">
        {count}
      </span>
    </div>
  );
}

function MetricCard({
  accent = false,
  active = false,
  icon: Icon,
  label,
  onClick,
  value,
}: MetricCardProps) {
  return (
    <button
      className={`flex min-h-[74px] w-full flex-1 flex-col rounded-[14px] border px-4 py-3 text-left transition ${
        accent || active
          ? "border-[#B8DCFF] bg-[#F8FAFF]"
          : "border-[#E5E5E5] bg-white hover:border-[#D4D4D4] hover:bg-[#FAFAFA]"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className={`text-[12px] leading-4 font-medium ${
        accent || active ? "text-[#0061FF]" : "text-[#737373]"
      }`}>{label}</span>
      <div className="mt-2 flex items-center justify-between">
        <span className={`text-[24px] leading-8 font-semibold ${
          accent || active ? "text-[#1447E6]" : "text-[#0A0A0A]"
        }`}>{value}</span>
        <Icon className={`h-6 w-6 ${accent || active ? "text-[#0081FF]" : "text-[#737373]"}`} />
      </div>
    </button>
  );
}

export function RequestsMetrics({
  activeMetric,
  metrics,
  onMetricSelect,
}: {
  activeMetric: RequestsMetricKey | null;
  metrics: Record<string, number>;
  onMetricSelect: (metric: RequestsMetricKey) => void;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
      <MetricCard
        accent={activeMetric === "awaitingYourApproval"}
        active={activeMetric === "awaitingYourApproval"}
        icon={UserRound}
        label="Awaiting Your Approval"
        onClick={() => onMetricSelect("awaitingYourApproval")}
        value={metrics.awaitingYourApproval}
      />
      <MetricCard
        active={activeMetric === "pendingRequests"}
        icon={Clock3}
        label="Pending Requests"
        onClick={() => onMetricSelect("pendingRequests")}
        value={metrics.pendingRequests}
      />
      <MetricCard
        active={activeMetric === "rejectedToday"}
        icon={CircleX}
        label="Rejected Today"
        onClick={() => onMetricSelect("rejectedToday")}
        value={metrics.rejectedToday}
      />
      <MetricCard
        active={activeMetric === "pendingOverrides"}
        icon={AlertCircle}
        label="Pending Override"
        onClick={() => onMetricSelect("pendingOverrides")}
        value={metrics.pendingOverrides}
      />
      <MetricCard
        active={activeMetric === "approvedToday"}
        icon={CheckCircle2}
        label="Approved Today"
        onClick={() => onMetricSelect("approvedToday")}
        value={metrics.approvedToday}
      />
    </div>
  );
}
