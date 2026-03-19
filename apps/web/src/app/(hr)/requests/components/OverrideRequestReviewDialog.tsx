"use client";

import { CheckCircle2, CircleX, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  useApprovalRequestQuery,
  useEmployeeDirectoryDialogQuery,
  useReviewApprovalRequestMutation,
} from "@/shared/apollo/generated";
import { useRequestPeople } from "./RequestPeopleContext";
import { updateApprovalRequestReviewCache } from "./approval-request-review-cache";
import { OverrideRequestReviewContent } from "./override-request-review.sections";
import { buildOverrideReviewViewModel } from "./override-request-review.utils";
import { parseApprovalPayload } from "./approval-request-utils";
import { resolveRequestPerson } from "./RequestPeopleContext";

type OverrideRequestReviewDialogProps = {
  currentUserIdentifier: string;
  currentUserRole: string;
  onClose: () => void;
  onReviewed: () => Promise<unknown> | void;
  requestId: string;
};

export default function OverrideRequestReviewDialog({
  currentUserIdentifier,
  currentUserRole,
  onClose,
  onReviewed,
  requestId,
}: OverrideRequestReviewDialogProps) {
  const [reviewComment, setReviewComment] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data, loading } = useApprovalRequestQuery({ variables: { id: requestId }, fetchPolicy: "network-only" });
  const [reviewApprovalRequest, { loading: reviewing }] = useReviewApprovalRequestMutation();
  const people = useRequestPeople();
  const request = data?.approvalRequest ?? null;
  const payload = request ? parseApprovalPayload(request) : null;
  const employeeId = payload?.entityType === "benefit" ? payload.employeeRequest?.employeeId : null;
  const { data: employeeData } = useEmployeeDirectoryDialogQuery({
    fetchPolicy: "cache-and-network",
    skip: !employeeId,
    variables: { employeeId: employeeId ?? "" },
  });
  const requester = request ? resolveRequestPerson(people, request.requested_by) : null;
  const reviewer = request?.reviewed_by ? resolveRequestPerson(people, request.reviewed_by) : null;
  const currentUser = resolveRequestPerson(people, currentUserIdentifier);
  const isOwnRequest = request?.requested_by.trim().toLowerCase() === currentUserIdentifier.trim().toLowerCase();
  const canReview = request?.status === "pending" && !isOwnRequest;
  const viewModel = useMemo(() => request ? buildOverrideReviewViewModel({
    currentUserName: currentUser?.name ?? "You",
    currentUserRole,
    employeeData: employeeData ?? null,
    request,
    requester,
    reviewer,
  }) : null, [currentUser?.name, currentUserRole, employeeData, request, requester, reviewer]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  async function handleReview(approved: boolean) {
    if (!request) return;
    if (!approved && reviewComment.trim().length === 0) {
      setErrorMessage("Please add a reason before rejecting this override request.");
      return;
    }

    try {
      setErrorMessage(null);
      await reviewApprovalRequest({
        variables: { input: { approved, id: request.id, reviewComment: reviewComment.trim() || null, reviewedBy: currentUserIdentifier } },
        update(cache, { data: mutationData }) {
          updateApprovalRequestReviewCache(cache, mutationData?.reviewApprovalRequest);
        },
      });
      void onReviewed();
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Review request failed.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 px-4 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="mx-auto flex min-h-full items-center justify-center">
        <div className="relative flex h-[670px] w-full max-w-[500px] flex-col overflow-hidden rounded-[8px] border border-[#CBD5E1] bg-white">
          <button
            className="absolute top-3 right-3 z-10 rounded-[8px] p-2 text-black"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="shrink-0 px-6 pt-6">
            <div className="flex flex-col gap-2">
              <h2 className="pr-8 text-[18px] leading-7 font-semibold text-[#0F172A]">
                Review Override Request
              </h2>
              <p className="text-[14px] leading-5 text-[#64748B]">
                Review and approve or reject this benefit override request.
              </p>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <OverrideRequestReviewContent loading={loading} viewModel={viewModel} />
          </div>
          <div className="shrink-0 px-6 pb-6">
            <div className="flex flex-col gap-2">
              <label
                className="text-[14px] leading-5 font-medium text-[#0A0A0A]"
                htmlFor="override-decision-notes"
              >
                Decision Notes
              </label>
              <textarea
                className="min-h-[64px] rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 py-2 text-[14px] leading-5 text-[#0A0A0A] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] outline-none"
                id="override-decision-notes"
                onChange={(event) => setReviewComment(event.target.value)}
                placeholder="Add notes for this decision..."
                value={reviewComment}
              />
            </div>
            {errorMessage ? (
              <p className="mt-4 rounded-[8px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[13px] leading-5 text-[#B42318]">
                {errorMessage}
              </p>
            ) : null}
            {isOwnRequest ? (
              <p className="mt-4 rounded-[8px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[13px] leading-5 text-[#B42318]">
                You can view your own request, but you cannot approve or reject it.
              </p>
            ) : null}
            <div className="mt-5 grid grid-cols-2 gap-5">
              <button
                className="flex h-[38px] items-center justify-center gap-2 rounded-[6px] border border-[#FFC4C4] bg-[#EF4444] px-4 text-[14px] leading-4 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!canReview || reviewing}
                onClick={() => void handleReview(false)}
                type="button"
              >
                <CircleX className="h-[18px] w-[18px]" />
                Reject
              </button>
              <button
                className="flex h-[38px] items-center justify-center gap-2 rounded-[6px] bg-black px-4 text-[14px] leading-4 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!canReview || reviewing}
                onClick={() => void handleReview(true)}
                type="button"
              >
                <CheckCircle2 className="h-[18px] w-[18px]" />
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
