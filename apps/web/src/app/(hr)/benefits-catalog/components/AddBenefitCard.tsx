import { Plus } from "lucide-react";

type AddBenefitCardProps = {
  label?: string;
  onClick?: () => void;
};

export default function AddBenefitCard({
  label = "Add Benefits",
  onClick,
}: AddBenefitCardProps) {
  return (
    <button
      className="flex h-[184px] w-full flex-col items-center justify-center gap-2 rounded-[8px] border-2 border-dashed border-[rgba(219,222,225,0.6)] text-[#51565B] xl:max-w-[420px]"
      onClick={onClick}
      type="button"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#555555]">
        <Plus className="h-[14px] w-[14px] text-white" />
      </span>
      <span className="w-[137px] text-center text-[14px] leading-[18px] font-medium text-[#51565B]">
        {label}
      </span>
    </button>
  );
}
