import { PlusCircle } from "lucide-react";

type AddRuleCardProps = {
  onClick?: () => void;
};

export default function AddRuleCard({ onClick }: AddRuleCardProps) {
  return (
    <button
      className="flex h-[196px] w-full flex-col items-center justify-center gap-2 rounded-[8px] border-2 border-dashed border-[rgba(219,222,225,0.6)] text-[#51565B] xl:max-w-[420px]"
      onClick={onClick}
      type="button"
    >
      <span className="flex flex-col items-center gap-0">
        <PlusCircle className="h-6 w-6" />
        <span className="mt-2 text-center text-[14px] leading-5 font-medium">Add Rule</span>
      </span>
    </button>
  );
}
