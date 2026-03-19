"use client";

import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import {
  REVIEW_APPROVAL_REQUEST_MUTATION,
  type ReviewApprovalRequestMutation,
  type ReviewApprovalRequestVariables,
} from "@/app/(hr)/requests/components/approval-requests.graphql";
import { buildCancelledByRequesterComment } from "@/app/(hr)/requests/components/approval-request-cancel";
import {
  HR_DIALOG_MAX_HEIGHT_CLASS,
  HR_DIALOG_OVERLAY_BASE_CLASS,
} from "@/shared/ui/dialog-styles";

type BenefitCancelRequestDialogProps = {
  currentUserIdentifier: string;
  onCancelled: () => Promise<unknown> | void;
  onClose: () => void;
  requestId: string | null;
};

export default function BenefitCancelRequestDialog({
  currentUserIdentifier,
  onCancelled,
  onClose,
  requestId,
}: BenefitCancelRequestDialogProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reviewApprovalRequest, { loading }] = useMutation<
    ReviewApprovalRequestMutation,
    ReviewApprovalRequestVariables
  >(REVIEW_APPROVAL_REQUEST_MUTATION);

  if (!requestId) {
    return null;
  }
  const activeRequestId = requestId;

  async function handleConfirm() {
    try {
      setErrorMessage(null);
      await reviewApprovalRequest({
        variables: {
          input: {
            approved: false,
            id: activeRequestId,
            reviewComment: buildCancelledByRequesterComment(),
            reviewedBy: currentUserIdentifier,
          },
        },
      });
      await onCancelled();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Request could not be cancelled.",
      );
    }
  }

  return (
    <div
      className={`${HR_DIALOG_OVERLAY_BASE_CLASS} z-[70] flex items-center justify-center`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`flex w-full max-w-[462px] flex-col box-border rounded-[12px] border border-[#CBD5E1] bg-white px-[31px] py-8 shadow-[0_20px_45px_rgba(0,0,0,0.2)] ${HR_DIALOG_MAX_HEIGHT_CLASS}`}>
        <div className="flex w-full flex-col items-center gap-8">
          <div className="flex w-[414px] max-w-full flex-col items-center gap-2 self-center">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[9999px] bg-[#FFE8E8]">
              <AlertTriangle className="h-6 w-6 text-[#EF4444]" />
            </div>
            <h2 className="w-full text-center text-[18px] leading-7 font-semibold text-[#0F172A]">
              Cancel this request?
            </h2>
            <p className="w-full text-center text-[14px] leading-5 text-[#64748B]">
              This pending request will be cancelled and reviewers will no
              longer see it in their approval queue.
            </p>
          </div>

          {errorMessage ? (
            <p className="w-[414px] max-w-full rounded-[8px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[13px] leading-5 text-[#B42318]">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex w-[414px] max-w-full flex-row items-center gap-[9px] self-center">
            <button
              className="flex h-9 w-[202.5px] flex-1 items-center justify-center rounded-[6px] border border-[#DC2626] bg-[#EF4444] text-[14px] leading-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
              onClick={() => void handleConfirm()}
              type="button"
            >
              {loading ? "Cancelling..." : "Cancel Request"}
            </button>
            <button
              className="flex h-9 w-[202.5px] flex-1 items-center justify-center rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8]  text-[14px] leading-4 font-normal text-black"
              disabled={loading}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
