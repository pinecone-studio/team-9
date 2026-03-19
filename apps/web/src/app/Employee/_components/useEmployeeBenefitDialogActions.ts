"use client";

import { useEffect, useState } from "react";

import {
  EmployeeBenefitRequestsDocument,
  EmployeeDashboardDataDocument,
  useCancelEmployeeBenefitRequestMutation,
  useContractSignedUrlByBenefitLazyQuery,
  useSubmitEmployeeBenefitRequestMutation,
} from "@/shared/apollo/generated";

import { type PendingBenefitRequest } from "./employee-benefit-request.helpers";
import { resolveSignedContractUrl } from "./employee-benefit-dialog.helpers";
import type { EmployeeBenefitCard } from "./employee-types";

type UseEmployeeBenefitDialogActionsInput = {
  card: EmployeeBenefitCard;
  contract: {
    version: string;
  } | null;
  currentUserIdentifier: string;
  employeeId: string;
  initialAcceptedContract?: boolean;
  onClose: () => void;
  onSubmitted: () => Promise<unknown> | void;
  pendingRequest: PendingBenefitRequest | null;
};

export function useEmployeeBenefitDialogActions({
  card,
  contract,
  currentUserIdentifier,
  employeeId,
  initialAcceptedContract = false,
  onClose,
  onSubmitted,
  pendingRequest,
}: UseEmployeeBenefitDialogActionsInput) {
  const [acceptedContract, setAcceptedContract] = useState(initialAcceptedContract);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fetchSignedUrl, { loading: contractLoading }] =
    useContractSignedUrlByBenefitLazyQuery({ fetchPolicy: "network-only" });
  const [submitEmployeeBenefitRequest, { loading: submitting }] =
    useSubmitEmployeeBenefitRequestMutation();
  const [cancelEmployeeBenefitRequest, { loading: cancelling }] =
    useCancelEmployeeBenefitRequestMutation();

  useEffect(() => {
    setAcceptedContract(initialAcceptedContract);
    setErrorMessage(null);
  }, [card.id, initialAcceptedContract]);

  async function handleViewContract() {
    if (!contract) {
      setErrorMessage("No active contract is attached to this benefit.");
      return;
    }

    setErrorMessage(null);

    try {
      const response = await fetchSignedUrl({ variables: { benefitId: card.id } });
      const signedUrl = response.data?.contractSignedUrlByBenefit.signedUrl;

      if (!signedUrl) {
        throw new Error("Contract link could not be created.");
      }

      window.open(resolveSignedContractUrl(signedUrl), "_blank", "noopener,noreferrer");
    } catch (requestError) {
      setErrorMessage(
        requestError instanceof Error
          ? requestError.message
          : "Contract could not be opened.",
      );
    }
  }

  async function handleSubmit() {
    if (card.requiresContract && !contract) {
      setErrorMessage("No active contract is attached to this benefit.");
      return;
    }
    if (card.requiresContract && !acceptedContract) {
      setErrorMessage("Please confirm the contract agreement before requesting.");
      return;
    }

    setErrorMessage(null);

    try {
      await submitEmployeeBenefitRequest({
        awaitRefetchQueries: true,
        refetchQueries: [
          { query: EmployeeDashboardDataDocument, variables: { employeeId } },
          { query: EmployeeBenefitRequestsDocument, variables: { employeeId } },
        ],
        variables: {
          input: {
            benefitId: card.id,
            contractAcceptedAt: contract ? new Date().toISOString() : undefined,
            contractVersionAccepted: contract?.version,
            employeeId,
            requestedBy: currentUserIdentifier,
          },
        },
      });
      await onSubmitted();
      onClose();
    } catch (requestError) {
      setErrorMessage(
        requestError instanceof Error
          ? requestError.message
          : "Benefit request could not be submitted.",
      );
    }
  }

  async function handleCancel() {
    if (!pendingRequest) {
      setErrorMessage("No pending request could be found for this benefit.");
      return;
    }

    setErrorMessage(null);

    try {
      await cancelEmployeeBenefitRequest({
        awaitRefetchQueries: true,
        refetchQueries: [
          { query: EmployeeDashboardDataDocument, variables: { employeeId } },
          { query: EmployeeBenefitRequestsDocument, variables: { employeeId } },
        ],
        variables: {
          input: {
            cancelledBy: currentUserIdentifier,
            id: pendingRequest.id,
          },
        },
      });
      await onSubmitted();
      onClose();
    } catch (requestError) {
      setErrorMessage(
        requestError instanceof Error
          ? requestError.message
          : "Benefit request could not be cancelled.",
      );
    }
  }

  return {
    acceptedContract,
    cancelling,
    contractLoading,
    errorMessage,
    handleCancel,
    handleSubmit,
    handleViewContract,
    setAcceptedContract,
    submitting,
  };
}
