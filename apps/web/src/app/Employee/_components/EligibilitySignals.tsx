import type { EmployeeEligibilitySignals } from "./employee-types";

type EligibilitySignalsProps = {
  signals: EmployeeEligibilitySignals;
};

function getEmploymentStatusTone(status: string) {
  const normalized = status.trim().toLowerCase();

  if (normalized === "active") {
    return "bg-[#DCFCE7] text-[#16A34A]";
  }

  if (normalized === "probation") {
    return "bg-[#FEF3C7] text-[#D97706]";
  }

  return "bg-[#F3F4F6] text-[#6B7280]";
}

export function EligibilitySignals({ signals }: EligibilitySignalsProps) {
  return (
    <article
      className={[
        "rounded-[14px] border border-[#E5E5E5] bg-white p-5",
        "shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]",
      ].join(" ")}
    >
      <h2 className="text-[16px] font-semibold leading-6 text-[#0A0A0A]">
        Your Eligibility Signals
      </h2>
      <p className="mt-1 text-[14px] leading-[18px] text-[#6B7280]">
        Factors that affect your benefit access
      </p>
      <div className="mt-5 text-[14px] text-[#111827]">
        <div className="flex items-center justify-between border-b border-[#F3F4F6] py-3">
          <div className="flex items-center gap-2 text-[#6B7280]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#6B7280]">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="5" y="9" width="14" height="10" rx="2" />
                <path d="M8 9V7a4 4 0 0 1 8 0v2" />
              </svg>
            </span>
            <span>Employment Status</span>
          </div>
          <span
            className={[
              "rounded-full px-2 py-0.5 text-[11px]",
              getEmploymentStatusTone(signals.employmentStatus),
            ].join(" ")}
          >
            {signals.employmentStatus || "Unknown"}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-[#F3F4F6] py-3">
          <div className="flex items-center gap-2 text-[#6B7280]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#6B7280]">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M7 5h10M7 12h10M7 19h10" />
              </svg>
            </span>
            <span>Responsibility Level</span>
          </div>
          <span className="text-[12px] text-[#111827]">
            {typeof signals.responsibilityLevel === "number"
              ? `Level ${signals.responsibilityLevel}`
              : "-"}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-[#F3F4F6] py-3">
          <div className="flex items-center gap-2 text-[#6B7280]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#6B7280]">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <circle cx="12" cy="12" r="8" />
                <path d="M12 8v4m0 4h.01" />
              </svg>
            </span>
            <span>OKR Submitted</span>
          </div>
          {signals.okrSubmitted === null ? (
            <span className="text-[12px] text-[#111827]">-</span>
          ) : (
            <span
              className={[
                "inline-flex h-4 w-4 items-center justify-center rounded-full",
                signals.okrSubmitted
                  ? "border border-[#22C55E] text-[#22C55E]"
                  : "border border-[#EF4444] text-[#EF4444]",
              ].join(" ")}
            >
              {signals.okrSubmitted ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12l4 4 10-10" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6l12 12M18 6l-12 12" />
                </svg>
              )}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2 text-[#6B7280]">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-[6px] border border-[#E5E7EB] bg-white text-[#6B7280]">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="5" y="6" width="14" height="13" rx="2" />
                <path d="M8 3v3m8-3v3M5 10h14" />
              </svg>
            </span>
            <span>Late Arrivals (30 days)</span>
          </div>
          <span className="text-[12px] text-[#111827]">
            {typeof signals.lateArrivals30Days === "number"
              ? signals.lateArrivals30Days
              : "-"}
          </span>
        </div>
      </div>
    </article>
  );
}
