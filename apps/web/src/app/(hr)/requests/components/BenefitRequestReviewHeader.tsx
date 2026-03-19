import { X } from "lucide-react";

export default function BenefitRequestReviewHeader({
  isPending,
  onClose,
}: {
  isPending: boolean;
  onClose: () => void;
}) {
  return (
    <div className="relative px-6 pb-0 pt-6">
      <div className="flex w-full flex-col items-start gap-2 pr-10">
        <h2 className="w-full text-[18px] leading-7 font-semibold text-[#0F172A]">
          Review Request
        </h2>
        <p className="w-full text-[14px] leading-5 text-[#64748B]">
          {isPending
            ? "Review and approve or reject this benefit request."
            : "This request has already been reviewed. See the details and audit history below."}
        </p>
      </div>
      <button
        aria-label="Close dialog"
        className="absolute right-[11px] top-[13px] flex h-6 w-6 items-center justify-center text-[#0A0A0A]"
        onClick={onClose}
        type="button"
      >
        <X className="h-5 w-5 stroke-[1.75]" />
      </button>
    </div>
  );
}
