import type { EmployeeRequestItem } from "./employee-types";

type RecentRequestsProps = {
  requests: EmployeeRequestItem[];
};

function getStatusStyles(status: EmployeeRequestItem["status"]) {
  if (status === "Accepted") {
    return {
      color: "bg-[#DCFCE7] text-[#16A34A]",
      icon: "check" as const,
    };
  }

  if (status === "Rejected") {
    return {
      color: "bg-[#FEE2E2] text-[#DC2626]",
      icon: "alert" as const,
    };
  }

  if (status === "Cancelled") {
    return {
      color: "bg-[#F3F4F6] text-[#6B7280]",
      icon: "slash" as const,
    };
  }

  return {
    color: "bg-[#FEF3C7] text-[#D97706]",
    icon: "clock" as const,
  };
}

export function RecentRequests({ requests }: RecentRequestsProps) {
  return (
    <article
      className={[
        "rounded-[14px] border border-[#E5E5E5] bg-white p-5",
        "shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]",
      ].join(" ")}
    >
      <h2 className="text-[16px] font-semibold leading-6 text-[#0A0A0A]">
        Recent Requests
      </h2>
      <p className="mt-1 text-[14px] leading-[18px] text-[#6B7280]">
        Your benefit requests and their status
      </p>

      <div className="mt-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className={[
            "grid min-w-[640px] grid-cols-[1.4fr_0.6fr_0.6fr_0.8fr] gap-3",
            "border-b border-[#E5E5E5] pb-3 text-[12px] font-semibold text-[#6B7280]",
          ].join(" ")}
        >
          <span>Benefit</span>
          <span>Submitted</span>
          <span>Status</span>
          <span>Reviewed By</span>
        </div>
        <div className="min-w-[640px] text-[14px] text-[#111827]">
          {requests.length === 0 ? (
            <div className="py-6 text-center text-[14px] text-[#6B7280]">
              No benefit requests found.
            </div>
          ) : (
            requests.map((row) => {
              const status = getStatusStyles(row.status);

              return (
            <div
              className={[
                "grid grid-cols-[1.4fr_0.6fr_0.6fr_0.8fr] items-center gap-3",
                "border-b border-[#F3F4F6] py-3.5",
              ].join(" ")}
              key={row.id}
            >
              <span>{row.benefit}</span>
              <span className="text-[#6B7280]">{row.submittedAt}</span>
              <span
                className={[
                  "inline-flex w-fit items-center gap-1 rounded-full",
                  "px-2 py-0.5 text-[11px]",
                  status.color,
                ].join(" ")}
              >
                {status.icon === "check" && (
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
                {status.icon === "clock" && (
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
                {status.icon === "alert" && (
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
                {status.icon === "slash" && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="m15 9-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {row.status}
              </span>
              <span className="text-[#6B7280]">{row.reviewedBy}</span>
            </div>
              );
            })
          )}
        </div>
      </div>
    </article>
  );
}
