import type { EmployeeBenefitDialogQuery } from "@/shared/apollo/generated";

import EmployeeBenefitDialogContractSection from "./EmployeeBenefitDialogContractSection";
import EmployeeBenefitDialogEligibilitySection from "./EmployeeBenefitDialogEligibilitySection";
import EmployeeBenefitDialogTimelineSection from "./EmployeeBenefitDialogTimelineSection";
import type { BenefitDialogRuleItem } from "./employee-benefit-dialog.helpers";
import type { BenefitTimelineItem } from "./employee-benefit-request.helpers";
import type { EmployeeRequestItem } from "./employee-types";

type BenefitContract = NonNullable<EmployeeBenefitDialogQuery["benefitContract"]>;

type EmployeeResolvedBenefitDialogContentProps = {
  acceptedContract: boolean;
  agreementDisabled: boolean;
  agreementStatusNote: string | null;
  contract: BenefitContract | null;
  contractLoading: boolean;
  errorMessage: string | null;
  loading: boolean;
  onAcceptedContractChange: (accepted: boolean) => void;
  onResubmit: () => void;
  onViewContract: () => void;
  overrideMessage: string | null;
  reviewComment: string | null;
  requiresContract: boolean;
  ruleItems: BenefitDialogRuleItem[];
  status: Extract<EmployeeRequestItem["status"], "Cancelled" | "Rejected">;
  submitting: boolean;
  timelineItems: BenefitTimelineItem[];
};

export default function EmployeeResolvedBenefitDialogContent({
  acceptedContract,
  agreementDisabled,
  agreementStatusNote,
  contract,
  contractLoading,
  errorMessage,
  loading,
  onAcceptedContractChange,
  onResubmit,
  onViewContract,
  overrideMessage,
  reviewComment,
  requiresContract,
  ruleItems,
  status,
  submitting,
  timelineItems,
}: EmployeeResolvedBenefitDialogContentProps) {
  const decisionNotes =
    reviewComment?.trim() ||
    (status === "Rejected"
      ? "No decision notes were provided for this request."
      : null);
  const buttonLabel =
    status === "Rejected" ? "Send Request again" : "Submit Request again";

  return (
    <div className="flex flex-col gap-6">
      {requiresContract ? (
        <EmployeeBenefitDialogContractSection
          acceptedContract={acceptedContract}
          agreementDisabled={agreementDisabled}
          agreementStatusNote={agreementStatusNote}
          contract={contract}
          contractLoading={contractLoading}
          onAcceptedContractChange={onAcceptedContractChange}
          onViewContract={onViewContract}
        />
      ) : null}

      <EmployeeBenefitDialogEligibilitySection
        items={ruleItems}
        loading={loading}
        overrideMessage={overrideMessage}
      />

      <EmployeeBenefitDialogTimelineSection items={timelineItems} />

      {decisionNotes ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
            Decision Notes
          </h3>
          <div className="min-h-16 rounded-[8px] border border-[#E5E5E5] bg-white px-3 py-2 text-[14px] leading-7 text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            {decisionNotes}
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <p className="rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] leading-5 text-[#B91C1C]">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          className="inline-flex h-10 items-center justify-center rounded-[8px] bg-black px-5 text-[14px] leading-5 font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:bg-[#A3A3A3]"
          disabled={submitting || (requiresContract && !acceptedContract)}
          onClick={onResubmit}
          type="button"
        >
          {submitting ? "Submitting..." : buttonLabel}
        </button>
      </div>
    </div>
  );
}
