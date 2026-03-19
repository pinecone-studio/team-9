"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import {
  useReviewApprovalRequestMutation,
  useRuleApprovalRequestReviewQuery,
} from "@/shared/apollo/generated";
import ApprovalRequestReviewSkeleton from "./ApprovalRequestReviewSkeleton";
import RuleApprovalRequestReviewBody from "./RuleApprovalRequestReviewBody";
import RuleApprovalRequestReviewFooter from "./RuleApprovalRequestReviewFooter";
import { updateApprovalRequestReviewCache } from "./approval-request-review-cache";

const SLOW_REVIEW_HINT_DELAY_MS = 4000;

type RuleApprovalRequestReviewDialogProps = {
  currentUserIdentifier: string;
  onClose: () => void;
  onReviewed: () => Promise<unknown> | void;
  onReviewSuccess: (message: string) => void;
  requestId: string;
};

export default function RuleApprovalRequestReviewDialog({
  currentUserIdentifier,
  onClose,
  onReviewed,
  onReviewSuccess,
  requestId,
}: RuleApprovalRequestReviewDialogProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [showSlowReviewHint, setShowSlowReviewHint] = useState(false);
  const { data, error, loading } = useRuleApprovalRequestReviewQuery({
    fetchPolicy: "network-only",
    variables: { id: requestId },
  });
  const [reviewApprovalRequest, { loading: reviewing }] =
    useReviewApprovalRequestMutation();
  const review = data?.ruleApprovalRequestReview ?? null;
  const request = review?.request ?? null;
  const isOwnRequest =
    request?.requested_by.trim().toLowerCase() ===
    currentUserIdentifier.trim().toLowerCase();
  const isPending = request?.status === "pending" && !isOwnRequest;
  const decisionNoteValue =
    request?.status === "pending"
      ? reviewComment
      : review?.submissionDetails.reviewComment ?? "";

  useEffect(() => {
    if (!reviewing) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowSlowReviewHint(true);
    }, SLOW_REVIEW_HINT_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [reviewing]);

  async function handleReview(approved: boolean) {
    if (!request) {
      return;
    }

    const trimmedComment = reviewComment.trim();
    if (!approved && review?.decisionNoteRequiredOnReject && !trimmedComment) {
      setErrorMessage("Please add a decision note before rejecting this request.");
      return;
    }

    try {
      setErrorMessage(null);
      await reviewApprovalRequest({
        update(cache, { data: mutationData }) {
          updateApprovalRequestReviewCache(
            cache,
            mutationData?.reviewApprovalRequest,
          );
        },
        variables: {
          input: {
            approved,
            id: request.id,
            reviewComment: trimmedComment || null,
            reviewedBy: currentUserIdentifier,
          },
        },
      });
      await onReviewed();
      onReviewSuccess(approved ? "Rule request accepted." : "Rule request rejected.");
      onClose();
    } catch (mutationError) {
      setErrorMessage(
        mutationError instanceof Error
          ? mutationError.message
          : "Rule review failed.",
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="mx-auto flex w-full max-w-[626px] flex-col rounded-[12px] border border-[#CBD5E1] bg-white px-6 py-5 shadow-[0_20px_45px_rgba(0,0,0,0.2)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            {loading ? (
              <>
                <div className="h-7 w-48 animate-pulse rounded-md bg-slate-200/80" />
                <div className="h-5 w-72 animate-pulse rounded-md bg-slate-200/70" />
              </>
            ) : (
              <>
                <h2 className="text-[18px] leading-7 font-semibold text-[#0F172A]">
                  {review?.title ?? "Review Rule"}
                </h2>
                <p className="text-[14px] leading-5 text-[#64748B]">
                  {review?.subtitle ?? "Review the rule details and approve or reject it."}
                </p>
              </>
            )}
          </div>
          <button className="rounded-[8px] p-2 text-black" onClick={onClose} type="button">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-6">
          {loading ? (
            <ApprovalRequestReviewSkeleton />
          ) : error ? (
            <div className="rounded-[12px] border border-[#E2E8F0] bg-white px-5 py-6 text-[14px] leading-5 text-[#B42318]">
              {error.message}
            </div>
          ) : review ? (
            <>
              <RuleApprovalRequestReviewBody review={review} />
              <RuleApprovalRequestReviewFooter
                decisionNoteRequiredOnReject={review.decisionNoteRequiredOnReject}
                errorMessage={
                  errorMessage ??
                  (request?.status === "pending" && isOwnRequest
                    ? "You can review this request, but you cannot approve or reject your own submission."
                    : null)
                }
                isPending={Boolean(isPending)}
                onApprove={() => void handleReview(true)}
                onDecisionNotesChange={setReviewComment}
                onReject={() => void handleReview(false)}
                reviewComment={decisionNoteValue}
                reviewing={reviewing}
                statusMessage={
                  reviewing && showSlowReviewHint
                    ? "Approval is still processing. Eligibility recalculation may still be finishing on the server."
                    : null
                }
              />
            </>
          ) : (
            <div className="rounded-[12px] border border-[#E2E8F0] bg-white px-5 py-6 text-[14px] leading-5 text-[#B42318]">
              Rule approval request not found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
