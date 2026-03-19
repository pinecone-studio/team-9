"use client";

import { useEffect, useMemo, useState } from "react";

import {
  useApprovalRequestQuery,
  useReviewApprovalRequestMutation,
} from "@/shared/apollo/generated";
import ApprovalRequestReviewDetails from "./ApprovalRequestReviewDetails";
import ApprovalRequestReviewFooter from "./ApprovalRequestReviewFooter";
import ApprovalRequestReviewHeader from "./ApprovalRequestReviewHeader";
import ApprovalRequestReviewSkeleton from "./ApprovalRequestReviewSkeleton";
import { useResolvedPersonName } from "./RequestPeopleContext";
import { updateApprovalRequestReviewCache } from "./approval-request-review-cache";
import { getApprovalRequestDialogCopy } from "./approval-request-review-dialog.copy";

const SLOW_REVIEW_HINT_DELAY_MS = 4000;

type ApprovalRequestReviewDialogProps = {
  currentUserIdentifier: string;
  onClose: () => void;
  onReviewed: () => Promise<unknown> | void;
  requestId: string;
};

export default function ApprovalRequestReviewDialog({
  currentUserIdentifier,
  onClose,
  onReviewed,
  requestId,
}: ApprovalRequestReviewDialogProps) {
  const [rejectMode, setRejectMode] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSlowReviewHint, setShowSlowReviewHint] = useState(false);
  const { data, loading, refetch } = useApprovalRequestQuery({
    variables: { id: requestId },
    fetchPolicy: "network-only",
  });
  const [reviewApprovalRequest, { loading: reviewing }] =
    useReviewApprovalRequestMutation();
  const request = data?.approvalRequest ?? null;
  const isPending = request?.status === "pending";
  const requesterName = useResolvedPersonName(request?.requested_by);
  const isOwnRequest =
    request?.requested_by.trim().toLowerCase() ===
    currentUserIdentifier.trim().toLowerCase();
  const dialogCopy = useMemo(() => getApprovalRequestDialogCopy(request), [request]);
  useEffect(() => {
    if (!reviewing) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowSlowReviewHint(true);
    }, SLOW_REVIEW_HINT_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [reviewing]);
  const fallbackMeta = request ? (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] leading-5 text-[#64748B]">
      {dialogCopy.fallbackMeta?.map((item) => (
        <span key={item}>{item}</span>
      ))}
      <span>{`Requested by: ${requesterName}`}</span>
    </div>
  ) : null;

  async function handleReview(approved: boolean) {
    if (!request) {
      return;
    }

    if (!approved && reviewComment.trim().length === 0) {
      setErrorMessage("Please add a rejection comment before rejecting.");
      return;
    }

    try {
      setErrorMessage(null);
      setShowSlowReviewHint(false);
      await reviewApprovalRequest({
        variables: {
          input: {
            approved,
            id: request.id,
            reviewComment: reviewComment.trim() || null,
            reviewedBy: currentUserIdentifier,
          },
        },
        update(cache, { data: mutationData }) {
          updateApprovalRequestReviewCache(
            cache,
            mutationData?.reviewApprovalRequest,
          );
        },
      });

      void refetch();
      void onReviewed();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Review request failed.",
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
      <div className="mx-auto flex h-full max-h-[calc(100vh-48px)] w-full max-w-[840px] flex-col overflow-hidden rounded-[8px] border border-[#CBD5E1] bg-white shadow-[0px_8px_24px_rgba(15,23,42,0.08)]">
        <ApprovalRequestReviewHeader
          fallbackMeta={fallbackMeta}
          loading={loading}
          onClose={onClose}
          subtitle={dialogCopy.subtitle}
          title={dialogCopy.title}
        />

        <div className="flex-1 overflow-y-auto bg-white px-6 pb-7 pt-7">
          {loading ? (
            <ApprovalRequestReviewSkeleton />
          ) : request ? (
            <ApprovalRequestReviewDetails request={request} />
          ) : (
            <div className="rounded-[12px] border border-[#E2E8F0] bg-white px-5 py-6 text-[14px] leading-5 text-[#B42318]">
              Approval request not found.
            </div>
          )}
        </div>
        <ApprovalRequestReviewFooter
          errorMessage={
            errorMessage ??
            (isPending && isOwnRequest
              ? "You can view your own request, but you cannot approve or reject it."
              : null)
          }
          isPending={Boolean(isPending && !isOwnRequest)}
          onApprove={() => void handleReview(true)}
          onClose={onClose}
          onRejectClick={() => {
            setRejectMode(true);
            setErrorMessage(null);
          }}
          onRejectConfirm={() => void handleReview(false)}
          onReviewCommentChange={setReviewComment}
          rejectMode={rejectMode}
          reviewComment={reviewComment}
          reviewing={reviewing}
          statusMessage={
            reviewing && showSlowReviewHint
              ? "Approval is still processing. Eligibility recalculation may still be finishing on the server."
              : null
          }
        />
      </div>
    </div>
  );
}
