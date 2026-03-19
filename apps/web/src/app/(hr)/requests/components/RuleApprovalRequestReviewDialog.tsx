"use client";

import { X } from "lucide-react";

import RuleApprovalRequestReviewBody from "./RuleApprovalRequestReviewBody";
import RuleApprovalRequestReviewFooter from "./RuleApprovalRequestReviewFooter";
import RuleApprovalRequestReviewSkeleton from "./RuleApprovalRequestReviewSkeleton";
import { useRuleApprovalRequestReviewDialog } from "./useRuleApprovalRequestReviewDialog";

type RuleApprovalRequestReviewDialogProps = {
  currentUserIdentifier: string;
  currentUserRole: string;
  onClose: () => void;
  onReviewed: () => Promise<unknown> | void;
  onReviewSuccess: (message: string) => void;
  requestId: string;
};

export default function RuleApprovalRequestReviewDialog({
  currentUserIdentifier,
  currentUserRole,
  onClose,
  onReviewed,
  onReviewSuccess,
  requestId,
}: RuleApprovalRequestReviewDialogProps) {
  const {
    canReview,
    decisionNoteValue,
    error,
    errorMessage,
    handleApprove,
    handleReject,
    helperMessage,
    isPending,
    loading,
    review,
    reviewing,
    setReviewComment,
    statusMessage,
    submittingDecision,
  } = useRuleApprovalRequestReviewDialog({
    currentUserIdentifier,
    currentUserRole,
    onClose,
    onReviewed,
    onReviewSuccess,
    requestId,
  });

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="mx-auto flex max-h-[calc(100vh-48px)] w-full max-w-[626px] flex-col overflow-hidden rounded-[14px] border border-[#CBD5E1] bg-white shadow-[0_24px_48px_rgba(15,23,42,0.18)]">
        <div className="flex items-start justify-between gap-4 px-9 pt-8">
          <div className="flex min-w-0 flex-col gap-2">
            <h2 className="text-[18px] leading-7 font-semibold text-[#0F172A]">
              {review?.title ?? "Review Configuration Change"}
            </h2>
            <p className="text-[14px] leading-5 text-[#64748B]">
              {review?.subtitle ?? "Approve or reject this eligibility rule change."}
            </p>
          </div>
          <button
            className="rounded-[8px] p-2 text-black"
            onClick={onClose}
            type="button"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-9 pt-6 pb-8">
          {loading ? (
            <RuleApprovalRequestReviewSkeleton />
          ) : error ? (
            <div className="rounded-[12px] border border-[#E2E8F0] bg-white px-5 py-6 text-[14px] leading-5 text-[#B42318]">
              {error.message}
            </div>
          ) : review ? (
            <RuleApprovalRequestReviewBody review={review} />
          ) : (
            <div className="rounded-[12px] border border-[#E2E8F0] bg-white px-5 py-6 text-[14px] leading-5 text-[#B42318]">
              Configuration change request not found.
            </div>
          )}
        </div>

        {review ? (
          <div className="border-t border-[#E5E7EB] px-9 pt-6 pb-8">
            <RuleApprovalRequestReviewFooter
              canReview={canReview}
              decisionNoteRequiredOnReject={review.decisionNoteRequiredOnReject}
              errorMessage={errorMessage}
              helperMessage={helperMessage}
              isPending={isPending}
              onApprove={handleApprove}
              onDecisionNotesChange={setReviewComment}
              onReject={handleReject}
              reviewComment={decisionNoteValue}
              reviewing={reviewing}
              statusMessage={statusMessage}
              submittingDecision={submittingDecision}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
