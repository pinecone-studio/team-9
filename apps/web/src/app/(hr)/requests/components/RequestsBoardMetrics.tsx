import type { ComponentType, SVGProps } from "react";

export type RequestsMetricKey =
  | "approvedToday"
  | "awaitingYourApproval"
  | "pendingOverrides"
  | "pendingRequests"
  | "rejectedToday";

type MetricCardProps = {
  active: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
  value: number;
};

function PersonOutlineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 20 20" {...props}>
      <path d="M10 2.375C11.45 2.375 12.625 3.55 12.625 5C12.625 6.45 11.45 7.625 10 7.625C8.55 7.625 7.375 6.45 7.375 5C7.375 3.55 8.55 2.375 10 2.375ZM10 13.625C13.7125 13.625 17.625 15.45 17.625 16.25V17.625H2.375V16.25C2.375 15.45 6.2875 13.625 10 13.625ZM10 0C7.2375 0 5 2.2375 5 5C5 7.7625 7.2375 10 10 10C12.7625 10 15 7.7625 15 5C15 2.2375 12.7625 0 10 0ZM10 11.25C6.6625 11.25 0 12.925 0 16.25V20H20V16.25C20 12.925 13.3375 11.25 10 11.25Z" fill="currentColor" />
    </svg>
  );
}

function AccessTimeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 25 25" {...props}>
      <path d="M12.4875 0C5.5875 0 0 5.6 0 12.5C0 19.4 5.5875 25 12.4875 25C19.4 25 25 19.4 25 12.5C25 5.6 19.4 0 12.4875 0ZM12.5 22.5C6.975 22.5 2.5 18.025 2.5 12.5C2.5 6.975 6.975 2.5 12.5 2.5C18.025 2.5 22.5 6.975 22.5 12.5C22.5 18.025 18.025 22.5 12.5 22.5ZM13.125 6.25H11.25V13.75L17.8125 17.6875L18.75 16.15L13.125 12.8125V6.25Z" fill="currentColor" />
    </svg>
  );
}

function CancelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 25 25" {...props}>
      <path d="M12.5 0C5.5875 0 0 5.5875 0 12.5C0 19.4125 5.5875 25 12.5 25C19.4125 25 25 19.4125 25 12.5C25 5.5875 19.4125 0 12.5 0ZM12.5 22.5C6.9875 22.5 2.5 18.0125 2.5 12.5C2.5 6.9875 6.9875 2.5 12.5 2.5C18.0125 2.5 22.5 6.9875 22.5 12.5C22.5 18.0125 18.0125 22.5 12.5 22.5ZM16.9875 6.25L12.5 10.7375L8.0125 6.25L6.25 8.0125L10.7375 12.5L6.25 16.9875L8.0125 18.75L12.5 14.2625L16.9875 18.75L18.75 16.9875L14.2625 12.5L18.75 8.0125L16.9875 6.25Z" fill="currentColor" />
    </svg>
  );
}

function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 25 25" {...props}>
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 5.6 25 12.5 25C19.4 25 25 19.4 25 12.5C25 5.6 19.4 0 12.5 0ZM12.5 22.5C6.9875 22.5 2.5 18.0125 2.5 12.5C2.5 6.9875 6.9875 2.5 12.5 2.5C18.0125 2.5 22.5 6.9875 22.5 12.5C22.5 18.0125 18.0125 22.5 12.5 22.5ZM18.2375 6.975L10 15.2125L6.7625 11.9875L5 13.75L10 18.75L20 8.75L18.2375 6.975Z" fill="currentColor" />
    </svg>
  );
}

function ErrorOutlineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 25 25" {...props}>
      <path d="M11.25 6.25H13.75V15H11.25V6.25ZM11.25 17.5H13.75V20H11.25V17.5ZM12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 5.6 25 12.5 25C19.4 25 25 19.4 25 12.5C25 5.6 19.4 0 12.5 0ZM12.5 22.5C6.9875 22.5 2.5 18.0125 2.5 12.5C2.5 6.9875 6.9875 2.5 12.5 2.5C18.0125 2.5 22.5 6.9875 22.5 12.5C22.5 18.0125 18.0125 22.5 12.5 22.5Z" fill="currentColor" />
    </svg>
  );
}

function MetricCard({ active, icon: Icon, label, onClick, value }: MetricCardProps) {
  return (
    <button
      className={`flex h-[94px] flex-1 basis-[232px] flex-col items-start justify-center gap-[6px] rounded-[8px] bg-black/10 px-6 py-4 text-left ${
        active ? "ring-1 ring-white/35" : ""
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="flex items-center text-[14px] leading-5 font-medium text-white">
        {label}
      </span>
      <div className="flex h-[36px] w-full items-center justify-between gap-4">
        <div className="flex h-[36px] min-w-0 flex-1 flex-col items-start gap-1">
          <span className="flex w-full items-center text-[40px] leading-[36px] font-bold text-white">
            {value}
          </span>
        </div>
        <Icon className="h-[30px] w-[30px] shrink-0 text-white" />
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
    <section className="relative flex min-h-[292px] w-full flex-col justify-between overflow-hidden rounded-[16px] px-[30px] py-[50px] xl:h-[292px]">
      <video
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/contracts-hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(66,130,255,0.08),rgba(18,27,83,0.18))]" />

      <div className="relative mx-auto flex w-full max-w-[560px] flex-col items-center gap-[5px] text-center">
        <h1 className="flex w-full items-center justify-center text-[24px] leading-[31px] font-semibold text-white">
          Requests
        </h1>
        <p className="flex w-full items-center justify-center text-[14px] leading-5 font-normal text-white">
          Review employee benefit requests and configuration changes.
        </p>
      </div>

      <div className="relative flex w-full flex-wrap items-center gap-5 xl:h-[94px] xl:flex-nowrap">
        <MetricCard
          active={activeMetric === "awaitingYourApproval"}
          icon={PersonOutlineIcon}
          label="Awaiting Your Approval"
          onClick={() => onMetricSelect("awaitingYourApproval")}
          value={metrics.awaitingYourApproval}
        />
        <MetricCard
          active={activeMetric === "pendingRequests"}
          icon={AccessTimeIcon}
          label="Pending Requests"
          onClick={() => onMetricSelect("pendingRequests")}
          value={metrics.pendingRequests}
        />
        <MetricCard
          active={activeMetric === "rejectedToday"}
          icon={CancelIcon}
          label="Rejected Today"
          onClick={() => onMetricSelect("rejectedToday")}
          value={metrics.rejectedToday}
        />
        <MetricCard
          active={activeMetric === "approvedToday"}
          icon={CheckCircleIcon}
          label="Approved Today"
          onClick={() => onMetricSelect("approvedToday")}
          value={metrics.approvedToday}
        />
        <MetricCard
          active={activeMetric === "pendingOverrides"}
          icon={ErrorOutlineIcon}
          label="Pending Override"
          onClick={() => onMetricSelect("pendingOverrides")}
          value={metrics.pendingOverrides}
        />
      </div>
    </section>
  );
}
