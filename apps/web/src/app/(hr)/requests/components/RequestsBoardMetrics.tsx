import {
  AlertCircle,
  CheckCircle2,
  CircleAlert,
  CircleX,
  Clock3,
} from "lucide-react";
import type { ComponentType } from "react";

type MetricCardProps = {
  icon: ComponentType<{ className?: string }>;
  label: string;
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

function MetricCard({ icon: Icon, label, value }: MetricCardProps) {
  return (
    <article className="flex min-h-[74px] flex-1 flex-col rounded-[14px] border border-[#E5E5E5] bg-white px-4 py-3">
      <span className="text-[12px] leading-4 font-medium text-[#737373]">{label}</span>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[24px] leading-8 font-semibold text-[#0A0A0A]">{value}</span>
        <Icon className="h-6 w-6 text-[#737373]" />
      </div>
    </article>
  );
}

export function RequestsMetrics({ metrics }: { metrics: Record<string, number> }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
      <MetricCard icon={Clock3} label="Pending Requests" value={metrics.pendingRequests} />
      <MetricCard icon={CircleX} label="Rejected Today" value={metrics.rejectedToday} />
      <MetricCard icon={CircleAlert} label="Awaiting Finance" value={metrics.awaitingFinance} />
      <MetricCard icon={AlertCircle} label="Pending Override" value={metrics.pendingOverrides} />
      <MetricCard icon={CheckCircle2} label="Approved Today" value={metrics.approvedToday} />
    </div>
  );
}
