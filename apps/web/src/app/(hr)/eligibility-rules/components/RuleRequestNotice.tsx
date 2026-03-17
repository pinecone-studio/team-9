"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

type RuleRequestNoticeProps = {
  message: string;
  onClose: () => void;
};

export default function RuleRequestNotice({
  message,
  onClose,
}: RuleRequestNoticeProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, 4500);
    return () => window.clearTimeout(timeoutId);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-[60] flex w-full max-w-[420px] items-start gap-3 rounded-[12px] border border-[#D1FAE5] bg-white px-4 py-3 shadow-[0_20px_45px_rgba(15,23,42,0.16)]">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#16A34A]" />
      <div className="min-w-0 flex-1">
        <p className="text-[14px] leading-5 font-medium text-[#0F172A]">
          Request sent
        </p>
        <p className="mt-1 text-[13px] leading-5 text-[#64748B]">
          {message}
        </p>
      </div>
      <button
        aria-label="Close notice"
        className="rounded p-1 text-[#94A3B8] transition hover:bg-[#F8FAFC] hover:text-[#334155]"
        onClick={onClose}
        type="button"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
