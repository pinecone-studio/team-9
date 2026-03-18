import type { ContractStatus } from "./contracts-content.helpers";

export default function ContractsStatusBadge({ status }: { status: ContractStatus }) {
  if (status === "active") {
    return (
      <span className="inline-flex h-[22px] min-w-[54px] items-center justify-center rounded-[8px] bg-[#DCFCE7] px-2 text-[12px] leading-4 font-medium text-[#016630]">
        Active
      </span>
    );
  }

  if (status === "expiring") {
    return (
      <span className="inline-flex h-[22px] min-w-[96px] items-center justify-center rounded-[8px] bg-[#FEF3C6] px-2 text-[12px] leading-4 font-medium text-[#973C00]">
        Expiring Soon
      </span>
    );
  }

  if (status === "expired") {
    return (
      <span className="inline-flex h-[22px] min-w-[61px] items-center justify-center rounded-[8px] bg-[#E7000B] px-2 text-[12px] leading-4 font-medium text-white">
        Expired
      </span>
    );
  }

  return (
    <span className="inline-flex h-[22px] min-w-[68px] items-center justify-center rounded-[8px] bg-[#F5F5F5] px-2 text-[12px] leading-4 font-medium text-[#171717]">
      Archived
    </span>
  );
}
