"use client";
import {
  useEmployeeBenefitDialogQuery,
} from "@/shared/apollo/generated";
import EmployeeActiveBenefitDialogContent from "./EmployeeActiveBenefitDialogContent";
import EmployeeBenefitDialogLayout from "./EmployeeBenefitDialogLayout";
import EmployeeEligibleBenefitDialogContent from "./EmployeeEligibleBenefitDialogContent";
import EmployeeLockedBenefitDialogContent from "./EmployeeLockedBenefitDialogContent";
import EmployeePendingBenefitDialogContent from "./EmployeePendingBenefitDialogContent";
import { buildBenefitDialogRuleItems } from "./employee-benefit-dialog.helpers";
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
  const isActive = card.status === "Active";
  const isPending = card.status === "Pending";
  const isLocked = card.status === "Locked";
  const { data, error, loading } = useEmployeeBenefitDialogQuery({
    fetchPolicy: "network-only",
    variables: { benefitId: card.id, employeeId },
  });
  const contract = data?.benefitContract ?? null;
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
  const isSubmitDisabled = loading || submitting || (card.requiresContract && !acceptedContract);

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
          request={pendingRequest}
          requestLoading={loading}
          requiresContract={card.requiresContract}
          ruleItems={eligibilityItems}
        />
      ) : isLocked ? (
        <EmployeeLockedBenefitDialogContent
          contract={contract}
          contractLoading={contractLoading}
          errorMessage={resolvedErrorMessage}
          loading={loading}
          onViewContract={() => void handleViewContract()}
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
          requiresContract={card.requiresContract}
          ruleItems={eligibilityItems}
          submitting={submitting}
        />
      )}
    </EmployeeBenefitDialogLayout>
  );
}
