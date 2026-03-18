import { X } from "lucide-react";

export default function BenefitRequestReviewHeader({
  isPending,
  onClose,
}: {
  isPending: boolean;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between px-6 pt-6">
      <div className="flex w-full flex-col items-start gap-2">
        <h2 className="w-full text-[18px] leading-7 font-semibold text-[#0F172A]">
          Review Request
        </h2>
        <p className="w-full text-[14px] leading-5 text-[#64748B]">
          {isPending
            ? "Review and approve or reject this benefit request."
            : "This request has already been reviewed. See the details and audit history below."}
        </p>
      </div>
      <button className="rounded-[8px] p-2 text-[#475569]" onClick={onClose} type="button">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
