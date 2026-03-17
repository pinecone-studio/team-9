import type { EmployeeBenefitDialogQuery } from "@/shared/apollo/generated";

import EmployeeBenefitDialogContractSection from "./EmployeeBenefitDialogContractSection";
import EmployeeBenefitDialogEligibilitySection from "./EmployeeBenefitDialogEligibilitySection";
import type { BenefitDialogRuleItem } from "./employee-benefit-dialog.helpers";

type BenefitContract = NonNullable<EmployeeBenefitDialogQuery["benefitContract"]>;

type EmployeeEligibleBenefitDialogContentProps = {
  acceptedContract: boolean;
  contract: BenefitContract | null;
  contractLoading: boolean;
  errorMessage: string | null;
  isSubmitDisabled: boolean;
  loading: boolean;
  onAcceptedContractChange: (accepted: boolean) => void;
  onSubmit: () => void;
  onViewContract: () => void;
  requiresContract: boolean;
  ruleItems: BenefitDialogRuleItem[];
  submitting: boolean;
};

export default function EmployeeEligibleBenefitDialogContent({
  acceptedContract,
  contract,
  contractLoading,
  errorMessage,
  isSubmitDisabled,
  loading,
  onAcceptedContractChange,
  onSubmit,
  onViewContract,
  requiresContract,
  ruleItems,
  submitting,
}: EmployeeEligibleBenefitDialogContentProps) {
  return (
    <div className="flex flex-col gap-6">
      {requiresContract ? (
        <EmployeeBenefitDialogContractSection
          acceptedContract={acceptedContract}
          contract={contract}
          contractLoading={contractLoading}
          onAcceptedContractChange={onAcceptedContractChange}
          onViewContract={onViewContract}
        />
      ) : null}

      <EmployeeBenefitDialogEligibilitySection items={ruleItems} loading={loading} />

      {errorMessage ? (
        <p className="rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] leading-5 text-[#B91C1C]">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          className="inline-flex h-10 items-center justify-center rounded-[8px] bg-black px-5 text-[14px] leading-5 font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:bg-[#A3A3A3]"
          disabled={isSubmitDisabled}
          onClick={onSubmit}
          type="button"
        >
          {submitting ? "Submitting..." : "Request Benefit"}
        </button>
      </div>
    </div>
  );
}
