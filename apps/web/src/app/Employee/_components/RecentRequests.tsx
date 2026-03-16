import { requestRows } from "./employee-data";

export function RecentRequests() {
  return (
    <article
      className={[
        "h-[323px] w-[830px] rounded-[14px] border border-[#EEF0F3]",
        "bg-white px-6 py-5 shadow-[0px_12px_28px_rgba(17,24,39,0.06)]",
      ].join(" ")}
    >
      <h2 className="text-sm font-semibold text-[#111827]">Recent Requests</h2>
      <p className="mt-1.5 text-[11px] text-[#6B7280]">Your benefit requests and their status</p>

      <div className="mt-6">
        <div
          className={[
            "grid grid-cols-[1.4fr_0.6fr_0.6fr_0.8fr] gap-3",
            "border-b border-[#F3F4F6] pb-2 text-[10px] font-semibold text-[#6B7280]",
          ].join(" ")}
        >
          <span>Benefit</span>
          <span>Submitted</span>
          <span>Status</span>
          <span>Reviewed By</span>
        </div>
        <div className="text-[11px] text-[#111827]">
          {requestRows.map((row, index) => (
            <div
              className={[
                "grid grid-cols-[1.4fr_0.6fr_0.6fr_0.8fr] items-center gap-3",
                "border-b border-[#F3F4F6] py-3",
              ].join(" ")}
              key={row.status}
            >
              <span>Gym - PineFit</span>
              <span className="text-[#6B7280]">Mar 10</span>
              <span
                className={[
                  "inline-flex w-fit items-center gap-1 rounded-full",
                  "px-2 py-0.5 text-[10px]",
                  row.color,
                ].join(" ")}
              >
                {row.icon === "check" && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M7.5 12.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {row.icon === "clock" && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {row.icon === "alert" && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 6l8 14H4l8-14Z" />
                    <path d="M12 10v4m0 4h.01" />
                  </svg>
                )}
                {row.status}
              </span>
              <span className="text-[#6B7280]">{index === 1 ? "-" : "Sarah Johnson"}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
