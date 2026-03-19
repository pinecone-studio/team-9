"use client";

import { useEmployeeBenefitDialogQuery } from "@/shared/apollo/generated";

import EmployeeActiveBenefitDialogContent from "./EmployeeActiveBenefitDialogContent";
import EmployeeBenefitDialogLayout from "./EmployeeBenefitDialogLayout";
import EmployeeLockedBenefitDialogContent from "./EmployeeLockedBenefitDialogContent";
import EmployeePendingBenefitDialogContent from "./EmployeePendingBenefitDialogContent";
import EmployeeResolvedBenefitDialogContent from "./EmployeeResolvedBenefitDialogContent";
import {
  buildExpiredContractMessage,
  isContractExpired,
} from "./employee-benefit-contract.helpers";
import {
  buildBenefitDialogRuleItems,
} from "./employee-benefit-dialog.helpers";
import {
  buildContractAgreementNote,
  findBenefitRequestById,
} from "./employee-benefit-request.helpers";
import { getRequestDialogBadge, buildHistoricalTimelineItems } from "./employee-request-dialog.helpers";
import type { EmployeeRequestItem } from "./employee-types";
import { useEmployeeBenefitDialogActions } from "./useEmployeeBenefitDialogActions";

type EmployeeRequestDialogProps = {
  currentUserIdentifier: string;
  employeeId: string;
  onClose: () => void;
  onSubmitted: () => Promise<unknown> | void;
  request: EmployeeRequestItem;
};

export default function EmployeeRequestDialog({
  currentUserIdentifier,
  employeeId,
  onClose,
  onSubmitted,
  request,
}: EmployeeRequestDialogProps) {
  const card = request.dialogCard;
  const { data, error, loading } = useEmployeeBenefitDialogQuery({
    fetchPolicy: "network-only",
    variables: { benefitId: card.id, employeeId },
  });
  const contract = data?.benefitContract ?? null;
  const currentRequest =
    findBenefitRequestById(data?.benefitRequests ?? [], request.id) ?? request.request;
  const requiresContract = card.requiresContract;
  const hasExpiredContract =
    request.status === "Accepted" &&
    requiresContract &&
    isContractExpired(contract?.expiryDate);
  const contractStatusMessage = hasExpiredContract
    ? buildExpiredContractMessage(contract?.expiryDate)
    : null;
  const hasReusableAgreement =
    requiresContract &&
    Boolean(currentRequest.contractAcceptedAt) &&
    (!contract || currentRequest.contractVersionAccepted === contract.version);
  const agreementStatusNote = requiresContract
    ? hasReusableAgreement
      ? buildContractAgreementNote(currentRequest)
      : "Please review and accept the latest contract before sending this request again."
    : null;
  const ruleItems = buildBenefitDialogRuleItems(card, data?.eligibilityRules ?? []);
  const overrideMessage = card.isOverridden
    ? card.overrideReason?.trim() ||
      (card.passed
        ? `Eligibility rules currently show ${card.passed.replace(" before override", "")}. Access remains available because HR applied a manual override.`
        : "Access remains available because HR applied a manual override.")
    : null;
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
    initialAcceptedContract: hasReusableAgreement,
    onClose,
    onSubmitted,
    pendingRequest: request.status === "Pending" ? currentRequest : null,
  });
  const resolvedErrorMessage = errorMessage ?? error?.message ?? null;

  return (
    <EmployeeBenefitDialogLayout
      card={card}
      onClose={onClose}
      statusBadge={getRequestDialogBadge(request.status)}
    >
      {request.status === "Accepted" && hasExpiredContract ? (
        <EmployeeLockedBenefitDialogContent
          contract={contract}
          contractLoading={contractLoading}
          contractStatusMessage={contractStatusMessage}
          errorMessage={resolvedErrorMessage}
          loading={loading}
          onViewContract={() => void handleViewContract()}
          overrideMessage={overrideMessage}
          requiresContract={requiresContract}
          ruleItems={ruleItems}
        />
      ) : request.status === "Accepted" ? (
        <EmployeeActiveBenefitDialogContent
          contract={contract}
          contractLoading={contractLoading}
          errorMessage={resolvedErrorMessage}
          loading={loading}
          onViewContract={() => void handleViewContract()}
          overrideMessage={overrideMessage}
          request={currentRequest}
          requiresContract={requiresContract}
          ruleItems={ruleItems}
        />
      ) : request.status === "Pending" ? (
        <EmployeePendingBenefitDialogContent
          cancelling={cancelling}
          contract={contract}
          contractLoading={contractLoading}
          errorMessage={resolvedErrorMessage}
          loading={loading}
          onCancel={() => void handleCancel()}
          onViewContract={() => void handleViewContract()}
          overrideMessage={overrideMessage}
          request={currentRequest}
          requestLoading={loading}
          requiresContract={requiresContract}
          ruleItems={ruleItems}
        />
      ) : (
        <EmployeeResolvedBenefitDialogContent
          acceptedContract={acceptedContract}
          agreementDisabled={hasReusableAgreement}
          agreementStatusNote={agreementStatusNote}
          contract={contract}
          contractLoading={contractLoading}
          errorMessage={resolvedErrorMessage}
          loading={loading}
          onAcceptedContractChange={setAcceptedContract}
          onResubmit={() => void handleSubmit()}
          onViewContract={() => void handleViewContract()}
          overrideMessage={overrideMessage}
          reviewComment={currentRequest.reviewComment ?? null}
          requiresContract={requiresContract}
          ruleItems={ruleItems}
          status={request.status}
          submitting={submitting}
          timelineItems={buildHistoricalTimelineItems(currentRequest, request.status)}
        />
      )}
    </EmployeeBenefitDialogLayout>
  );
}
