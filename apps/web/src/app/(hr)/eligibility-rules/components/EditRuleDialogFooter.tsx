import { Trash2 } from "lucide-react";

type EditRuleDialogFooterProps = {
  deleteComment: string;
  deleteMode: boolean;
  onCancel: () => void;
  onDeleteCommentChange: (value: string) => void;
  onDeleteCancel: () => void;
  onDeleteClick: () => void;
  onDeleteConfirm: () => void;
  onSave: () => void;
  saveDisabled: boolean;
  submitting: boolean;
};

export default function EditRuleDialogFooter({
  deleteComment,
  deleteMode,
  onCancel,
  onDeleteCommentChange,
  onDeleteCancel,
  onDeleteClick,
  onDeleteConfirm,
  onSave,
  saveDisabled,
  submitting,
}: EditRuleDialogFooterProps) {
  if (deleteMode) {
    return (
      <div className="flex shrink-0 flex-col gap-3 border-t border-[#DBDEE1] bg-white pt-4">
        <div className="flex flex-col gap-2">
          <label
            className="text-[13px] leading-5 font-medium text-[#0F172A]"
            htmlFor="rule-delete-comment"
          >
            Archive comment
          </label>
          <textarea
            className="min-h-[96px] rounded-[10px] border border-[#CBD5E1] px-3 py-2 text-[14px] leading-5 text-[#0F172A] outline-none"
            id="rule-delete-comment"
            onChange={(event) => onDeleteCommentChange(event.target.value)}
            placeholder="Explain why this rule should be archived."
            value={deleteComment}
          />
        </div>
        <div className="flex w-full items-center justify-between gap-[9px]">
          <button
            className="flex h-9 items-center justify-center rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] px-[10px] text-[14px] leading-4 font-normal text-black"
            disabled={submitting}
            onClick={onDeleteCancel}
            type="button"
          >
            Back
          </button>
          <button
            className="flex h-9 items-center justify-center rounded-[6px] border border-[#FFC4C4] bg-[#EF4444] px-[10px] text-[14px] leading-4 font-medium text-white disabled:cursor-not-allowed disabled:bg-[#FCA5A5]"
            disabled={submitting}
            onClick={onDeleteConfirm}
            type="button"
          >
            Confirm Archive
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center justify-between gap-[9px] border-t border-[#DBDEE1] bg-white pt-4">
      <button
        className="flex h-[38px] items-center gap-[10px] rounded-[6px] border border-[#FFC4C4] bg-[#EF4444] px-[10px] text-white"
        disabled={submitting}
        onClick={onDeleteClick}
        type="button"
      >
        <Trash2 className="h-[18px] w-[18px]" />
        <span className="text-[14px] leading-4 font-medium">Archive</span>
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
          className="flex h-9 items-center justify-center rounded-[6px] bg-black px-[10px] text-[14px] leading-4 font-normal text-white"
          disabled={saveDisabled}
          onClick={onSave}
          type="button"
        >
          {submitting ? "Submitting..." : "Submit Update"}
        </button>
      </div>
    </div>
  );
}
