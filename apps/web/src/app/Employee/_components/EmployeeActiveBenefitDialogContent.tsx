import type { EmployeeBenefitDialogQuery } from "@/shared/apollo/generated";

import EmployeeBenefitDialogContractSection from "./EmployeeBenefitDialogContractSection";
import EmployeeBenefitDialogEligibilitySection from "./EmployeeBenefitDialogEligibilitySection";
import EmployeeBenefitDialogTimelineSection from "./EmployeeBenefitDialogTimelineSection";
import {
  buildActiveTimelineItems,
  buildContractAgreementNote,
  type ActiveBenefitRequest,
} from "./employee-benefit-request.helpers";
import {
  buildContractDateItems,
  type BenefitDialogRuleItem,
} from "./employee-benefit-dialog.helpers";

type BenefitContract = NonNullable<EmployeeBenefitDialogQuery["benefitContract"]>;

type EmployeeActiveBenefitDialogContentProps = {
  contract: BenefitContract | null;
  contractLoading: boolean;
  errorMessage: string | null;
  loading: boolean;
  onViewContract: () => void;
  overrideMessage: string | null;
  request: ActiveBenefitRequest | null;
  requiresContract: boolean;
  ruleItems: BenefitDialogRuleItem[];
};

export default function EmployeeActiveBenefitDialogContent({
  contract,
  contractLoading,
  errorMessage,
  loading,
  onViewContract,
  overrideMessage,
  request,
  requiresContract,
  ruleItems,
}: EmployeeActiveBenefitDialogContentProps) {
  const timelineItems = buildActiveTimelineItems(request);
  const contractDateItems = buildContractDateItems(contract);

  return (
    <div className="flex flex-col gap-6">
      {requiresContract ? (
        <EmployeeBenefitDialogContractSection
          acceptedContract
          agreementDisabled
          agreementStatusNote={buildContractAgreementNote(
            request,
            "Confirmed when this benefit became active.",
          )}
          contract={contract}
          contractLoading={contractLoading}
          onViewContract={onViewContract}
        />
      ) : null}

      <EmployeeBenefitDialogEligibilitySection
        items={ruleItems}
        loading={loading}
        overrideMessage={overrideMessage}
      />

      {loading ? (
        <p className="text-[13px] leading-5 text-[#64748B]">
          {requiresContract ? "Loading contract dates..." : "Loading activation history..."}
        </p>
      ) : requiresContract ? (
        contractDateItems.length > 0 ? (
          <EmployeeBenefitDialogTimelineSection
            items={contractDateItems}
            title="Contract Dates"
          />
        ) : (
          <p className="rounded-[8px] border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-[13px] leading-5 text-[#92400E]">
            Contract dates could not be found for this benefit.
          </p>
        )
      ) : timelineItems.length > 0 ? (
        <EmployeeBenefitDialogTimelineSection items={timelineItems} />
      ) : (
        <p className="rounded-[8px] border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-[13px] leading-5 text-[#92400E]">
          Activation history could not be found for this benefit.
        </p>
      )}

      {errorMessage ? (
        <p className="rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] leading-5 text-[#B91C1C]">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
