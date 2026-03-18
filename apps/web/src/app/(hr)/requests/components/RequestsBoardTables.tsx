import {
  CheckCircle2,
  CircleX,
  Clock3,
  HandCoins,
  Settings2,
} from "lucide-react";

import type {
  ApprovalRequestRecord,
} from "./approval-requests.graphql";
import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import {
  resolveRequestPersonName,
  useRequestPeople,
} from "./RequestPeopleContext";
import {
  formatApprovalRole,
  formatApprovalRequestName,
  formatRequestChangeSummary,
} from "./approval-request-utils";
import {
  formatShortDate,
  formatShortDateTime,
} from "./approval-request-time-formatters";

type RequestTableProps = {
  currentUserIdentifier: string;
  onReview: (requestId: string) => void;
  requests: ApprovalRequestRecord[];
};

export function EmptyTableState({ message }: { message: string }) {
  return (
    <div className="rounded-[14px] border border-dashed border-[#E5E5E5] bg-white px-6 py-10 text-center text-[14px] leading-6 text-[#737373]">
      {message}
    </div>
  );
}

function StatusBadge({
  reviewedAt,
  status,
}: {
  reviewedAt?: string | null;
  status: ApprovalRequestRecord["status"] | BenefitRequestRecord["status"];
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

  if (status === "cancelled") {
    return (
      <div className="flex flex-col items-start gap-1">
        <span className="inline-flex items-center gap-[6px] rounded-[4px] border border-[#CBD5E1] bg-[#F8FAFC] px-2 py-[2px] text-[12px] leading-4 font-medium text-[#475569]">
          <CircleX className="h-3 w-3" />
          Cancelled
        </span>
        {reviewedAt ? <span className="text-[11px] leading-4 text-[#737373]">{formatShortDateTime(reviewedAt)}</span> : null}
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="flex flex-col items-start gap-1">
        <span className="inline-flex items-center gap-[6px] rounded-[4px] border border-[#FFA2A2] bg-[#FEF2F2] px-2 py-[2px] text-[12px] leading-4 font-medium text-[#C10007]">
          <CircleX className="h-3 w-3" />
          Rejected
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

function EntityBadge({ request }: { request: ApprovalRequestRecord }) {
  const Icon = request.entity_type === "benefit" ? HandCoins : Settings2;
  const label = request.entity_type === "benefit" ? "Benefit" : "Rule";

  return (
    <div className="flex items-center gap-2">
      <Icon className="h-[18px] w-[18px] text-[#737373]" />
      <span className="inline-flex rounded-[8px] border border-[#E5E5E5] px-2 py-[2px] text-[12px] leading-4 font-medium text-[#0A0A0A]">
        {label}
      </span>
    </div>
  );
}

function ReviewButton({
  isOwnRequest,
  onClick,
  status,
}: {
  isOwnRequest: boolean;
  onClick: () => void;
  status: ApprovalRequestRecord["status"];
}) {
  const label = status === "pending" && !isOwnRequest ? "Review" : "View";
  return (
    <button className="inline-flex h-8 items-center justify-center rounded-[8px] px-3 text-[14px] leading-5 font-medium text-[#0A0A0A] transition-colors hover:bg-[#F5F5F5]" onClick={onClick} type="button">
      {label}
    </button>
  );
}

export function ConfigurationApprovalsTable({
  currentUserIdentifier,
  onReview,
  requests,
}: RequestTableProps) {
  const people = useRequestPeople();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1180px] border-separate border-spacing-0 text-left">
        <thead><tr className="text-[14px] leading-5 font-medium text-[#0A0A0A]"><th className="border-b border-[#E5E5E5] px-8 py-[10px]">Type</th><th className="border-b border-[#E5E5E5] px-2 py-[10px]">Name</th><th className="border-b border-[#E5E5E5] px-2 py-[10px]">Changes</th><th className="border-b border-[#E5E5E5] px-2 py-[10px]">Created By</th><th className="border-b border-[#E5E5E5] px-2 py-[10px]">Submitted</th><th className="border-b border-[#E5E5E5] px-2 py-[10px]">Approved By</th><th className="border-b border-[#E5E5E5] px-2 py-[10px]">Status</th><th className="border-b border-[#E5E5E5] px-6 py-[10px] text-center">Action</th></tr></thead>
        <tbody>
          {requests.map((request) => {
            const isOwnRequest = request.requested_by.trim().toLowerCase() === currentUserIdentifier.trim().toLowerCase();
            const requesterName = resolveRequestPersonName(people, request.requested_by);
            const reviewerName = request.reviewed_by
              ? resolveRequestPersonName(people, request.reviewed_by)
              : formatApprovalRole(request.target_role);
            return (
              <tr key={request.id} className="text-[14px] leading-5 text-[#737373]">
                <td className="border-b border-[#EDEDED] px-8 py-3"><EntityBadge request={request} /></td>
                <td className="border-b border-[#EDEDED] px-2 py-3"><span className="font-medium text-[#0A0A0A]">{formatApprovalRequestName(request)}</span></td>
                <td className="border-b border-[#EDEDED] px-2 py-3">{formatRequestChangeSummary(request)}</td>
                <td className="border-b border-[#EDEDED] px-2 py-3">{requesterName}</td>
                <td className="border-b border-[#EDEDED] px-2 py-3">{formatShortDate(request.created_at)}</td>
                <td className="border-b border-[#EDEDED] px-2 py-3">{reviewerName}</td>
                <td className="border-b border-[#EDEDED] px-2 py-3"><StatusBadge reviewedAt={request.reviewed_at} status={request.status} /></td>
                <td className="border-b border-[#EDEDED] px-6 py-3 text-center"><ReviewButton isOwnRequest={isOwnRequest} onClick={() => onReview(request.id)} status={request.status} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
