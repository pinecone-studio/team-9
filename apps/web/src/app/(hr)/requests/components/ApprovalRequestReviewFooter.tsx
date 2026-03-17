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
}: ApprovalRequestReviewFooterProps) {
  return (
    <div className="border-t border-[#E2E8F0] bg-white px-6 py-5">
      {errorMessage ? (
        <p className="mb-4 rounded-[8px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[13px] leading-5 text-[#B42318]">
          {errorMessage}
        </p>
      ) : null}
      {isPending && rejectMode ? (
        <div className="mb-4 flex flex-col gap-2">
          <label className="text-[13px] leading-5 font-medium text-[#0F172A]" htmlFor="approval-reject-comment">
            Rejection comment
          </label>
          <textarea
            className="min-h-[96px] rounded-[10px] border border-[#CBD5E1] px-3 py-2 text-[14px] leading-5 text-[#0F172A] outline-none"
            id="approval-reject-comment"
            onChange={(event) => onReviewCommentChange(event.target.value)}
            placeholder="Tell the requester what needs to be fixed before resubmitting."
            value={reviewComment}
          />
        </div>
      ) : null}
      <div className="flex items-center justify-end gap-3">
        <button
          className="rounded-[8px] border border-[#D8DFE6] bg-[#F3F5F8] px-4 py-2 text-[14px] leading-5 text-black"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
        {isPending ? (
          <>
            {rejectMode ? (
              <button
                className="flex items-center gap-2 rounded-[8px] border border-[#FCA5A5] bg-[#EF4444] px-4 py-2 text-[14px] leading-5 font-medium text-white disabled:cursor-not-allowed disabled:bg-[#FCA5A5]"
                disabled={reviewing}
                onClick={onRejectConfirm}
                type="button"
              >
                <CircleX className="h-4 w-4" />
                {reviewing ? "Rejecting..." : "Confirm Reject"}
              </button>
            ) : (
              <button
                className="flex items-center gap-2 rounded-[8px] border border-[#E0E1E4] bg-white px-4 py-2 text-[14px] leading-5 font-medium text-[#E90012]"
                onClick={onRejectClick}
                type="button"
              >
                <CircleX className="h-4 w-4" />
                Reject
              </button>
            )}
            <button
              className="flex items-center gap-2 rounded-[8px] bg-[#008E00] px-4 py-2 text-[14px] leading-5 font-medium text-white disabled:cursor-not-allowed disabled:bg-[#86EFAC] disabled:text-white/80"
              disabled={reviewing || rejectMode}
              onClick={onApprove}
              type="button"
            >
              <CheckCircle2 className="h-4 w-4" />
              {reviewing ? "Approving..." : "Approve"}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
