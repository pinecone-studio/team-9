import { Percent, Plus } from "lucide-react";

import BenefitDialogFieldLabel from "./BenefitDialogFieldLabel";
import BenefitDialogToggle from "./BenefitDialogToggle";
import EditBenefitContractPanel from "./EditBenefitContractPanel";
import EditBenefitEligibilityRuleCard from "./EditBenefitEligibilityRuleCard";

type EditBenefitDialogFormProps = {
  benefitDescription: string;
  name: string;
  onBenefitDescriptionChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onSubsidyPercentChange: (value: string) => void;
  onVendorNameChange: (value: string) => void;
  subsidyPercentValue: string;
  vendorNameValue: string;
};

export default function EditBenefitDialogForm({
  benefitDescription,
  name,
  onBenefitDescriptionChange,
  onNameChange,
  onSubsidyPercentChange,
  onVendorNameChange,
  subsidyPercentValue,
  vendorNameValue,
}: EditBenefitDialogFormProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col gap-8 px-[2px] py-[2px]">
        <div className="flex items-center justify-between gap-4">
          <BenefitDialogFieldLabel>Benefit Name</BenefitDialogFieldLabel>
          <input
            className="h-9 w-[300px] rounded-[6px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-5 text-[#0F172A] outline-none"
            onChange={(event) => onNameChange(event.target.value)}
            type="text"
            value={name}
          />
        </div>

        <label className="flex flex-col gap-2">
          <BenefitDialogFieldLabel>Description</BenefitDialogFieldLabel>
          <textarea
            className="min-h-24 rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none"
            onChange={(event) => onBenefitDescriptionChange(event.target.value)}
            value={benefitDescription}
          />
        </label>
        <div className="border-t border-[#DBDEE1]" />

        <div className="flex flex-col gap-5">
          <h3 className="text-[16px] leading-4 font-semibold text-black">Benefit Value</h3>
          <div className="grid grid-cols-2 gap-[10px]">
            <label className="flex flex-col gap-[10px]">
              <BenefitDialogFieldLabel>Subsidy Percent</BenefitDialogFieldLabel>
              <div className="flex h-[33px] items-center justify-between rounded-[6px] border border-[#CBD5E1] bg-white px-[18px]">
                <input
                  className="w-full text-[12px] leading-4 outline-none"
                  max={100}
                  min={0}
                  onChange={(event) => onSubsidyPercentChange(event.target.value)}
                  type="number"
                  value={subsidyPercentValue}
                />
                <Percent className="h-4 w-4 text-black" />
              </div>
            </label>

            <label className="flex flex-col gap-[10px]">
              <BenefitDialogFieldLabel>Vendor name</BenefitDialogFieldLabel>
              <input
                className="h-[33px] rounded-[6px] border border-[#CBD5E1] bg-white px-[18px] text-[12px] leading-4 outline-none"
                onChange={(event) => onVendorNameChange(event.target.value)}
                type="text"
                value={vendorNameValue}
              />
            </label>
          </div>
        </div>

        <div className="border-t border-[#DBDEE1]" />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-[5px]">
            <h3 className="text-[16px] leading-4 font-semibold text-black">Eligibility Rules</h3>
            <p className="text-[12px] leading-4 font-normal text-[#5B6470]">
              All rules must pass for employees to become eligible.
            </p>
          </div>
          <EditBenefitEligibilityRuleCard
            explanation="You must be an active employee to access this benefit."
            operator="is"
            ruleType="Employment Status"
            value="Active"
          />
          <EditBenefitEligibilityRuleCard
            explanation="Please submit your OKRs to unlock this benefit."
            operator="is"
            ruleType="OKR Submitted"
            value="True"
          />
          <EditBenefitEligibilityRuleCard
            explanation="You must have fewer than 3 late arrivals this quarter."
            operator="less than"
            ruleType="Late Arrivals"
            value="3"
          />
          <button
            className="flex h-9 items-center justify-center gap-2 rounded-[8px] border border-[#CBD5E1] bg-white text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            type="button"
          >
            <Plus className="h-4 w-4" />
            Add Another Rule
          </button>
        </div>

        <div className="border-t border-[#DBDEE1]" />

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-[5px]">
            <span className="text-[14px] leading-4 font-medium text-black">Core Benefit</span>
            <span className="text-[12px] leading-4 font-normal text-[#5B6470]">
              Available to all employees
            </span>
          </div>
          <BenefitDialogToggle />
        </div>

        <EditBenefitContractPanel />
      </div>
    </div>
  );
}
