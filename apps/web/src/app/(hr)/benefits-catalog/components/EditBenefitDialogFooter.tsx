import { Trash2 } from "lucide-react";

type EditBenefitDialogFooterProps = {
  deleting: boolean;
  errorMessage: string | null;
  onCancel: () => void;
  onDelete: () => void;
  onSave: () => void;
  updating: boolean;
};

export default function EditBenefitDialogFooter({
  deleting,
  errorMessage,
  onCancel,
  onDelete,
  onSave,
  updating,
}: EditBenefitDialogFooterProps) {
  return (
    <div className="sticky bottom-0 z-10 flex shrink-0 flex-col gap-3 border-t border-[#DBDEE1] bg-white px-6 pt-4 pb-6">
      {errorMessage ? (
        <p className="w-full rounded-[6px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[13px] leading-5 text-[#B42318]">
          {errorMessage}
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-[9px]">
        <button
          className="flex h-[38px] items-center justify-center gap-[10px] rounded-[6px] border border-[#FFC4C4] bg-[#EF4444] px-[10px] text-[14px] leading-4 font-medium text-white disabled:cursor-not-allowed disabled:bg-[#FCA5A5]"
          disabled={deleting || updating}
          onClick={onDelete}
          type="button"
        >
          <Trash2 className="h-[18px] w-[18px]" />
          {deleting ? "Archiving..." : "Archive"}
        </button>
        <div className="flex items-center gap-[9px]">
          <button
            className="flex h-9 items-center justify-center rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] px-[10px] text-[14px] leading-4 font-normal text-black"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="flex h-9 items-center justify-center rounded-[6px] bg-black px-[10px] text-[14px] leading-4 font-normal text-white disabled:cursor-not-allowed disabled:bg-[#9CA3AF]"
            disabled={updating || deleting}
            onClick={onSave}
            type="button"
          >
            {updating ? "Submitting..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
