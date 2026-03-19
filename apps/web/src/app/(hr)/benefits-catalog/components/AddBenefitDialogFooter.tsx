type AddBenefitDialogFooterProps = {
  onCancel: () => void;
  onSave: () => void;
  saveDisabled: boolean;
  saving: boolean;
};

export default function AddBenefitDialogFooter({
  onCancel,
  onSave,
  saveDisabled,
  saving,
}: AddBenefitDialogFooterProps) {
  return (
    <div className="shrink-0 border-t border-[#E6EBF0] bg-white pt-4">
      <div className="flex w-full justify-end">
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
            disabled={saving || saveDisabled}
            onClick={onSave}
            type="button"
          >
            {saving ? "Saving..." : "Add Benefit"}
          </button>
        </div>
      </div>
    </div>
  );
}
