export function EligibilitySignals() {
  return (
    <article
      className={[
        "h-[323px] w-[450px] rounded-[14px] border border-[#EEF0F3]",
        "bg-white px-5 py-5 shadow-[0px_12px_28px_rgba(17,24,39,0.06)]",
      ].join(" ")}
    >
      <h2 className="text-sm font-semibold text-[#111827]">Your Eligibility Signals</h2>
      <p className="mt-1.5 text-[11px] text-[#6B7280]">
        Factors that affect your benefit access
      </p>
      <div className="mt-6 text-[11px] text-[#111827]">
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
          <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[10px] text-[#16A34A]">
            Active
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
          <span className="text-[10px] text-[#111827]">Level 2</span>
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
          <span
            className={[
              "inline-flex h-4 w-4 items-center justify-center rounded-full",
              "border border-[#22C55E] text-[#22C55E]",
            ].join(" ")}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12l4 4 10-10" />
            </svg>
          </span>
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
          <span className="text-[10px] text-[#111827]">1</span>
        </div>
      </div>
    </article>
  );
}
