export type RequestsMetricKey =
  | "approvedToday"
  | "awaitingYourApproval"
  | "pendingOverrides"
  | "pendingRequests"
  | "rejectedToday";

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
    <button
      className="relative block h-[208px] w-full overflow-hidden rounded-[28px] text-left"
      onClick={() => onMetricSelect("pendingOverrides")}
      type="button"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#57B6F4_0%,#4A87EA_44%,#304FB8_76%,#2742A4_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_9%_86%,rgba(255,255,255,0.34),transparent_29%),radial-gradient(circle_at_24%_22%,rgba(255,255,255,0.11),transparent_31%),linear-gradient(119deg,transparent_16%,rgba(255,255,255,0.17)_29%,transparent_41%),linear-gradient(119deg,transparent_47%,rgba(255,255,255,0.1)_59%,transparent_71%)]" />
      <div className="absolute left-[37px] top-[18px] h-[156px] w-[calc(100%-74px)] rounded-[16px] bg-[rgba(34,49,120,0.25)] shadow-[0_4px_17px_rgba(0,0,0,0.06),0_17px_22px_rgba(0,0,0,0.04),0_37px_27px_rgba(0,0,0,0.01)] backdrop-blur-[4px]" />

      <div className="relative flex h-full items-start justify-between px-[72px] pt-[43px]">
        <div className="flex flex-col items-start">
          <span className="text-[16px] leading-6 font-medium text-white">
            Pending Override
          </span>
          <span className="mt-[2px] text-[58px] leading-[62px] font-semibold tracking-[-0.03em] text-white">
            {metrics.pendingOverrides}
          </span>
        </div>

        <div
          className={`mt-[30px] flex h-[42px] w-[42px] items-center justify-center rounded-full border-[2.5px] text-white ${
            activeMetric === "pendingOverrides"
              ? "border-white bg-white/10"
              : "border-white/90 bg-transparent"
          }`}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 7.25V13.25"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2.5"
            />
            <circle cx="12" cy="17.1" fill="currentColor" r="1.35" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        </div>
      </div>
    </button>
  );
}
