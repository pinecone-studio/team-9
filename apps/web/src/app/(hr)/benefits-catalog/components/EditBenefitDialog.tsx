"use client";

import { ChevronDown, Percent, Plus, Trash2 } from "lucide-react";

import BenefitDialogFieldLabel from "./BenefitDialogFieldLabel";
import BenefitDialogToggle from "./BenefitDialogToggle";
import EditBenefitContractPanel from "./EditBenefitContractPanel";
import EditBenefitEligibilityRuleCard from "./EditBenefitEligibilityRuleCard";

type EditBenefitDialogProps = {
  benefitName: string;
  category: string;
  description: string;
  onClose: () => void;
};

export default function EditBenefitDialog({
  benefitName,
  category,
  description,
  onClose,
}: EditBenefitDialogProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-6">
      <div className="mx-auto flex h-full max-h-[calc(100vh-48px)] w-full max-w-[626px] flex-col overflow-hidden rounded-[8px] border border-[#CBD5E1] bg-white">
        <div className="sticky top-0 z-10 shrink-0 bg-white px-6 pt-6 pb-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-[18px] leading-7 font-semibold text-[#0F172A]">
              Add a New Benefit
            </h2>
            <div className="flex items-center gap-2 text-[14px] leading-5 font-normal text-[#64748B]">
              <span>{category}</span>
              <span className="block h-px w-2 bg-[#64748B]" />
              <span>{benefitName}</span>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6">
          <div className="flex flex-col gap-8 px-[2px] py-[2px]">
            <div className="flex items-center justify-between gap-4">
              <BenefitDialogFieldLabel>Benefit Name</BenefitDialogFieldLabel>
              <input className="h-9 w-[300px] rounded-[6px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-5 text-[#0F172A] outline-none" defaultValue={benefitName} type="text" />
            </div>
            <label className="flex flex-col gap-2">
              <BenefitDialogFieldLabel>Description</BenefitDialogFieldLabel>
              <textarea className="min-h-24 rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" defaultValue={description} />
            </label>
            <div className="border-t border-[#DBDEE1]" />

            <div className="flex flex-col gap-5">
              <h3 className="text-[16px] leading-4 font-semibold text-black">Benefit Value</h3>
              <div className="grid grid-cols-3 gap-[10px]">
                <label className="flex flex-col gap-[10px]"><BenefitDialogFieldLabel>Category</BenefitDialogFieldLabel><button className="flex h-[33px] items-center justify-between rounded-[6px] border border-[#CBD5E1] bg-white px-[18px]" type="button"><span className="text-[12px] leading-4">{category}</span><ChevronDown className="h-6 w-6 text-black" /></button></label>
                <label className="flex flex-col gap-[10px]"><BenefitDialogFieldLabel>Subsidy Percent</BenefitDialogFieldLabel><div className="flex h-[33px] items-center justify-between rounded-[6px] border border-[#CBD5E1] bg-white px-[18px]"><input className="w-full text-[12px] leading-4 outline-none" defaultValue="50" type="text" /><Percent className="h-4 w-4 text-black" /></div></label>
                <label className="flex flex-col gap-[10px]"><BenefitDialogFieldLabel>Vendor name</BenefitDialogFieldLabel><input className="h-[33px] rounded-[6px] border border-[#CBD5E1] bg-white px-[18px] text-[12px] leading-4 outline-none" defaultValue="PineFit Corp" type="text" /></label>
              </div>
            </div>

            <div className="border-t border-[#DBDEE1]" />

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-[5px]">
                <h3 className="text-[16px] leading-4 font-semibold text-black">Eligibility Rules</h3>
                <p className="text-[12px] leading-4 font-normal text-[#5B6470]">All rules must pass for employees to become eligible.</p>
              </div>
              <EditBenefitEligibilityRuleCard explanation="You must be an active employee to access this benefit." operator="is" ruleType="Employment Status" value="Active" />
              <EditBenefitEligibilityRuleCard explanation="Please submit your OKRs to unlock this benefit." operator="is" ruleType="OKR Submitted" value="True" />
              <EditBenefitEligibilityRuleCard explanation="You must have fewer than 3 late arrivals this quarter." operator="less than" ruleType="Late Arrivals" value="3" />
              <button className="flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#CBD5E1] bg-white text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]" type="button"><Plus className="h-4 w-4" />Add Another Rule</button>
            </div>

            <div className="border-t border-[#DBDEE1]" />

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-[5px]">
                <span className="text-[14px] leading-4 font-medium text-black">Core Benefit</span>
                <span className="text-[12px] leading-4 font-normal text-[#5B6470]">Available to all employees</span>
              </div>
              <BenefitDialogToggle />
            </div>

            <EditBenefitContractPanel />

            <div className="flex flex-col gap-4">
              <h3 className="text-[14px] leading-5 font-semibold uppercase tracking-[0.35px] text-[#0A0A0A]">Benefit Status</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center rounded-[10px] border border-[#CBD5E1] bg-[rgba(245,245,245,0.3)] p-3"><span className="mr-3 flex h-4 w-4 items-center justify-center rounded-full border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)]"><span className="h-2 w-2 rounded-full bg-[#171717]" /></span><span className="mr-2 text-[14px] leading-[14px] font-medium text-[#0A0A0A]">Active</span><span className="text-[14px] leading-5 font-medium text-[#737373]">Benefit is visible in the employee catalog</span></label>
                <label className="flex items-center rounded-[10px] border border-[#CBD5E1] bg-[rgba(245,245,245,0.3)] p-3"><span className="mr-3 h-4 w-4 rounded-full border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)]" /><span className="mr-2 text-[14px] leading-[14px] font-medium text-[#0A0A0A]">Disabled</span><span className="text-[14px] leading-5 font-medium text-[#737373]">Benefit is hidden from the employee catalog</span></label>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-[16px] leading-4 font-semibold text-black">Audit Information</h3>
              <div className="grid grid-cols-2 gap-4 rounded-[10px] border border-[#CBD5E1] bg-[rgba(245,245,245,0.2)] p-4">
                <div className="flex flex-col gap-1"><span className="text-[12px] leading-4 font-medium uppercase tracking-[0.3px] text-[#737373]">Last Updated</span><span className="text-[14px] leading-5 font-normal text-[#0A0A0A]">March 10, 2025 at 10:30 PM</span></div>
                <div className="flex flex-col gap-1"><span className="text-[12px] leading-4 font-medium uppercase tracking-[0.3px] text-[#737373]">Last Updated By</span><span className="text-[14px] leading-5 font-normal text-[#0A0A0A]">ElbegDorj (HR Admin)</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 mt-4 flex shrink-0 items-center justify-between gap-[9px] border-t border-[#DBDEE1] bg-white px-6 pt-4 pb-6">
          <button className="flex h-[38px] items-center justify-center gap-[10px] rounded-[6px] border border-[#FFC4C4] bg-[#EF4444] px-[10px] text-[14px] leading-4 font-medium text-white" type="button"><Trash2 className="h-[18px] w-[18px]" />Delete</button>
          <div className="flex items-center gap-[9px]">
            <button className="flex h-9 items-center justify-center rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] px-[10px] text-[14px] leading-4 font-normal text-black" onClick={onClose} type="button">Cancel</button>
            <button className="flex h-9 items-center justify-center rounded-[6px] bg-black px-[10px] text-[14px] leading-4 font-normal text-white" type="button">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}
