import { CheckCircle2, CircleX, Clock3 } from "lucide-react";

import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import { formatShortDate, formatShortDateTime } from "./approval-request-time-formatters";

type BenefitRequestsTableProps = {
  currentUserIdentifier: string;
  onReview: (requestId: string) => void;
  requests: BenefitRequestRecord[];
};

function StatusBadge({
  reviewedAt,
  status,
}: {
  reviewedAt?: string | null;
  status: BenefitRequestRecord["status"];
}) {
  if (status === "approved") {
    return (
      <div className="flex flex-col items-start gap-1">
        <span className="inline-flex items-center gap-[6px] rounded-[4px] bg-[#DCFCE7] px-2 py-[2px] text-[12px] leading-4 font-medium text-[#016630]">
          <CheckCircle2 className="h-3 w-3" />
          Approved
        </span>
        {reviewedAt ? <span className="text-[11px] leading-4 text-[#737373]">{formatShortDateTime(reviewedAt)}</span> : null}
      </div>
    );
  }

  if (status === "rejected" || status === "cancelled") {
    return (
      <div className="flex flex-col items-start gap-1">
        <span className="inline-flex items-center gap-[6px] rounded-[4px] border border-[#FFA2A2] bg-[#FEF2F2] px-2 py-[2px] text-[12px] leading-4 font-medium text-[#C10007]">
          <CircleX className="h-3 w-3" />
          {status === "cancelled" ? "Cancelled" : "Rejected"}
        </span>
        {reviewedAt ? <span className="text-[11px] leading-4 text-[#737373]">{formatShortDateTime(reviewedAt)}</span> : null}
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-[6px] rounded-[4px] bg-[#FEF3C6] px-2 py-[2px] text-[12px] leading-4 font-medium text-[#973C00]">
      <Clock3 className="h-3 w-3" />
      Pending
    </span>
  );
}

function ReviewButton({
  isOwnRequest,
  onClick,
  status,
}: {
  isOwnRequest: boolean;
  onClick: () => void;
  status: BenefitRequestRecord["status"];
}) {
  const label = status === "pending" && !isOwnRequest ? "Review" : "View";
  return (
    <button className="inline-flex h-8 items-center justify-center rounded-[8px] px-3 text-[14px] leading-5 font-medium text-[#0A0A0A] transition-colors hover:bg-[#F5F5F5]" onClick={onClick} type="button">
      {label}
    </button>
  );
}

export default function BenefitRequestsTable({
  currentUserIdentifier,
  onReview,
  requests,
}: BenefitRequestsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1180px] border-separate border-spacing-0 text-left">
        <thead><tr className="text-[14px] leading-5 font-medium text-[#0A0A0A]"><th className="border-b border-[#E5E5E5] px-8 py-[10px]">Employee</th><th className="border-b border-[#E5E5E5] px-2 py-[10px]">Benefit</th><th className="border-b border-[#E5E5E5] px-2 py-[10px]">Submitted</th><th className="border-b border-[#E5E5E5] px-2 py-[10px]">Approved By</th><th className="border-b border-[#E5E5E5] px-2 py-[10px]">Progress</th><th className="border-b border-[#E5E5E5] px-2 py-[10px]">Status</th><th className="border-b border-[#E5E5E5] px-6 py-[10px] text-center">Action</th></tr></thead>
        <tbody>
          {requests.map((request) => {
            const isOwnRequest = request.employee.email.trim().toLowerCase() === currentUserIdentifier.trim().toLowerCase();
            const progressLabel =
              request.status === "approved"
                ? "Approved"
                : request.status === "rejected"
                  ? "Rejected"
                  : request.status === "cancelled"
                    ? "Cancelled"
                    : `Waiting for ${request.approval_role === "finance_manager" ? "Finance" : "HR"}`;
            return (
              <tr className={`text-[14px] leading-5 text-[#737373] ${request.status !== "pending" ? "opacity-80" : ""}`} key={request.id}>
                <td className="border-b border-[#EDEDED] px-8 py-3"><div className="flex flex-col"><span className="font-medium text-[#0A0A0A]">{request.employee.name}</span><span className="text-[12px] leading-4 text-[#737373]">{request.employee.position}</span></div></td>
                <td className="border-b border-[#EDEDED] px-2 py-3"><div className="flex flex-col"><span className="font-medium text-[#0A0A0A]">{request.benefit.title}</span><span className="text-[12px] leading-4 text-[#737373]">{request.benefit.category}</span></div></td>
                <td className="border-b border-[#EDEDED] px-2 py-3">{formatShortDate(request.created_at)}</td>
                <td className="border-b border-[#EDEDED] px-2 py-3">{request.reviewed_by ? request.reviewed_by.name : request.approval_role === "finance_manager" ? "Finance" : "HR"}</td>
                <td className={`border-b border-[#EDEDED] px-2 py-3 ${request.status === "pending" ? "text-[#E17100]" : "text-[#737373]"}`}>{progressLabel}</td>
                <td className="border-b border-[#EDEDED] px-2 py-3"><StatusBadge reviewedAt={request.updated_at} status={request.status} /></td>
                <td className="border-b border-[#EDEDED] px-6 py-3 text-center"><ReviewButton isOwnRequest={isOwnRequest} onClick={() => onReview(request.id)} status={request.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
