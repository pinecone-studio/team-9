type BenefitRequestReviewFooterProps = {
  canReview: boolean;
  errorMessage: string | null;
  helperMessage: string | null;
  isPending: boolean;
  loading: boolean;
  onApprove: () => void;
  onClose: () => void;
  onRejectClick: () => void;
  onRejectConfirm: () => void;
  onReviewCommentChange: (value: string) => void;
  rejectMode: boolean;
  reviewComment: string;
};

export default function BenefitRequestReviewFooter({
  canReview,
  errorMessage,
  helperMessage,
  isPending,
  loading,
  onApprove,
  onClose,
  onRejectClick,
  onRejectConfirm,
  onReviewCommentChange,
  rejectMode,
  reviewComment,
}: BenefitRequestReviewFooterProps) {
  const message = errorMessage ?? helperMessage;

  return isPending ? (
    <>
      {message ? <p className="px-6 text-sm text-[#B42318]">{message}</p> : null}
      {canReview && rejectMode ? (
        <div className="px-6 pt-4">
          <label
            className="text-[13px] leading-5 font-medium text-[#0F172A]"
            htmlFor="benefit-request-review-comment"
          >
            Rejection comment
          </label>
          <textarea
            className="mt-2 min-h-[96px] w-full rounded-[10px] border border-[#CBD5E1] px-3 py-2 text-[14px] leading-5 text-[#0F172A] outline-none"
            id="benefit-request-review-comment"
            onChange={(event) => onReviewCommentChange(event.target.value)}
            placeholder="Tell the employee what needs to be fixed before resubmitting."
            value={reviewComment}
          />
        </div>
      ) : null}
      <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-6 py-4">
        <button
          className="rounded-[8px] border border-[#D8DFE6] bg-[#F8FAFC] px-4 py-2 text-[14px] leading-5 text-[#111827]"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
        {canReview ? (
          <>
            <button
              className="rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-2 text-[14px] leading-5 text-[#B42318]"
              disabled={loading}
              onClick={rejectMode ? onRejectConfirm : onRejectClick}
              type="button"
            >
              {loading ? "Saving..." : rejectMode ? "Confirm Reject" : "Reject"}
            </button>
            <button
              className="rounded-[8px] bg-[#111827] px-4 py-2 text-[14px] leading-5 text-white"
              disabled={loading || rejectMode}
              onClick={onApprove}
              type="button"
            >
              {loading ? "Saving..." : "Approve"}
            </button>
          </>
        ) : null}
      </div>
    </>
  ) : null;
}
