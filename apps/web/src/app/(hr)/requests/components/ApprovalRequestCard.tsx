import { CheckCircle2, CircleX, Eye, Hourglass } from "lucide-react";

import type { ApprovalRequestRecord } from "./approval-requests.graphql";
import {
  formatApprovalAction,
  formatApprovalRequestName,
  formatApprovalRole,
  formatApprovalStatus,
  formatRelativeTimestamp,
} from "./approval-request-utils";

type ApprovalRequestCardProps = {
  onReview: (requestId: string) => void;
  request: ApprovalRequestRecord;
};

function StatusBadge({ status }: { status: ApprovalRequestRecord["status"] }) {
  if (status === "approved") {
    return (
      <div className="flex items-center gap-2 rounded-[8px] bg-[#008E00] px-3 py-1.5 text-white">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-[12px] leading-[15px] font-medium">Approved</span>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="flex items-center gap-2 rounded-[8px] bg-[#E90012] px-3 py-1.5 text-white">
        <CircleX className="h-4 w-4" />
        <span className="text-[12px] leading-[15px] font-medium">Rejected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-[8px] bg-[#171717] px-3 py-1.5 text-white">
      <Hourglass className="h-4 w-4" />
      <span className="text-[12px] leading-[15px] font-medium">Pending</span>
    </div>
  );
}

export default function ApprovalRequestCard({
  onReview,
  request,
}: ApprovalRequestCardProps) {
  const reviewLabel = request.status === "pending" ? "Review" : "View";

  return (
    <section className="mx-auto flex w-full max-w-[1300px] items-center justify-between rounded-[10px] border border-[#E5E7EB] bg-white px-6 py-5">
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-[16px] leading-6 font-semibold text-[#060B10]">
            {formatApprovalRequestName(request)}
          </h3>
          <StatusBadge status={request.status} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] leading-5 text-[#51565B]">
          <span>
            {request.entity_type === "benefit" ? "Benefit" : "Rule"}{" "}
            {formatApprovalAction(request.action_type)}
          </span>
          <span>Requester: {request.requested_by}</span>
          <span>Approver: {formatApprovalRole(request.target_role)}</span>
          <span>Created {formatRelativeTimestamp(request.created_at)}</span>
        </div>

        {request.review_comment ? (
          <p className="max-w-[820px] text-[13px] leading-5 text-[#737373]">
            {formatApprovalStatus(request.status)} comment: {request.review_comment}
          </p>
        ) : null}
      </div>

      <button
        className="ml-4 flex shrink-0 items-center gap-2 rounded-[8px] border border-[#D8DFE6] bg-[#F8FAFC] px-3 py-2 text-[13px] leading-4 font-medium text-[#111827]"
        onClick={() => onReview(request.id)}
        type="button"
      >
        <Eye className="h-4 w-4" />
        {reviewLabel}
      </button>
    </section>
  );
}
