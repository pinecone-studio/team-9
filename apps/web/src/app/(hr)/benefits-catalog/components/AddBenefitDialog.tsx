"use client";

import {
  ChevronDown,
  Percent,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

import BenefitDialogFieldLabel from "./BenefitDialogFieldLabel";
import BenefitDialogToggle from "./BenefitDialogToggle";

type AddBenefitDialogProps = {
  onClose: () => void;
};

export default function AddBenefitDialog({ onClose }: AddBenefitDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="flex w-full max-w-[578px] flex-col items-start gap-8 rounded-[10px] bg-white p-6">
        <div className="flex w-full flex-col items-start gap-2">
          <h2 className="w-full text-[18px] leading-7 font-semibold text-[#0F172A]">
            Add a New Benefit
          </h2>
          <p className="w-full text-[14px] leading-5 font-normal text-[#64748B]">
            Make changes to your profile here. Click save when you&apos;re done.
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-4">
          <BenefitDialogFieldLabel>Benefit Name</BenefitDialogFieldLabel>
          <input
            className="h-9 w-[300px] rounded-[6px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-5 text-[#0F172A] outline-none"
            defaultValue="Name"
            type="text"
          />
        </div>

        <label className="flex w-full flex-col items-start gap-2">
          <BenefitDialogFieldLabel>Description</BenefitDialogFieldLabel>
          <textarea
            className="min-h-24 w-full rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-[#0F172A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]"
            placeholder="Explain how this benefit works and what employees get from it..."
          />
        </label>

        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
          <label className="flex flex-1 flex-col gap-[10px]">
            <BenefitDialogFieldLabel>Category</BenefitDialogFieldLabel>
            <button
              className="flex h-[33px] items-center justify-between rounded-[6px] border border-[#CBD5E1] bg-white px-[18px]"
              type="button"
            >
              <span className="text-[12px] leading-4 font-normal text-black">Wellness</span>
              <ChevronDown className="h-6 w-6 text-black" />
            </button>
          </label>

          <label className="flex flex-1 flex-col gap-[10px]">
            <BenefitDialogFieldLabel>Subsidy Percent</BenefitDialogFieldLabel>
            <div className="flex h-[33px] items-center justify-between rounded-[6px] border border-[#CBD5E1] bg-white px-[18px]">
              <input
                className="w-full text-[12px] leading-4 font-normal text-black outline-none"
                defaultValue="50"
                type="text"
              />
              <Percent className="h-4 w-4 text-black" />
            </div>
          </label>

          <label className="flex flex-1 flex-col gap-[10px]">
            <BenefitDialogFieldLabel>Vendor name</BenefitDialogFieldLabel>
            <input
              className="h-[33px] rounded-[6px] border border-[#CBD5E1] bg-white px-[18px] text-[12px] leading-4 font-normal text-black outline-none"
              defaultValue="PineFit Corp"
              type="text"
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
          <BenefitDialogToggle />
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
              <button className="flex h-8 w-8 items-center justify-center rounded-[8px] opacity-50" type="button">
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
            <BenefitDialogToggle />
          </div>

          <button
            className="flex h-9 w-full items-center justify-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-white text-[14px] leading-5 font-medium text-[#BFBFBF] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            type="button"
          >
            <Upload className="h-4 w-4" />
            Upload Contract
          </button>
        </div>

        <div className="flex w-full flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <button
            className="flex h-[38px] items-center justify-center gap-[10px] rounded-[6px] border border-[#FFC4C4] bg-[#EF4444] px-[10px] text-[14px] leading-4 font-medium text-white"
            type="button"
          >
            <Trash2 className="h-[18px] w-[18px]" />
            Delete
          </button>

          <div className="flex items-center gap-[9px]">
            <button
              className="flex h-9 items-center justify-center rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] px-[10px] text-[14px] leading-4 font-normal text-black"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="flex h-9 items-center justify-center rounded-[6px] bg-black px-[10px] text-[14px] leading-4 font-normal text-white"
              type="button"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
