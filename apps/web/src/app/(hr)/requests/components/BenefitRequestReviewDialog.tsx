"use client";

import { Check, CircleX, X } from "lucide-react";

import {
  getBenefitReviewDetail,
  type BenefitReviewDetail,
} from "./benefit-review-details";
import BenefitRequestReviewDialogContent from "./BenefitRequestReviewDialogContent";
import type { BenefitRequestRow } from "./requests-data";

type BenefitRequestReviewDialogProps = {
  onClose: () => void;
  onDecision: (decision: "accept" | "reject", notes: string) => void;
  onNotesChange: (value: string) => void;
  notes: string;
  request: BenefitRequestRow | null;
};

export default function BenefitRequestReviewDialog({
  onClose,
  onDecision,
  onNotesChange,
  notes,
  request,
}: BenefitRequestReviewDialogProps) {
  const detail = request ? getBenefitReviewDetail(request) : null;

  if (!request || !detail) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/25 p-4 sm:p-8"
      onClick={onClose}
    >
      <aside
        className="relative flex h-full max-h-[95vh] w-full max-w-[626px] flex-col rounded-[8px] border border-[#CBD5E1] bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Close review dialog"
          className="absolute top-3 right-3 rounded-md p-1 text-[#0A0A0A] hover:bg-[#F5F5F5]"
          onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>

        <DialogTitle detail={detail} />
        <div className="mt-7">
          <BenefitRequestReviewDialogContent detail={detail} />
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-[14px] leading-5 font-medium text-[#0A0A0A]">Decision Notes</p>
          <textarea
            className="h-16 w-full resize-none rounded-[8px] border border-[#E5E5E5] px-3 py-2 text-[14px] leading-5 text-[#0A0A0A] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373] focus:border-[#CBD5E1]"
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Add notes for this decision..."
            value={notes}
          />
          <div className="grid grid-cols-2 gap-5">
            <button
              className="inline-flex h-[38px] items-center justify-center gap-2 rounded-[6px] border border-[#FFC4C4] bg-[#EF4444] text-[14px] font-medium text-white"
              onClick={() => onDecision("reject", notes)}
              type="button"
            >
              <CircleX className="h-[18px] w-[18px]" />
              Reject
            </button>
            <button
              className="inline-flex h-[38px] items-center justify-center gap-2 rounded-[6px] bg-black text-[14px] font-medium text-white"
              onClick={() => onDecision("accept", notes)}
              type="button"
            >
              <Check className="h-[18px] w-[18px]" />
              Accept
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function DialogTitle({ detail }: { detail: BenefitReviewDetail }) {
  return (
    <div className="pr-10">
      <h2 className="text-[18px] leading-7 font-semibold text-[#0F172A]">
        {detail.title}
      </h2>
      <p className="mt-2 text-[14px] leading-5 text-[#64748B]">{detail.subtitle}</p>
    </div>
  );
}
