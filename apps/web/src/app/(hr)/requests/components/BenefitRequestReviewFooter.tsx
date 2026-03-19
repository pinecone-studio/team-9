type BenefitRequestReviewFooterProps = {
  canReview: boolean;
  errorMessage: string | null;
  loading: boolean;
  onApprove: () => void;
  onRejectConfirm: () => void;
};

export default function BenefitRequestReviewFooter({
  canReview,
  errorMessage,
  loading,
  onApprove,
  onRejectConfirm,
}: BenefitRequestReviewFooterProps) {
  if (!canReview) {
    return errorMessage ? <p className="px-6 text-sm text-[#B42318]">{errorMessage}</p> : null;
  }

  return (
    <>
      {errorMessage ? <p className="px-6 text-sm text-[#B42318]">{errorMessage}</p> : null}
      <div className="flex w-full items-center gap-5 px-6 pb-6 pt-0">
        <button
          className="flex h-[38px] flex-1 items-center justify-center rounded-[4px] bg-[#FF4747] px-4 text-[12px] leading-4 font-medium text-white"
          disabled={loading}
          onClick={onRejectConfirm}
          type="button"
        >
          {loading ? "Saving..." : "Reject"}
        </button>
        <button
          className="flex h-[38px] flex-1 items-center justify-center rounded-[4px] bg-black px-4 text-[12px] leading-4 font-medium text-white"
          disabled={loading}
          onClick={onApprove}
          type="button"
        >
          {loading ? "Saving..." : "Accept"}
        </button>
      </div>
    </>
  );
}
