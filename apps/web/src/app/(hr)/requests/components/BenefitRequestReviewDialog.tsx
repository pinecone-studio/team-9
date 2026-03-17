"use client";

import { useMutation } from "@apollo/client/react";
import { X } from "lucide-react";
import { useState } from "react";

import {
  type BenefitRequestRecord,
  REVIEW_BENEFIT_REQUEST_MUTATION,
  type ReviewBenefitRequestMutation,
  type ReviewBenefitRequestVariables,
} from "./benefit-requests.graphql";

type BenefitRequestReviewDialogProps = {
  currentUserIdentifier: string;
  onClose: () => void;
  onReviewed: () => Promise<unknown> | void;
  request: BenefitRequestRecord;
};

export default function BenefitRequestReviewDialog({
  currentUserIdentifier,
  onClose,
  onReviewed,
  request,
}: BenefitRequestReviewDialogProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reviewBenefitRequest, { loading }] = useMutation<
    ReviewBenefitRequestMutation,
    ReviewBenefitRequestVariables
  >(REVIEW_BENEFIT_REQUEST_MUTATION);

  async function handleReview(approved: boolean) {
    try {
      setErrorMessage(null);
      await reviewBenefitRequest({
        variables: {
          input: {
            approved,
            id: request.id,
            reviewedBy: currentUserIdentifier,
          },
        },
      });
      await onReviewed();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Benefit request review failed.",
      );
    }
  }

  const isPending = request.status === "pending";

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto flex w-full max-w-[720px] flex-col overflow-hidden rounded-[12px] border border-[#CBD5E1] bg-white">
        <div className="flex items-start justify-between border-b border-[#E2E8F0] px-6 py-5">
          <div className="flex min-w-0 flex-col gap-2">
            <h2 className="text-[20px] leading-7 font-semibold text-[#0F172A]">
              Benefit Request
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] leading-5 text-[#64748B]">
              <span>{request.employee.name}</span>
              <span>{request.benefit.title}</span>
              <span>Status: {request.status}</span>
            </div>
          </div>
          <button className="rounded-[8px] p-2 text-[#475569]" onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="bg-[#F8FAFC] px-6 py-6">
          <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[12px] leading-4 font-medium text-[#64748B]">Employee</p>
                <p className="mt-1 text-[14px] leading-5 text-[#0F172A]">{request.employee.name}</p>
                <p className="text-[12px] leading-4 text-[#737373]">{request.employee.position}</p>
              </div>
              <div>
                <p className="text-[12px] leading-4 font-medium text-[#64748B]">Benefit</p>
                <p className="mt-1 text-[14px] leading-5 text-[#0F172A]">{request.benefit.title}</p>
                <p className="text-[12px] leading-4 text-[#737373]">{request.benefit.category}</p>
              </div>
              <div>
                <p className="text-[12px] leading-4 font-medium text-[#64748B]">Submitted</p>
                <p className="mt-1 text-[14px] leading-5 text-[#0F172A]">{request.created_at}</p>
              </div>
              <div>
                <p className="text-[12px] leading-4 font-medium text-[#64748B]">Approver</p>
                <p className="mt-1 text-[14px] leading-5 text-[#0F172A]">
                  {request.approval_role === "finance_manager" ? "Finance" : "HR"}
                </p>
              </div>
            </div>
          </div>
          {errorMessage ? (
            <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] px-6 py-4">
          <button className="rounded-[8px] border border-[#D8DFE6] bg-[#F8FAFC] px-4 py-2 text-[14px] leading-5 text-[#111827]" onClick={onClose} type="button">
            Close
          </button>
          {isPending ? (
            <>
              <button className="rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-2 text-[14px] leading-5 text-[#B42318]" disabled={loading} onClick={() => void handleReview(false)} type="button">
                Reject
              </button>
              <button className="rounded-[8px] bg-[#111827] px-4 py-2 text-[14px] leading-5 text-white" disabled={loading} onClick={() => void handleReview(true)} type="button">
                {loading ? "Saving..." : "Approve"}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
