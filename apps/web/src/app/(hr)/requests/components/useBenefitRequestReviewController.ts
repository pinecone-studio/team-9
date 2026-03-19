import { useState } from "react";

import {
  useHrBenefitRequestContractLazyQuery,
  useHrReviewBenefitRequestMutation,
} from "@/shared/apollo/generated";

import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import { normalizeSignedBenefitUrl } from "./benefit-request-review-utils";

type UseBenefitRequestReviewControllerInput = {
  currentUserIdentifier: string;
  onClose: () => void;
  onReviewed: () => Promise<unknown> | void;
  request: BenefitRequestRecord;
};

export function useBenefitRequestReviewController({
  currentUserIdentifier,
  onClose,
  onReviewed,
  request,
}: UseBenefitRequestReviewControllerInput) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [contractError, setContractError] = useState<string | null>(null);
  const [reviewBenefitRequest, { loading }] = useHrReviewBenefitRequestMutation();
  const [loadContract, { loading: contractLoading }] =
    useHrBenefitRequestContractLazyQuery({
      fetchPolicy: "network-only",
    });

  async function handleReview(approved: boolean, reviewComment: string | null) {
    try {
      setErrorMessage(null);
      await reviewBenefitRequest({
        variables: {
          input: {
            approved,
            id: request.id,
            reviewComment,
            reviewedBy: currentUserIdentifier,
          },
        },
      });
      await onReviewed();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Benefit request review failed.",
      );
    }
  }

  async function handleViewContract() {
    try {
      setContractError(null);
      const { data: contractData } = await loadContract({
        variables: {
          benefitId: request.benefit.id,
        },
      });
      const signedUrl = contractData?.contractSignedUrlByBenefit.signedUrl;

      if (!signedUrl) {
        throw new Error("Contract link is unavailable.");
      }

      const resolvedUrl = normalizeSignedBenefitUrl(window.location.origin, signedUrl);
      window.open(resolvedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      setContractError(
        error instanceof Error ? error.message : "Contract could not be opened.",
      );
    }
  }

  return {
    contractError,
    contractLoading,
    errorMessage,
    handleReview,
    handleViewContract,
    loading,
  };
}
