import { Trash2 } from "lucide-react";

type EditBenefitDialogFooterProps = {
  archiveComment: string;
  archiveMode: boolean;
  deleting: boolean;
  errorMessage: string | null;
  onArchiveCancel: () => void;
  onArchiveCommentChange: (value: string) => void;
  onArchiveConfirm: () => void;
  onArchiveClick: () => void;
  onCancel: () => void;
  onSave: () => void;
  updating: boolean;
};

export default function EditBenefitDialogFooter({
  archiveComment,
  archiveMode,
  deleting,
  errorMessage,
  onArchiveCancel,
  onArchiveCommentChange,
  onArchiveConfirm,
  onArchiveClick,
  onCancel,
  onSave,
  updating,
}: EditBenefitDialogFooterProps) {
  return (
    <div className="flex shrink-0 flex-col gap-3 border-t border-[#DBDEE1] bg-white pt-4">
      {errorMessage ? (
        <p className="w-full rounded-[6px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[13px] leading-5 text-[#B42318]">
          {errorMessage}
        </p>
      ) : null}
      {archiveMode ? (
        <div className="flex flex-col gap-2">
          <label
            className="text-[13px] leading-5 font-medium text-[#0F172A]"
            htmlFor="benefit-archive-comment"
          >
            Archive comment
          </label>
          <textarea
            className="min-h-[96px] rounded-[10px] border border-[#CBD5E1] px-3 py-2 text-[14px] leading-5 text-[#0F172A] outline-none"
            id="benefit-archive-comment"
            onChange={(event) => onArchiveCommentChange(event.target.value)}
            placeholder="Explain why this benefit should be archived."
            value={archiveComment}
          />
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-[9px]">
        {archiveMode ? (
          <button
            className="flex h-[38px] items-center justify-center gap-[10px] rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] px-[10px] text-[14px] leading-4 font-medium text-black"
            disabled={deleting || updating}
            onClick={onArchiveCancel}
            type="button"
          >
            Back
          </button>
        ) : (
          <button
            className="flex h-[38px] items-center justify-center gap-[10px] rounded-[6px] border border-[#FFC4C4] bg-[#EF4444] px-[10px] text-[14px] leading-4 font-medium text-white disabled:cursor-not-allowed disabled:bg-[#FCA5A5]"
            disabled={deleting || updating}
            onClick={onArchiveClick}
            type="button"
          >
            <Trash2 className="h-[18px] w-[18px]" />
            Archive
          </button>
        )}
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
            disabled={updating || deleting || archiveMode}
            onClick={onSave}
            type="button"
          >
            {updating ? "Submitting..." : "Save Changes"}
          </button>
          {archiveMode ? (
            <button
              className="flex h-9 items-center justify-center rounded-[6px] border border-[#FFC4C4] bg-[#EF4444] px-[10px] text-[14px] leading-4 font-medium text-white disabled:cursor-not-allowed disabled:bg-[#FCA5A5]"
              disabled={deleting || updating}
              onClick={onArchiveConfirm}
              type="button"
            >
              {deleting ? "Archiving..." : "Confirm Archive"}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
