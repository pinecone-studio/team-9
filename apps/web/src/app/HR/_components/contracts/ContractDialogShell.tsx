import { X } from "lucide-react";
import type { ReactNode } from "react";

type ContractDialogShellProps = {
  children: ReactNode;
  onClose: () => void;
  subtitle: string;
  title: string;
  zIndexClass: string;
};

export default function ContractDialogShell({
  children,
  onClose,
  subtitle,
  title,
  zIndexClass,
}: ContractDialogShellProps) {
  return (
    <div
      className={`fixed inset-0 overflow-y-auto bg-black/50 px-4 py-6 ${zIndexClass}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="mx-auto flex min-h-full items-center justify-center">
        <div
          aria-modal="true"
          className="relative flex w-full max-w-[500px] flex-col rounded-[8px] border border-[#CBD5E1] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.18)]"
          role="dialog"
        >
          <button
            aria-label="Close dialog"
            className="absolute top-[14px] right-3 rounded-[8px] p-1 text-black"
            onClick={onClose}
            type="button"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-2 pr-10">
              <h2 className="text-[18px] leading-7 font-semibold text-[#0F172A]">{title}</h2>
              <p className="text-[14px] leading-5 text-[#64748B]">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
