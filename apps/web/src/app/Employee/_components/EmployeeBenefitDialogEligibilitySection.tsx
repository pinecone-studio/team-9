import { Check, ShieldAlert, SmilePlus, X } from "lucide-react";

import type { BenefitDialogRuleItem } from "./employee-benefit-dialog.helpers";

type EmployeeBenefitDialogEligibilitySectionProps = {
  items: BenefitDialogRuleItem[];
  loading: boolean;
  overrideMessage?: string | null;
};

export default function EmployeeBenefitDialogEligibilitySection({
  items,
  loading,
  overrideMessage = null,
}: EmployeeBenefitDialogEligibilitySectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
        Eligibility Breakdown
      </h3>
      {overrideMessage ? (
        <div className="flex items-start gap-3 rounded-[10px] border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-[13px] leading-5 text-[#92400E]">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{overrideMessage}</p>
        </div>
      ) : null}
      {loading ? (
        <p className="text-[13px] leading-5 text-[#64748B]">
          Loading eligibility details...
        </p>
      ) : items.length > 0 ? (
        items.map((item) => (
          <div className="flex items-start gap-3" key={item.id}>
            {item.passed ? (
              <Check className="mt-0.5 h-4 w-4 text-[#00C950]" />
            ) : (
              <X className="mt-0.5 h-4 w-4 text-[#DC2626]" />
            )}
            <div className="flex flex-col gap-1">
              <p className="text-[14px] leading-5 text-[#0A0A0A]">{item.label}</p>
              <p className="text-[12px] leading-4 text-[#737373]">
                {item.description}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-start gap-3 rounded-[10px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-[13px] leading-5 text-[#64748B]">
          <SmilePlus className="mt-0.5 h-4 w-4 shrink-0" />
          <p>No configured eligibility rules were found for this benefit.</p>
        </div>
      )}
    </div>
  );
}
