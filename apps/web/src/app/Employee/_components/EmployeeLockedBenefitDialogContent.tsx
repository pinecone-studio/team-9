import type { EmployeeBenefitDialogQuery } from "@/shared/apollo/generated";

import EmployeeBenefitDialogContractSection from "./EmployeeBenefitDialogContractSection";
import EmployeeBenefitDialogEligibilitySection from "./EmployeeBenefitDialogEligibilitySection";
import type { BenefitDialogRuleItem } from "./employee-benefit-dialog.helpers";

type BenefitContract = NonNullable<EmployeeBenefitDialogQuery["benefitContract"]>;

type EmployeeLockedBenefitDialogContentProps = {
  contract: BenefitContract | null;
  contractLoading: boolean;
  errorMessage: string | null;
  loading: boolean;
  onViewContract: () => void;
  overrideMessage: string | null;
  contractStatusMessage?: string | null;
  requiresContract: boolean;
  ruleItems: BenefitDialogRuleItem[];
};

export default function EmployeeLockedBenefitDialogContent({
  contract,
  contractLoading,
  errorMessage,
  loading,
  onViewContract,
  overrideMessage,
  contractStatusMessage = null,
  requiresContract,
  ruleItems,
}: EmployeeLockedBenefitDialogContentProps) {
  return (
    <div className="flex flex-col gap-6">
      {requiresContract ? (
        <EmployeeBenefitDialogContractSection
          acceptedContract={false}
          contract={contract}
          contractLoading={contractLoading}
          onViewContract={onViewContract}
          showAgreement={false}
        />
      ) : null}

      <EmployeeBenefitDialogEligibilitySection
        items={ruleItems}
        loading={loading}
        overrideMessage={overrideMessage}
      />

      {contractStatusMessage ? (
        <p className="rounded-[8px] border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-[13px] leading-5 text-[#92400E]">
          {contractStatusMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] leading-5 text-[#B91C1C]">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          className="inline-flex h-9 items-center justify-center gap-3 rounded-[8px] border border-[#E5E5E5] bg-white px-4 text-[14px] leading-5 font-medium text-[#737373] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          disabled
          type="button"
        >
          Locked
        </button>
      </div>
    </div>
  );
}
