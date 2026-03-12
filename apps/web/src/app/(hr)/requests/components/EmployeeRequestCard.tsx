import { CheckCircle2, CircleX } from "lucide-react";

type EmployeeRequestCardProps = {
  benefit: string;
  initials: string;
  name: string;
  status?: "pending" | "processed" | "rejected";
  submittedLabel: string;
};

export default function EmployeeRequestCard({
  benefit,
  initials,
  name,
  status = "pending",
  submittedLabel,
}: EmployeeRequestCardProps) {
  const isProcessed = status === "processed";
  const isRejected = status === "rejected";

  return (
    <section className="mx-auto flex h-[124px] w-full max-w-[1300px] items-center justify-between rounded-[8px] bg-white px-[10px] py-[30px]">
      <div className="flex items-center gap-[15px]">
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[24px] bg-[#CBE2F4]">
          <span className="text-[14px] leading-[17px] font-medium text-black">
            {initials}
          </span>
        </div>

        <div className="flex h-[54px] w-[166px] flex-col items-start gap-[5px]">
          <span className="w-full text-[14px] leading-[17px] font-medium text-black">
            {name}
          </span>
          <span className="w-full text-[12px] leading-[15px] font-normal tracking-[-0.01em] text-[#555555]">
            Requesting:{benefit}
          </span>
          <span className="w-full text-[10px] leading-3 font-normal tracking-[-0.01em] text-[rgba(85,85,85,0.33)]">
            {submittedLabel}
          </span>
        </div>
      </div>

      {isProcessed ? (
        <div className="flex h-[21px] items-end gap-[7px] rounded-[8px] bg-[#008E00] px-2 py-[3px]">
          <CheckCircle2 className="h-[14px] w-[14px] text-white" />
          <span className="text-[12px] leading-[15px] font-medium text-white">
            Approved
          </span>
        </div>
      ) : isRejected ? (
        <div className="flex h-[21px] items-end gap-[7px] rounded-[8px] bg-[#E90012] px-2 py-[3px]">
          <CircleX className="h-[14px] w-[14px] text-white" />
          <span className="text-[12px] leading-[15px] font-medium text-white">
            Rejected
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-[9px]">
          <button
            className="flex h-[26px] items-end gap-[7px] rounded-[8px] border border-[#E0E1E4] bg-white px-2 py-[5px]"
            type="button"
          >
            <CircleX className="h-4 w-4 text-[#E90012]" />
            <span className="text-[12px] leading-[15px] font-medium text-[#E90012]">
              Reject
            </span>
          </button>

          <button
            className="flex h-[26px] items-end gap-[7px] rounded-[8px] bg-[#008E00] px-2 py-[5px]"
            type="button"
          >
            <CheckCircle2 className="h-4 w-4 text-white" />
            <span className="text-[12px] leading-[15px] font-medium text-white">
              Approve
            </span>
          </button>
        </div>
      )}
    </section>
  );
}
