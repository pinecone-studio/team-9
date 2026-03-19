import { X } from "lucide-react";

export default function BenefitRequestReviewHeader({
  isPending,
  onClose,
}: {
  isPending: boolean;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between px-8 pt-8">
      <div className="flex w-full flex-col items-start gap-3">
        <h2 className="w-full text-[20px] leading-8 font-semibold text-[#0F172A]">
          Review Request
        </h2>
        <p className="w-full text-[15px] leading-6 text-[#64748B]">
          {isPending
            ? "Review and approve or reject this benefit request."
            : "This request has already been reviewed. See the details and audit history below."}
        </p>
      </div>
      <button className="rounded-[8px] p-2 text-[#0A0A0A]" onClick={onClose} type="button">
        <X className="h-6 w-6" />
      </button>
    </div>
  );
}
