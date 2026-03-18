"use client";

import { X } from "lucide-react";
import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

type SignOutConfirmDialogProps = {
  isOpen: boolean;
  isSigningOut: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function SignOutConfirmDialog({
  isOpen,
  isSigningOut,
  onClose,
  onConfirm,
}: SignOutConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSigningOut) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSigningOut, onClose]);

  if (!isOpen) {
    return null;
  }

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/50 px-4 py-6">
      <div
        className="flex min-h-full items-center justify-center"
        onClick={(event) => {
          if (event.target === event.currentTarget && !isSigningOut) {
            onClose();
          }
        }}
      >
        <div
          aria-describedby={descriptionId}
          aria-labelledby={titleId}
          aria-modal="true"
          className="relative w-full max-w-[420px] rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.18)]"
          role="dialog"
        >
          <button
            aria-label="Close dialog"
            className="absolute top-3 right-3 rounded-[8px] p-2 text-[#737373] transition-colors hover:bg-[#F5F5F5]"
            disabled={isSigningOut}
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="px-6 py-6 sm:px-7 sm:py-7">
            <h2 className="text-[20px] leading-7 font-semibold text-[#0A0A0A]" id={titleId}>
              Sign out?
            </h2>
            <p className="mt-2 text-[14px] leading-5 text-[#737373]" id={descriptionId}>
              Your current session will be closed. You can sign in again anytime
              from the login page.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#D4D4D8] px-4 text-[14px] font-medium text-[#171717] transition-colors hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSigningOut}
                onClick={onClose}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#171717] px-4 text-[14px] font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:bg-[#52525B]"
                disabled={isSigningOut}
                onClick={onConfirm}
                type="button"
              >
                {isSigningOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
