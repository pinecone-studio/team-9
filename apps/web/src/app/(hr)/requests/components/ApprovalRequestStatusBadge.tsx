import { Clock3 } from "lucide-react";

import { formatApprovalStatus } from "./approval-request-utils";

export default function ApprovalRequestStatusBadge({
  pendingLabel = "Pending Approval",
  status,
  variant = "soft",
}: {
  pendingLabel?: string;
  status: "approved" | "pending" | "rejected";
  variant?: "pill" | "soft";
}) {
  const palette =
    status === "approved"
      ? variant === "pill"
        ? "bg-[#DCFCE7] text-[#016630]"
        : "border border-[#BBF7D0] bg-[#DCFCE7] text-[#016630]"
      : status === "rejected"
        ? variant === "pill"
          ? "bg-[#FEF2F2] text-[#B42318]"
          : "border border-[#FECACA] bg-[#FEF2F2] text-[#B42318]"
        : variant === "pill"
          ? "bg-[#FEF3C6] text-[#973C00]"
          : "border border-[#FEE685] bg-[#FFFBEB] text-[#BB4D00]";

  return (
    <span
      className={`inline-flex w-fit items-center gap-[6px] ${variant === "soft" ? "rounded-[8px]" : "rounded-[4px]"} px-[9px] py-[3px] text-[12px] leading-4 font-medium whitespace-nowrap ${palette}`}
    >
      {variant === "pill" ? <Clock3 className="h-3 w-3" /> : null}
      {status === "pending" ? pendingLabel : formatApprovalStatus(status)}
    </span>
  );
}
