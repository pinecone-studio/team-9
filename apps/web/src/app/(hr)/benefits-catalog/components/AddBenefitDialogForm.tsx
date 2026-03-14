import { ChevronDown, Percent, Plus, Trash2, Upload } from "lucide-react";
import type { RefObject } from "react";

import BenefitDialogFieldLabel from "./BenefitDialogFieldLabel";
import BenefitDialogToggle from "./BenefitDialogToggle";

type AddBenefitDialogFormProps = {
  coreBenefitEnabled: boolean;
  description: string;
  errorMessage: string | null;
  errorMessageRef: RefObject<HTMLParagraphElement | null>;
  name: string;
  onCoreBenefitEnabledChange: (value: boolean) => void;
  onDescriptionChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onRequiresContractChange: (value: boolean) => void;
  onSubsidyPercentChange: (value: string) => void;
  onVendorNameChange: (value: string) => void;
  requiresContract: boolean;
  subsidyPercent: string;
  vendorName: string;
};

export default function AddBenefitDialogForm({
  coreBenefitEnabled,
  description,
  errorMessage,
  errorMessageRef,
  name,
  onCoreBenefitEnabledChange,
  onDescriptionChange,
  onNameChange,
  onRequiresContractChange,
  onSubsidyPercentChange,
  onVendorNameChange,
  requiresContract,
  subsidyPercent,
  vendorName,
}: AddBenefitDialogFormProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-full flex-col items-start gap-8">
        <div className="flex w-full items-center justify-between gap-4">
          <BenefitDialogFieldLabel>Benefit Name</BenefitDialogFieldLabel>
          <input
            className="h-9 w-[300px] rounded-[6px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-5 text-[#0F172A] outline-none"
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Name"
            type="text"
            value={name}
          />
        </div>

        <label className="flex w-full flex-col items-start gap-2">
          <BenefitDialogFieldLabel>Description</BenefitDialogFieldLabel>
          <textarea
            className="min-h-24 w-full rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-[#0F172A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]"
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Explain how this benefit works and what employees get from it..."
            value={description}
          />
        </label>

        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
          <label className="flex flex-1 flex-col gap-[10px]">
            <BenefitDialogFieldLabel>Subsidy Percent</BenefitDialogFieldLabel>
            <div className="flex h-[33px] items-center justify-between rounded-[6px] border border-[#CBD5E1] bg-white px-[18px]">
              <input
                className="w-full text-[12px] leading-4 font-normal text-black outline-none"
                max={100}
                min={0}
                onChange={(event) => onSubsidyPercentChange(event.target.value)}
                type="number"
                value={subsidyPercent}
              />
              <Percent className="h-4 w-4 text-black" />
            </div>
          </label>

          <label className="flex flex-1 flex-col gap-[10px]">
            <BenefitDialogFieldLabel>Vendor name</BenefitDialogFieldLabel>
            <input
              className="h-[33px] rounded-[6px] border border-[#CBD5E1] bg-white px-[18px] text-[12px] leading-4 font-normal text-black outline-none"
              onChange={(event) => onVendorNameChange(event.target.value)}
              placeholder="Vendor"
              type="text"
              value={vendorName}
            />
          </label>
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-start gap-[5px]">
            <span className="text-[14px] leading-4 font-medium text-black">Core Benefit</span>
            <span className="text-[12px] leading-4 font-normal text-[#5B6470]">
              Available to all employees
            </span>
          </div>
          <BenefitDialogToggle
            checked={coreBenefitEnabled}
            onCheckedChange={onCoreBenefitEnabledChange}
          />
        </div>

        <div className="flex w-full flex-col items-start gap-3">
          <div className="flex w-full flex-col gap-4 rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] p-4">
            <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
              <button
                className="flex h-9 w-full items-center justify-between rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] lg:w-[180px]"
                type="button"
              >
                <span className="text-[14px] leading-5 font-normal text-[#737373]">Rule Type</span>
                <ChevronDown className="h-4 w-4 text-[#737373]" />
              </button>
              <button
                className="flex h-9 w-full items-center justify-between rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] lg:flex-1"
                type="button"
              >
                <span className="text-[14px] leading-5 font-normal text-[#0A0A0A]">at least</span>
                <ChevronDown className="h-4 w-4 text-[#737373]" />
              </button>
              <input
                className="h-9 w-full rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373] lg:flex-1"
                placeholder="Enter value"
                type="text"
              />
              <button
                className="flex h-8 w-8 items-center justify-center rounded-[8px] opacity-50"
                type="button"
              >
                <Trash2 className="h-4 w-4 text-[#737373]" />
              </button>
            </div>
          </div>

          <button
            className="flex h-9 w-full items-center justify-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-white text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add Another Rule
          </button>
        </div>

        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-start gap-[2px]">
              <span className="text-[14px] leading-4 font-medium text-black">Requires Contract</span>
              <span className="text-[12px] leading-4 font-normal text-[#5B6470]">
                Employee must sign an agreement
              </span>
            </div>
            <BenefitDialogToggle
              checked={requiresContract}
              onCheckedChange={onRequiresContractChange}
            />
          </div>

          <button
            className="flex h-9 w-full items-center justify-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-white text-[14px] leading-5 font-medium text-[#BFBFBF] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            type="button"
          >
            <Upload className="h-4 w-4" />
            Upload Contract
          </button>
        </div>

        {errorMessage ? (
          <p
            className="mb-4 w-full scroll-mb-8 rounded-[6px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[13px] leading-5 text-[#B42318]"
            ref={errorMessageRef}
          >
            {errorMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
