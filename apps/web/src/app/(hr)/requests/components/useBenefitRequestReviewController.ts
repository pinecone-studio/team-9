import { useLazyQuery, useMutation } from "@apollo/client/react";
import { useState } from "react";

import {
  BENEFIT_REQUEST_CONTRACT_QUERY,
  REVIEW_BENEFIT_REQUEST_MUTATION,
  type BenefitRequestContractQuery,
  type BenefitRequestContractVariables,
  type BenefitRequestRecord,
  type ReviewBenefitRequestMutation,
  type ReviewBenefitRequestVariables,
} from "./benefit-requests.graphql";
import { normalizeSignedBenefitUrl } from "./benefit-request-review-utils";

export function useBenefitRequestReviewController({
  currentUserIdentifier,
  onClose,
  onReviewed,
  request,
}: {
  currentUserIdentifier: string;
  onClose: () => void;
  onReviewed: () => Promise<unknown> | void;
  request: BenefitRequestRecord;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [contractError, setContractError] = useState<string | null>(null);
  const [reviewBenefitRequest, { loading }] = useMutation<
    ReviewBenefitRequestMutation,
    ReviewBenefitRequestVariables
  >(REVIEW_BENEFIT_REQUEST_MUTATION);
  const [loadContract, { loading: contractLoading }] = useLazyQuery<
    BenefitRequestContractQuery,
    BenefitRequestContractVariables
  >(BENEFIT_REQUEST_CONTRACT_QUERY, {
    fetchPolicy: "network-only",
  });

  async function handleReview(approved: boolean) {
    try {
      setErrorMessage(null);
      await reviewBenefitRequest({
        variables: {
          input: {
            approved,
            id: request.id,
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
