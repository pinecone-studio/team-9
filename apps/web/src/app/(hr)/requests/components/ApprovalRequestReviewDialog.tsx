"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { X } from "lucide-react";
import { useMemo, useState } from "react";

import ApprovalRequestReviewDetails from "./ApprovalRequestReviewDetails";
import ApprovalRequestReviewFooter from "./ApprovalRequestReviewFooter";
import {
  APPROVAL_REQUEST_QUERY,
  REVIEW_APPROVAL_REQUEST_MUTATION,
  type ApprovalRequestQuery,
  type ApprovalRequestQueryVariables,
  type ReviewApprovalRequestMutation,
  type ReviewApprovalRequestVariables,
} from "./approval-requests.graphql";
import {
  formatApprovalRequestAction,
  formatApprovalRequestName,
  formatApprovalRole,
  formatApprovalStatus,
} from "./approval-request-utils";

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
  const { data, loading, refetch } = useQuery<
    ApprovalRequestQuery,
    ApprovalRequestQueryVariables
  >(APPROVAL_REQUEST_QUERY, {
    variables: { id: requestId },
    fetchPolicy: "network-only",
  });
  const [reviewApprovalRequest, { loading: reviewing }] = useMutation<
    ReviewApprovalRequestMutation,
    ReviewApprovalRequestVariables
  >(REVIEW_APPROVAL_REQUEST_MUTATION);
  const request = data?.approvalRequest ?? null;
  const isPending = request?.status === "pending";
  const isOwnRequest =
    request?.requested_by.trim().toLowerCase() ===
    currentUserIdentifier.trim().toLowerCase();
  const dialogTitle = useMemo(() => {
    if (!request) {
      return "Review Request";
    }

    return `${formatApprovalRequestAction(request)} ${
      request.entity_type === "benefit" ? "Benefit" : "Rule"
    }`;
  }, [request]);

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
      await reviewApprovalRequest({
        variables: {
          input: {
            approved,
            id: request.id,
            reviewComment: approved ? null : reviewComment.trim(),
            reviewedBy: currentUserIdentifier,
          },
        },
      });
      await refetch();
      await onReviewed();
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
      <div className="mx-auto flex h-full max-h-[calc(100vh-48px)] w-full max-w-[860px] flex-col overflow-hidden rounded-[12px] border border-[#CBD5E1] bg-white">
        <div className="flex items-start justify-between border-b border-[#E2E8F0] px-6 py-5">
          <div className="flex min-w-0 flex-col gap-2">
            <h2 className="text-[20px] leading-7 font-semibold text-[#0F172A]">
              {dialogTitle}
            </h2>
            {request ? (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] leading-5 text-[#64748B]">
                <span>{formatApprovalRequestName(request)}</span>
                <span>Target role: {formatApprovalRole(request.target_role)}</span>
                <span>Status: {formatApprovalStatus(request.status)}</span>
                <span>Requested by: {request.requested_by}</span>
              </div>
            ) : null}
          </div>
          <button className="rounded-[8px] p-2 text-[#475569]" onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] px-6 py-6">
          {loading ? (
            <div className="rounded-[12px] border border-[#E2E8F0] bg-white px-5 py-6 text-[14px] leading-5 text-[#64748B]">
              Loading request details...
            </div>
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
        />
      </div>
    </div>
  );
}
