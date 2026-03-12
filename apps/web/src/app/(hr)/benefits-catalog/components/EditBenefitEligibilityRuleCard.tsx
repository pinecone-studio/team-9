import { ChevronDown, Trash2 } from "lucide-react";

type EditBenefitEligibilityRuleCardProps = {
  explanation: string;
  operator: string;
  ruleType: string;
  value: string;
};

export default function EditBenefitEligibilityRuleCard({
  explanation,
  operator,
  ruleType,
  value,
}: EditBenefitEligibilityRuleCardProps) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] p-4">
      <div className="flex w-full items-center gap-3">
        <button className="flex h-9 w-[180px] items-center justify-between rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]" type="button">
          <span className="text-[14px] leading-5 font-normal text-[#0A0A0A]">{ruleType}</span>
          <ChevronDown className="h-4 w-4 text-[#737373]" />
        </button>
        <button className="flex h-9 w-[120px] items-center justify-between rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]" type="button">
          <span className="text-[14px] leading-5 font-normal text-[#0A0A0A]">{operator}</span>
          <ChevronDown className="h-4 w-4 text-[#737373]" />
        </button>
        <button className="flex h-9 flex-1 items-center justify-between rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]" type="button">
          <span className="text-[14px] leading-5 font-normal text-[#0A0A0A]">{value}</span>
          <ChevronDown className="h-4 w-4 text-[#737373]" />
        </button>
        <button className="flex h-6 w-6 items-center justify-center" type="button">
          <Trash2 className="h-5 w-5 text-[#737373]" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[14px] leading-5 font-medium text-[#737373]">
          Explanation shown to employees if this rule blocks access
        </span>
        <div className="flex h-9 items-center rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <span className="text-[14px] leading-[18px] font-normal text-[#0A0A0A]">
            {explanation}
          </span>
        </div>
      </div>
    </div>
  );
}
