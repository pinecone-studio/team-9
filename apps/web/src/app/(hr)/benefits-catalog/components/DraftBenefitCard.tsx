import { Pencil, Trash2 } from "lucide-react";

type DraftBenefitCardProps = {
  description: string;
  onContinueEditing?: () => void;
  onDeleteDraft?: () => void;
  title: string;
};

export default function DraftBenefitCard({
  description,
  onContinueEditing,
  onDeleteDraft,
  title,
}: DraftBenefitCardProps) {
  return (
    <article className="flex h-[184px] w-full min-w-0 flex-col justify-between rounded-[8px] border-2 border-dashed border-[rgba(219,222,225,0.6)] p-4 xl:max-w-[420px]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[16px] leading-[21px] font-semibold text-[rgba(6,11,16,0.5)]">
          {title}
        </h3>
        <span className="inline-flex h-6 items-center justify-center rounded-[4px] border border-dashed border-[#EDEFF0] px-[6px] text-[10px] leading-[13px] font-semibold text-[#1C2229]">
          Drafted
        </span>
      </div>

      <p className="line-clamp-2 max-w-[360px] text-[14px] leading-[18px] font-normal text-[rgba(81,86,91,0.6)]">
        {description}
      </p>

      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-2">
          <button
            className="inline-flex h-[30px] items-center justify-center gap-1 rounded-[2px] border border-dashed border-[#EDEFF0] px-[13px] pr-[13px] pl-2 text-[14px] leading-[18px] font-medium text-[#EF4444]"
            onClick={onDeleteDraft}
            type="button"
          >
            <Trash2 className="h-4 w-4" />
            Delete Draft
          </button>

          <button
            className="inline-flex h-[30px] items-center justify-center gap-1 rounded-[2px] border border-dashed border-[#EDEFF0] px-[13px] pr-[13px] pl-2 text-[14px] leading-[18px] font-medium text-[#5D5D5D]"
            onClick={onContinueEditing}
            type="button"
          >
            <Pencil className="h-4 w-4" />
            Continue Editing
          </button>
        </div>

        <p className="text-[14px] leading-5 font-medium italic text-[#737373]">
          Draft saved automatically
        </p>
      </div>
    </article>
  );
}
