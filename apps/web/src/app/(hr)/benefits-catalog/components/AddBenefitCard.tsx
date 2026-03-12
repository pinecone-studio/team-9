import { PlusCircle } from "lucide-react";

type AddBenefitCardProps = {
  onClick?: () => void;
};

export default function AddBenefitCard({ onClick }: AddBenefitCardProps) {
  return (
    <button
      className="flex h-[184px] w-full flex-col items-center justify-center gap-2 rounded-[8px] border-2 border-dashed border-[rgba(219,222,225,0.6)] text-[#51565B] xl:max-w-[420px]"
      onClick={onClick}
      type="button"
    >
      <PlusCircle className="h-6 w-6" />
      <span className="text-center text-[14px] leading-5 font-medium">Add Benefits</span>
    </button>
  );
}
