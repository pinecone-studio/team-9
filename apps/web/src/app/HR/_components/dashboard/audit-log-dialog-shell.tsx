"use client";

import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";

type AuditLogDialogShellProps = {
  children: React.ReactNode;
  compact?: boolean;
  icon: LucideIcon;
  onClose: () => void;
  title: string;
};

export function AuditLogDialogShell({
  children,
  compact = false,
  icon: Icon,
  onClose,
  title,
}: AuditLogDialogShellProps) {
  useLockBodyScroll();

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-hidden bg-black/50 px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        aria-modal="true"
        className={`hidden-scrollbar relative mx-auto flex max-h-[calc(100vh-48px)] w-full flex-col items-start gap-4 overflow-y-auto overscroll-none rounded-[10px] border border-[#E5E5E5] bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] ${
          compact ? "max-w-[512px] px-[23.8px] py-[23.8px]" : "max-w-[506px] px-[25px] py-[30px]"
        }`}
        role="dialog"
      >
        <button
          aria-label="Close dialog"
          className="absolute top-5 right-5 rounded-[8px] p-2 text-[#737373] transition-colors hover:bg-[#F5F5F5]"
          onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex w-full flex-col gap-2 pr-10">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-[#737373]" />
            <h2 className="text-[18px] leading-[18px] font-semibold text-[#0A0A0A]">
              {title}
            </h2>
          </div>
          <p className="text-[14px] leading-5 text-[#737373]">Full details for this action.</p>
        </div>

        <div className="flex w-full flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}

function useLockBodyScroll() {
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverscrollBehavior = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscrollBehavior;
    };
  }, []);
}
