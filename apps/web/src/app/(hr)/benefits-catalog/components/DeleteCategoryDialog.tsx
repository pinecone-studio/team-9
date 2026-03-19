"use client";

import { AlertTriangle } from "lucide-react";
import {
  HR_DIALOG_MAX_HEIGHT_CLASS,
  HR_DIALOG_OVERLAY_BASE_CLASS,
} from "@/shared/ui/dialog-styles";

type DeleteCategoryDialogProps = {
  benefitCount: number;
  categoryName: string;
  errorMessage?: string | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteCategoryDialog({
  benefitCount,
  categoryName,
  errorMessage = null,
  loading = false,
  onClose,
  onConfirm,
}: DeleteCategoryDialogProps) {
  const hasBenefits = benefitCount > 0;

  return (
    <div
      className={`${HR_DIALOG_OVERLAY_BASE_CLASS} z-[70] flex items-center justify-center`}
      onClick={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className={`box-border flex w-full max-w-[462px] flex-col overflow-y-auto rounded-[12px] border border-[#CBD5E1] bg-white px-[31px] py-8 shadow-[0_20px_45px_rgba(0,0,0,0.2)] ${HR_DIALOG_MAX_HEIGHT_CLASS}`}>
        <div className="flex w-full flex-col items-center gap-8">
          <div className="flex w-[414px] max-w-full flex-col items-center gap-2 self-center">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[9999px] bg-[#FFE8E8]">
              <AlertTriangle className="h-6 w-6 text-[#EF4444]" />
            </div>
            <h2 className="w-full text-center text-[18px] leading-7 font-semibold text-[#0F172A]">
              {hasBenefits ? "This category can't be deleted" : "Delete this category?"}
            </h2>
            <p className="w-full text-center text-[14px] leading-5 text-[#64748B]">
              {hasBenefits
                ? `"${categoryName}" currently contains ${benefitCount} benefit${benefitCount === 1 ? "" : "s"}. Remove or move them before deleting this category.`
                : `"${categoryName}" has no benefits. Deleting it will remove this category from the catalog.`}
            </p>
          </div>

          {errorMessage ? (
            <p className="w-[414px] max-w-full rounded-[8px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[13px] leading-5 text-[#B42318]">
              {errorMessage}
            </p>
          ) : null}

          {hasBenefits ? (
            <button
              className="flex h-9 w-[414px] max-w-full items-center justify-center rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] text-[14px] leading-4 font-normal text-black"
              onClick={onClose}
              type="button"
            >
              Close
            </button>
          ) : (
            <div className="flex w-[414px] max-w-full flex-row items-center gap-[9px] self-center">
              <button
                className="flex h-9 w-[202.5px] flex-1 items-center justify-center rounded-[6px] border border-[#DC2626] bg-[#EF4444] text-[14px] leading-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
                onClick={onConfirm}
                type="button"
              >
                {loading ? "Deleting..." : "Delete Category"}
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
          )}
        </div>
      </div>
    </div>
  );
}
