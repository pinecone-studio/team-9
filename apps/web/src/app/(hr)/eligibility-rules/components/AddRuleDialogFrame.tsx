import type { ReactNode } from "react";
import { X } from "lucide-react";

type AddRuleDialogFrameProps = {
  children: ReactNode;
  onClose: () => void;
  onSubmit: () => void;
  ruleLabel: string;
  submitDisabled: boolean;
  submitting: boolean;
};

export default function AddRuleDialogFrame({
  children,
  onClose,
  onSubmit,
  ruleLabel,
  submitDisabled,
  submitting,
}: AddRuleDialogFrameProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative flex w-full max-w-[512px] flex-col items-start gap-4 rounded-[8px] border border-[#DBDEE1] bg-white px-6 py-[55px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
        <button
          aria-label="Close dialog"
          className="absolute top-[17px] right-[17px] opacity-70"
          onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5 text-[#060B10]" />
        </button>

        <div className="flex w-full flex-col items-start gap-2">
          <h2 className="text-[18px] leading-[18px] font-semibold text-[#060B10]">
            Add New {ruleLabel} Rule
          </h2>
          <p className="text-[14px] leading-5 font-normal text-[#51565B]">
            Create a rule using backend employee data only, then send it for approval.
          </p>
        </div>

        {children}

        <div className="flex w-full justify-end gap-2">
          <button
            className="flex h-9 items-center justify-center rounded-[6px] border border-[#DBDEE1] bg-[#F9FAFB] px-4 text-[14px] leading-5 font-medium text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="flex h-9 items-center justify-center rounded-[6px] bg-[#424242] px-4 text-[14px] leading-5 font-medium text-[#FAFAFA] disabled:opacity-50"
            disabled={submitDisabled}
            onClick={onSubmit}
            type="button"
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
