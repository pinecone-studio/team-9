type BenefitRequestReviewFooterProps = {
  canReview: boolean;
  errorMessage: string | null;
  helperMessage: string | null;
  isPending: boolean;
  loading: boolean;
  onApprove: () => void;
  onClose: () => void;
  onReject: () => void;
};

export default function BenefitRequestReviewFooter({
  canReview,
  errorMessage,
  helperMessage,
  isPending,
  loading,
  onApprove,
  onClose,
  onReject,
}: BenefitRequestReviewFooterProps) {
  const message = errorMessage ?? helperMessage;

  return isPending ? (
    <>
      {message ? <p className="px-6 text-sm text-[#B42318]">{message}</p> : null}
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
              onClick={onReject}
              type="button"
            >
              Reject
            </button>
            <button
              className="rounded-[8px] bg-[#111827] px-4 py-2 text-[14px] leading-5 text-white"
              disabled={loading}
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
