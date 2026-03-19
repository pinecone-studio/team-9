"use client";

import { useEffect, useMemo, useState } from "react";

import {
  useReviewApprovalRequestMutation,
  useRuleApprovalRequestReviewQuery,
} from "@/shared/apollo/generated";
import { updateApprovalRequestReviewCache } from "./approval-request-review-cache";

const SLOW_REVIEW_HINT_DELAY_MS = 4000;

type ReviewDecision = "approve" | "reject" | null;

type UseRuleApprovalRequestReviewDialogParams = {
  currentUserIdentifier: string;
  currentUserRole: string;
  onClose: () => void;
  onReviewed: () => Promise<unknown> | void;
  onReviewSuccess: (message: string) => void;
  requestId: string;
};

function normalizeValue(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function useRuleApprovalRequestReviewDialog(
  params: UseRuleApprovalRequestReviewDialogParams,
) {
  const {
    currentUserIdentifier,
    currentUserRole,
    onClose,
    onReviewed,
    onReviewSuccess,
    requestId,
  } = params;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [showSlowReviewHint, setShowSlowReviewHint] = useState(false);
  const [submittingDecision, setSubmittingDecision] =
    useState<ReviewDecision>(null);
  const { data, error, loading } = useRuleApprovalRequestReviewQuery({
    fetchPolicy: "network-only",
    variables: { id: requestId },
  });
  const [reviewApprovalRequest, { loading: reviewing }] =
    useReviewApprovalRequestMutation();
  const review = data?.ruleApprovalRequestReview ?? null;
  const request = review?.request ?? null;
  const isOwnRequest =
    normalizeValue(request?.requested_by) ===
    normalizeValue(currentUserIdentifier);
  const isAssignedApprover =
    normalizeValue(request?.target_role) === normalizeValue(currentUserRole);
  const isPending = request?.status === "pending";
  const canReview = Boolean(isPending && !isOwnRequest && isAssignedApprover);
  const helperMessage = useMemo(() => {
    if (!isPending) {
      return null;
    }

    if (isOwnRequest) {
      return "You can view your own request, but you cannot approve or reject it.";
    }

    if (!isAssignedApprover) {
      return "You can view this request, but only the assigned approver can review it.";
    }

    return null;
  }, [isAssignedApprover, isOwnRequest, isPending]);
  const decisionNoteValue =
    isPending && request ? reviewComment : review?.submissionDetails.reviewComment ?? "";

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
    if (!request || !canReview) {
      return;
    }

    const trimmedComment = reviewComment.trim();
    if (!approved && review?.decisionNoteRequiredOnReject && !trimmedComment) {
      setErrorMessage("Please add a decision note before rejecting this request.");
      return;
    }

    try {
      setErrorMessage(null);
      setShowSlowReviewHint(false);
      setSubmittingDecision(approved ? "approve" : "reject");
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
      onReviewSuccess(
        approved
          ? "Configuration change accepted."
          : "Configuration change rejected.",
      );
      onClose();
    } catch (mutationError) {
      setSubmittingDecision(null);
      setErrorMessage(
        mutationError instanceof Error
          ? mutationError.message
          : "Configuration change review failed.",
      );
    }
  }

  return {
    canReview,
    decisionNoteValue,
    error,
    errorMessage,
    handleApprove: () => void handleReview(true),
    handleReject: () => void handleReview(false),
    helperMessage,
    isPending: Boolean(isPending),
    loading,
    request,
    review,
    reviewing,
    setReviewComment,
    statusMessage:
      reviewing && showSlowReviewHint
        ? "Approval is still processing. Eligibility recalculation may still be finishing on the server."
        : null,
    submittingDecision,
  };
}
