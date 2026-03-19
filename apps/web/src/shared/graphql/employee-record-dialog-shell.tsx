"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import {
  HR_DIALOG_MAX_HEIGHT_CLASS,
  HR_DIALOG_OVERLAY_BASE_CLASS,
} from "@/shared/ui/dialog-styles";

type EmployeeRecordDialogShellProps = {
  children: ReactNode;
  footer: ReactNode;
  onClose: () => void;
  subtitle: string;
  title: string;
};

export default function EmployeeRecordDialogShell({
  children,
  footer,
  onClose,
  subtitle,
  title,
}: EmployeeRecordDialogShellProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className={`${HR_DIALOG_OVERLAY_BASE_CLASS} z-[90]`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="mx-auto flex min-h-full items-center justify-center"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          aria-modal="true"
          className={`relative flex w-full max-w-[510px] flex-col overflow-hidden rounded-[12px] border border-[#D4D4D8] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.18)] ${HR_DIALOG_MAX_HEIGHT_CLASS}`}
          role="dialog"
        >
          <button
            aria-label="Close dialog"
            className="absolute top-4 right-4 rounded-[8px] p-1 text-[#737373]"
            onClick={onClose}
            type="button"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="border-b border-[#E5E5E5] px-6 pt-6 pb-4">
            <div className="pr-10">
              <h2 className="text-[18px] leading-[18px] font-semibold text-[#0A0A0A]">
                {title}
              </h2>
              <p className="mt-4 text-[14px] leading-5 text-[#737373]">{subtitle}</p>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {children}
          </div>
          <div className="border-t border-[#E5E5E5] px-6 py-4">{footer}</div>
        </div>
      </div>
    </div>
  );
}
