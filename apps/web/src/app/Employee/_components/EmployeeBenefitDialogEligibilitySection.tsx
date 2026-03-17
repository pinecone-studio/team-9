import { Check, SmilePlus, X } from "lucide-react";

import type { BenefitDialogRuleItem } from "./employee-benefit-dialog.helpers";

type EmployeeBenefitDialogEligibilitySectionProps = {
  items: BenefitDialogRuleItem[];
  loading: boolean;
};

export default function EmployeeBenefitDialogEligibilitySection({
  items,
  loading,
}: EmployeeBenefitDialogEligibilitySectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
        Eligibility Breakdown
      </h3>
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
