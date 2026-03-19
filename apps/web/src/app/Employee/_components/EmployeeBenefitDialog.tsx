"use client";
import {
  useEmployeeBenefitDialogQuery,
} from "@/shared/apollo/generated";
import EmployeeActiveBenefitDialogContent from "./EmployeeActiveBenefitDialogContent";
import EmployeeBenefitDialogLayout from "./EmployeeBenefitDialogLayout";
import EmployeeEligibleBenefitDialogContent from "./EmployeeEligibleBenefitDialogContent";
import EmployeeLockedBenefitDialogContent from "./EmployeeLockedBenefitDialogContent";
import EmployeePendingBenefitDialogContent from "./EmployeePendingBenefitDialogContent";
import {
  buildExpiredContractMessage,
  isContractExpired,
} from "./employee-benefit-contract.helpers";
import {
  buildBenefitDialogRuleItems,
} from "./employee-benefit-dialog.helpers";
import {
  findApprovedBenefitRequest,
  findPendingBenefitRequest,
} from "./employee-benefit-request.helpers";
import type { EmployeeBenefitCard } from "./employee-types";
import { useEmployeeBenefitDialogActions } from "./useEmployeeBenefitDialogActions";

type EmployeeBenefitDialogProps = {
  card: EmployeeBenefitCard;
  currentUserIdentifier: string;
  employeeId: string;
  onClose: () => void;
  onSubmitted: () => Promise<unknown> | void;
};

export default function EmployeeBenefitDialog({
  card,
  currentUserIdentifier,
  employeeId,
  onClose,
  onSubmitted,
}: EmployeeBenefitDialogProps) {
  const isPending = card.status === "Pending";
  const { data, error, loading } = useEmployeeBenefitDialogQuery({
    fetchPolicy: "network-only",
    variables: { benefitId: card.id, employeeId },
  });
  const contract = data?.benefitContract ?? null;
  const hasExpiredContract =
    !isPending &&
    card.requiresContract &&
    isContractExpired(contract?.expiryDate);
  const isActive = card.status === "Active" && !hasExpiredContract;
  const isLocked = card.status === "Locked" || hasExpiredContract;
  const contractStatusMessage = hasExpiredContract
    ? buildExpiredContractMessage(contract?.expiryDate)
    : null;
  const eligibilityItems = buildBenefitDialogRuleItems(card, data?.eligibilityRules ?? []);
  const benefitRequests = data?.benefitRequests ?? [];
  const approvedRequest = findApprovedBenefitRequest(benefitRequests, card.id);
  const pendingRequest = findPendingBenefitRequest(
    benefitRequests,
    card.id,
  );
  const {
    acceptedContract,
    cancelling,
    contractLoading,
    errorMessage,
    handleCancel,
    handleSubmit,
    handleViewContract,
    setAcceptedContract,
    submitting,
  } = useEmployeeBenefitDialogActions({
    card,
    contract,
    currentUserIdentifier,
    employeeId,
    onClose,
    onSubmitted,
    pendingRequest,
  });
  const isSubmitDisabled =
    loading ||
    submitting ||
    hasExpiredContract ||
    (card.requiresContract && !acceptedContract);
  const overrideMessage = card.isOverridden
    ? card.overrideReason?.trim() ||
      (card.passed
        ? `Eligibility rules currently show ${card.passed.replace(" before override", "")}. Access remains available because HR applied a manual override.`
        : "Access remains available because HR applied a manual override.")
    : null;

  const resolvedErrorMessage =
    errorMessage ?? error?.message ?? null;

  return (
    <EmployeeBenefitDialogLayout card={card} onClose={onClose}>
      {isActive ? (
        <EmployeeActiveBenefitDialogContent
          contract={contract}
          contractLoading={contractLoading}
          errorMessage={resolvedErrorMessage}
          loading={loading}
          onViewContract={() => void handleViewContract()}
          overrideMessage={overrideMessage}
          request={approvedRequest}
          requiresContract={card.requiresContract}
          ruleItems={eligibilityItems}
        />
      ) : isPending ? (
        <EmployeePendingBenefitDialogContent
          cancelling={cancelling}
          contract={contract}
          contractLoading={contractLoading}
          errorMessage={resolvedErrorMessage}
          loading={loading}
          onCancel={() => void handleCancel()}
          onViewContract={() => void handleViewContract()}
          overrideMessage={overrideMessage}
          request={pendingRequest}
          requestLoading={loading}
          requiresContract={card.requiresContract}
          ruleItems={eligibilityItems}
        />
      ) : isLocked ? (
        <EmployeeLockedBenefitDialogContent
          contract={contract}
          contractLoading={contractLoading}
          contractStatusMessage={contractStatusMessage}
          errorMessage={resolvedErrorMessage}
          loading={loading}
          onViewContract={() => void handleViewContract()}
          overrideMessage={overrideMessage}
          requiresContract={card.requiresContract}
          ruleItems={eligibilityItems}
        />
      ) : (
        <EmployeeEligibleBenefitDialogContent
          acceptedContract={acceptedContract}
          contract={contract}
          contractLoading={contractLoading}
          errorMessage={resolvedErrorMessage}
          isSubmitDisabled={isSubmitDisabled}
          loading={loading}
          onAcceptedContractChange={setAcceptedContract}
          onSubmit={() => void handleSubmit()}
          onViewContract={() => void handleViewContract()}
          overrideMessage={overrideMessage}
          requiresContract={card.requiresContract}
          ruleItems={eligibilityItems}
          submitting={submitting}
        />
      )}
    </EmployeeBenefitDialogLayout>
  );
}
