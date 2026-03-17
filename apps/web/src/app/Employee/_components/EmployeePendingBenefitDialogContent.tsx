import { Clock3 } from "lucide-react";

import type { EmployeeBenefitDialogQuery } from "@/shared/apollo/generated";

import EmployeeBenefitDialogContractSection from "./EmployeeBenefitDialogContractSection";
import EmployeeBenefitDialogEligibilitySection from "./EmployeeBenefitDialogEligibilitySection";
import EmployeeBenefitDialogTimelineSection from "./EmployeeBenefitDialogTimelineSection";
import {
  buildContractAgreementNote,
  buildPendingTimelineItems,
  type PendingBenefitRequest,
} from "./employee-benefit-request.helpers";
import type { BenefitDialogRuleItem } from "./employee-benefit-dialog.helpers";

type BenefitContract = NonNullable<EmployeeBenefitDialogQuery["benefitContract"]>;

type EmployeePendingBenefitDialogContentProps = {
  cancelling: boolean;
  contract: BenefitContract | null;
  contractLoading: boolean;
  errorMessage: string | null;
  loading: boolean;
  onCancel: () => void;
  onViewContract: () => void;
  request: PendingBenefitRequest | null;
  requestLoading: boolean;
  requiresContract: boolean;
  ruleItems: BenefitDialogRuleItem[];
};

export default function EmployeePendingBenefitDialogContent({
  cancelling,
  contract,
  contractLoading,
  errorMessage,
  loading,
  onCancel,
  onViewContract,
  request,
  requestLoading,
  requiresContract,
  ruleItems,
}: EmployeePendingBenefitDialogContentProps) {
  const timelineItems = buildPendingTimelineItems(request);
  const hasRequest = Boolean(request);

  return (
    <div className="flex flex-col gap-6">
      {requiresContract ? (
        <EmployeeBenefitDialogContractSection
          acceptedContract={Boolean(request?.contractAcceptedAt)}
          agreementDisabled
          agreementStatusNote={buildContractAgreementNote(request)}
          contract={contract}
          contractLoading={contractLoading}
          onViewContract={onViewContract}
        />
      ) : null}

      <EmployeeBenefitDialogEligibilitySection items={ruleItems} loading={loading} />

      {requestLoading ? (
        <p className="text-[13px] leading-5 text-[#64748B]">Loading request details...</p>
      ) : (
        <EmployeeBenefitDialogTimelineSection items={timelineItems} />
      )}

      {!requestLoading && !hasRequest ? (
        <p className="rounded-[8px] border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-[13px] leading-5 text-[#92400E]">
          The pending request details could not be found. Refresh and try again.
        </p>
      ) : null}

      {errorMessage ? (
        <p className="rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] leading-5 text-[#B91C1C]">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          className="inline-flex h-[38px] items-center justify-center rounded-[6px] border border-[#FFC4C4] bg-[#EF4444] px-6 text-[14px] font-medium leading-4 text-white disabled:cursor-not-allowed disabled:border-[#FECACA] disabled:bg-[#FCA5A5]"
          disabled={cancelling || !hasRequest}
          onClick={onCancel}
          type="button"
        >
          {cancelling ? "Cancelling..." : "Cancel Request"}
        </button>
        <button
          className="inline-flex h-9 items-center justify-center gap-3 rounded-[8px] border border-[#E5E5E5] bg-white px-4 text-[14px] leading-5 font-medium text-[#737373] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          disabled
          type="button"
        >
          <Clock3 className="h-4 w-4" />
          Request Pending
        </button>
      </div>
    </div>
  );
}
