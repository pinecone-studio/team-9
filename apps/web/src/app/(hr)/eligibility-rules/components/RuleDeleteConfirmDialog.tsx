"use client";

import { AlertTriangle } from "lucide-react";

type RuleDeleteConfirmDialogProps = {
  benefitUsageCount: number;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function RuleDeleteConfirmDialog({
  benefitUsageCount,
  loading,
  onClose,
  onConfirm,
}: RuleDeleteConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex w-full max-w-[462px] flex-col rounded-[12px] border border-[#CBD5E1] bg-white px-[31px] py-8 shadow-[0_20px_45px_rgba(0,0,0,0.2)]">
        <div className="flex w-full flex-col items-center gap-8">
          <div className="flex w-[414px] max-w-full flex-col items-center gap-2 self-center">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[9999px] bg-[#FFE8E8]">
              <AlertTriangle className="h-6 w-6 text-[#EF4444]" />
            </div>
            <h2 className="w-full text-center text-[18px] leading-7 font-semibold text-[#0F172A]">
              Archive this rule?
            </h2>
            <p className="w-full text-center text-[14px] leading-5 text-[#64748B]">
              This will submit an archive request for review before the rule is removed.
            </p>
            <div className="w-full rounded-[8px] border border-[#F1F5F9] bg-[#F8FAFC] px-3 py-2 text-center">
              <p className="text-[11px] leading-4 font-medium tracking-[0.3px] text-[#64748B] uppercase">
                Used In Benefits
              </p>
              <p className="text-[18px] leading-7 font-semibold text-[#0F172A]">
                {benefitUsageCount}
              </p>
            </div>
          </div>

          <div className="flex w-[414px] max-w-full flex-row items-center gap-[9px] self-center">
            <button
              className="flex h-9 w-[202.5px] flex-1 items-center justify-center rounded-[6px] border border-[#DC2626] bg-[#EF4444] text-[14px] leading-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
              onClick={onConfirm}
              type="button"
            >
              {loading ? "Submitting..." : "Archive Rule"}
            </button>
            <button
              className="flex h-9 w-[202.5px] flex-1 items-center justify-center rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] text-[14px] leading-4 font-normal text-black"
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
