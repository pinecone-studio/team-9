import { CheckCircle2, CircleX } from "lucide-react";

type ApprovalRequestReviewFooterProps = {
  errorMessage: string | null;
  isPending: boolean;
  onApprove: () => void;
  onClose: () => void;
  onRejectClick: () => void;
  onRejectConfirm: () => void;
  onReviewCommentChange: (value: string) => void;
  rejectMode: boolean;
  reviewComment: string;
  reviewing: boolean;
  statusMessage: string | null;
};

export default function ApprovalRequestReviewFooter({
  errorMessage,
  isPending,
  onApprove,
  onClose,
  onRejectClick,
  onRejectConfirm,
  onReviewCommentChange,
  rejectMode,
  reviewComment,
  reviewing,
  statusMessage,
}: ApprovalRequestReviewFooterProps) {
  return (
    <div className="bg-white px-6 pb-6 pt-0 font-[family-name:var(--font-geist-sans)]">
      {errorMessage ? (
        <p className="mb-4 rounded-[8px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[13px] leading-5 text-[#B42318]">
          {errorMessage}
        </p>
      ) : null}
      {statusMessage ? (
        <p className="mb-4 rounded-[8px] border border-[#CFE3FB] bg-[#F5F9FF] px-3 py-2 text-[13px] leading-5 text-[#175CD3]">
          {statusMessage}
        </p>
      ) : null}
      {isPending ? (
        <div className="mb-7 flex flex-col gap-2">
          <label
            className="text-[14px] leading-5 font-medium text-[#0A0A0A]"
            htmlFor="approval-reject-comment"
          >
            Decision Notes
          </label>
          <textarea
            className="min-h-[64px] rounded-[8px] border border-[#E5E5E5] bg-transparent px-3 py-2 text-[14px] leading-5 text-[#111827] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] outline-none transition placeholder:text-[#737373] focus:border-[#D4D4D8]"
            id="approval-reject-comment"
            onChange={(event) => onReviewCommentChange(event.target.value)}
            placeholder="Add notes for this decision..."
            value={reviewComment}
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <button
          className="flex h-[38px] w-full items-center justify-center gap-[10px] rounded-[6px] border border-[#FFC4C4] bg-[#EF4444] px-[10px] py-[10px] text-[14px] leading-4 font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
          disabled={reviewing || !isPending}
          onClick={rejectMode ? onRejectConfirm : onRejectClick}
          type="button"
        >
          <span className="inline-flex items-center gap-[10px]">
            <CircleX className="h-[18px] w-[18px]" strokeWidth={1.9} />
            {reviewing && rejectMode ? "Rejecting..." : "Reject"}
          </span>
        </button>
        {isPending ? (
          <button
            className="flex h-[38px] w-full items-center justify-center gap-[10px] rounded-[6px] bg-black px-[10px] py-[10px] text-[14px] leading-4 font-normal text-white disabled:cursor-not-allowed disabled:opacity-70"
            disabled={reviewing || rejectMode}
            onClick={onApprove}
            type="button"
          >
            <span className="inline-flex items-center gap-[10px]">
              <CheckCircle2 className="h-[18px] w-[18px]" strokeWidth={1.9} />
              {reviewing ? "Accepting..." : "Accept"}
            </span>
          </button>
        ) : (
          <button
            className="flex h-[36px] w-full items-center justify-center rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] px-[10px] py-[10px] text-[14px] leading-4 text-black disabled:cursor-not-allowed disabled:opacity-70"
            disabled={reviewing}
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
