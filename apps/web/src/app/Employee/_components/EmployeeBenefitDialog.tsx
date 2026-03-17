"use client";
import {
  useEmployeeBenefitDialogQuery,
  useEmployeeBenefitRequestsQuery,
} from "@/shared/apollo/generated";
import EmployeeBenefitDialogLayout from "./EmployeeBenefitDialogLayout";
import EmployeeEligibleBenefitDialogContent from "./EmployeeEligibleBenefitDialogContent";
import EmployeePendingBenefitDialogContent from "./EmployeePendingBenefitDialogContent";
import { buildBenefitDialogRuleItems } from "./employee-benefit-dialog.helpers";
import { findPendingBenefitRequest } from "./employee-benefit-request.helpers";
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
    variables: { benefitId: card.id },
  });
  const { data: requestsData, error: requestsError, loading: requestsLoading } =
    useEmployeeBenefitRequestsQuery({
      fetchPolicy: "network-only",
      skip: !isPending,
      variables: { employeeId },
    });
  const contract = data?.benefitContract ?? null;
  const eligibilityItems = buildBenefitDialogRuleItems(card, data?.eligibilityRules ?? []);
  const pendingRequest = findPendingBenefitRequest(
    requestsData?.benefitRequests ?? [],
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
    errorMessage ?? error?.message ?? requestsError?.message ?? null;

  return (
    <EmployeeBenefitDialogLayout card={card} onClose={onClose}>
      {isPending ? (
        <EmployeePendingBenefitDialogContent
          cancelling={cancelling}
          contract={contract}
          contractLoading={contractLoading}
          errorMessage={resolvedErrorMessage}
          loading={loading}
          onCancel={() => void handleCancel()}
          onViewContract={() => void handleViewContract()}
          request={pendingRequest}
          requestLoading={requestsLoading}
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
