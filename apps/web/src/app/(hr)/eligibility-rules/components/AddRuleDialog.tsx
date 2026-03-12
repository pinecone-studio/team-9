"use client";

import { ChevronDown, X } from "lucide-react";

type AddRuleDialogProps = {
  onClose: () => void;
  sectionTitle: string;
};

function getRuleTypeLabel(sectionTitle: string) {
  return sectionTitle.replace(/ Rules$/, "");
}

export default function AddRuleDialog({
  onClose,
  sectionTitle,
}: AddRuleDialogProps) {
  const ruleTypeLabel = getRuleTypeLabel(sectionTitle);

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
            Add New {ruleTypeLabel} Rule
          </h2>
          <p className="text-[14px] leading-5 font-normal text-[#51565B]">
            Configure your new rule settings and affected benefits.
          </p>
        </div>

        <div className="flex w-full flex-col items-start gap-4 py-4">
          <label className="flex w-full flex-col gap-2">
            <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">
              Rule Name
            </span>
            <input
              className="h-9 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#51565B]"
              placeholder="e.g., Probation Gate"
              type="text"
            />
          </label>

          <label className="flex w-full flex-col gap-2">
            <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">
              Description
            </span>
            <textarea
              className="min-h-16 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#51565B]"
              placeholder="Describe what this rule does..."
            />
          </label>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">
                Config Type
              </span>
              <button
                className="flex h-9 w-[110px] items-center justify-between rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                type="button"
              >
                <span className="text-[14px] leading-5 font-normal text-[#060B10]">
                  Number
                </span>
                <ChevronDown className="h-6 w-6 text-[#51565B]" />
              </button>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">
                Config Label
              </span>
              <input
                className="h-9 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#51565B]"
                placeholder="e.g., Max arrivals"
                type="text"
              />
            </label>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">
                Default Value
              </span>
              <input
                className="h-9 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#060B10]"
                defaultValue="0"
                type="text"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">
                Unit
              </span>
              <input
                className="h-9 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#51565B]"
                placeholder="e.g., months, arrivals"
                type="text"
              />
            </label>
          </div>
        </div>

        <div className="flex w-full justify-end gap-2">
          <button
            className="flex h-9 items-center justify-center rounded-[6px] border border-[#DBDEE1] bg-[#F9FAFB] px-4 text-[14px] leading-5 font-medium text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="flex h-9 items-center justify-center rounded-[6px] bg-[#424242] px-4 text-[14px] leading-5 font-medium text-[#FAFAFA] opacity-50"
            type="button"
          >
            Add Rule
          </button>
        </div>
      </div>
    </div>
  );
}
