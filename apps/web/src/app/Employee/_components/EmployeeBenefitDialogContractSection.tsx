import { Eye, FileText } from "lucide-react";

import {
  formatContractPeriod,
  getContractFileName,
} from "./employee-benefit-dialog.helpers";

type EmployeeBenefitDialogContractSectionProps = {
  acceptedContract: boolean;
  agreementDisabled?: boolean;
  agreementStatusNote?: string | null;
  contract: {
    effectiveDate: string;
    expiryDate: string;
    r2ObjectKey: string;
    version: string;
  } | null;
  contractLoading: boolean;
  onAcceptedContractChange?: (accepted: boolean) => void;
  onViewContract: () => void;
  showAgreement?: boolean;
};

export default function EmployeeBenefitDialogContractSection({
  acceptedContract,
  agreementDisabled = false,
  agreementStatusNote,
  contract,
  contractLoading,
  onAcceptedContractChange,
  onViewContract,
  showAgreement = true,
}: EmployeeBenefitDialogContractSectionProps) {
  return (
    <>
      <div className="rounded-[12px] border border-[#CBD5E1] bg-[rgba(245,245,245,0.3)] p-6">
        <p className="text-[14px] leading-5 font-medium text-[#737373]">
          Current Contract
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#E5E5E5] bg-white">
              <FileText className="h-6 w-6 text-[#737373]" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[14px] leading-5 font-medium text-[#0A0A0A]">
                {contract ? getContractFileName(contract.r2ObjectKey) : "No active contract"}
              </p>
              {contract ? (
                <p className="text-[12px] leading-4 text-[#737373]">
                  Version {contract.version} •{" "}
                  {formatContractPeriod(contract.effectiveDate, contract.expiryDate)}
                </p>
              ) : null}
            </div>
          </div>
          <button
            className="inline-flex h-8 items-center justify-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-white px-4 text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:bg-[#F5F5F5] disabled:text-[#A3A3A3]"
            disabled={contractLoading || !contract}
            onClick={onViewContract}
            type="button"
          >
            <Eye className="h-4 w-4" />
            {contractLoading ? "Loading..." : "View"}
          </button>
        </div>
      </div>

      {showAgreement ? (
        <label
          className={[
            "flex items-start gap-3",
            agreementDisabled ? "cursor-not-allowed" : "",
          ].join(" ")}
        >
          <input
            checked={acceptedContract}
            className="mt-0.5 h-4 w-4 rounded-[2px] border border-[#D1D5DB] accent-black disabled:cursor-not-allowed disabled:opacity-100"
            disabled={agreementDisabled}
            onChange={(event) => onAcceptedContractChange?.(event.target.checked)}
            type="checkbox"
          />
          <span className="flex flex-col gap-1">
            <span className="text-[14px] leading-[14px] font-medium text-black">
              Contract Agreement
            </span>
            <span className="text-[12px] leading-4 text-[#737373]">
              I confirm that I have read and accept the contract terms.
            </span>
            {agreementStatusNote ? (
              <span className="text-[12px] leading-4 text-[#737373]">
                {agreementStatusNote}
              </span>
            ) : null}
          </span>
        </label>
      ) : null}
    </>
  );
}
