import { CheckCircle2, CircleX } from "lucide-react";

type RuleApprovalRequestReviewFooterProps = {
  canReview: boolean;
  decisionNoteRequiredOnReject: boolean;
  errorMessage: string | null;
  helperMessage: string | null;
  isPending: boolean;
  onApprove: () => void;
  onDecisionNotesChange: (value: string) => void;
  onReject: () => void;
  reviewComment: string;
  reviewing: boolean;
  statusMessage: string | null;
  submittingDecision: "approve" | "reject" | null;
};

export default function RuleApprovalRequestReviewFooter({
  canReview,
  decisionNoteRequiredOnReject,
  errorMessage,
  helperMessage,
  isPending,
  onApprove,
  onDecisionNotesChange,
  onReject,
  reviewComment,
  reviewing,
  statusMessage,
  submittingDecision,
}: RuleApprovalRequestReviewFooterProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
          Decision Notes
        </h3>
        <textarea
          className="min-h-16 rounded-[8px] border border-[#E5E5E5] px-3 py-2 text-[14px] leading-5 text-[#0A0A0A] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373] disabled:bg-[#FAFAFA]"
          disabled={!isPending || !canReview || reviewing}
          onChange={(event) => onDecisionNotesChange(event.target.value)}
          placeholder={
            decisionNoteRequiredOnReject
              ? "Add notes for this decision..."
              : "Add optional notes for this decision..."
          }
          value={reviewComment}
        />
      </div>

      {helperMessage ? (
        <p className="rounded-[8px] border border-[#D5D9E0] bg-[#F8FAFC] px-3 py-2 text-[13px] leading-5 text-[#475467]">
          {helperMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="rounded-[8px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[13px] leading-5 text-[#B42318]">
          {errorMessage}
        </p>
      ) : null}
      {statusMessage ? (
        <p className="rounded-[8px] border border-[#CFE3FB] bg-[#F5F9FF] px-3 py-2 text-[13px] leading-5 text-[#175CD3]">
          {statusMessage}
        </p>
      ) : null}

      {isPending ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="flex h-[38px] flex-1 items-center justify-center gap-[10px] rounded-[6px] border border-[#FFC4C4] bg-[#EF4444] px-[10px] text-[14px] leading-4 font-medium text-white disabled:cursor-not-allowed disabled:bg-[#FCA5A5]"
            disabled={!canReview || reviewing}
            onClick={onReject}
            type="button"
          >
            <CircleX className="h-[18px] w-[18px]" />
            {submittingDecision === "reject" ? "Rejecting..." : "Reject"}
          </button>
          <button
            className="flex h-[38px] flex-1 items-center justify-center gap-[10px] rounded-[6px] bg-black px-[10px] text-[14px] leading-4 font-normal text-white disabled:cursor-not-allowed disabled:bg-black/70"
            disabled={!canReview || reviewing}
            onClick={onApprove}
            type="button"
          >
            <CheckCircle2 className="h-[18px] w-[18px]" />
            {submittingDecision === "approve" ? "Accepting..." : "Accept"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
