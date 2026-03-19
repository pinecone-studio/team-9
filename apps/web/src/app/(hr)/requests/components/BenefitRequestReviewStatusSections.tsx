import { Clock3, FileText } from "lucide-react";

import type { BenefitRequestRecord } from "./benefit-requests.graphql";

export function BenefitRequestContractSection({
  acceptedAt,
  contractError,
  contractLoading,
  contractVersion,
  onViewContract,
  statusLabel,
}: {
  acceptedAt: string;
  contractError: string | null;
  contractLoading: boolean;
  contractVersion: string;
  onViewContract: () => void;
  statusLabel: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Contract</h3>
      <div className="rounded-[10px] border border-[#E5E5E5] p-3">
        <div className="space-y-4">
          <ContractRow label="Status" value={statusLabel} valueClassName={statusLabel === "Accepted" ? "font-medium text-[#00A63E]" : "font-medium text-[#973C00]"} />
          <ContractRow label="Version" value={contractVersion} valueClassName="font-medium text-[#0A0A0A]" />
          <ContractRow
            className="border-b border-[#E5E5E5] pb-4"
            label="Accepted at"
            value={acceptedAt}
            valueClassName="text-[#0A0A0A]"
          />
          <button
            className="flex h-8 w-full items-center justify-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
            disabled={contractLoading}
            onClick={onViewContract}
            type="button"
          >
            <FileText className="h-4 w-4" />
            {contractLoading ? "Opening..." : "View Contract"}
          </button>
          {contractError ? (
            <p className="text-[12px] leading-4 text-[#B42318]">{contractError}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ContractRow({
  className = "",
  label,
  value,
  valueClassName,
}: {
  className?: string;
  label: string;
  value: string;
  valueClassName: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 text-[14px] leading-5 ${className}`.trim()}>
      <span className="text-[#737373]">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}

export function BenefitRequestApprovalProgressSection({ approvalRoute }: { approvalRoute: string }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Approval Progress</h3>
      <div className="flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FEF3C6]">
          <Clock3 className="h-[14px] w-[14px] text-[#BB4D00]" />
        </div>
        <span className="text-[14px] leading-5 text-[#737373]">{`Awaiting ${approvalRoute}`}</span>
      </div>
    </section>
  );
}

export function BenefitRequestReviewedBanner({
  reviewedBy,
  status,
}: {
  reviewedBy: string;
  status: BenefitRequestRecord["status"];
}) {
  return (
    <div className="px-8 pb-8 pt-2">
      <div className="text-center text-[14px] leading-6 font-medium text-[#00A63E]">
        {status === "approved"
          ? `This request accepted by ${reviewedBy}.`
          : `This request rejected by ${reviewedBy}.`}
      </div>
    </div>
  );
}
