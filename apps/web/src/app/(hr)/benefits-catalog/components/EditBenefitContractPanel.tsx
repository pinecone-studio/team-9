import { FileText } from "lucide-react";

import BenefitDialogToggle from "./BenefitDialogToggle";

type EditBenefitContractPanelProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export default function EditBenefitContractPanel({
  checked,
  onCheckedChange,
}: EditBenefitContractPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-[2px]">
          <span className="text-[14px] leading-4 font-medium text-black">Requires Contract</span>
          <span className="text-[12px] leading-4 font-normal text-[#5B6470]">
            Employee must sign an agreement
          </span>
        </div>
        <BenefitDialogToggle checked={checked} onCheckedChange={onCheckedChange} />
      </div>

      <div className="flex w-full items-center justify-between rounded-[10px] border border-[#CBD5E1] bg-[rgba(245,245,245,0.3)] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#E5E5E5] bg-white">
            <FileText className="h-6 w-6 text-[#737373]" />
          </div>
          <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
            pinefit_contract_2025.pdf
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex h-8 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]" type="button">
            View
          </button>
          <button className="flex h-8 items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]" type="button">
            Replace
          </button>
        </div>
      </div>
    </div>
  );
}
