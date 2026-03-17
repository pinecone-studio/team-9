"use client";

import { useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";

import RequestsBoardContent from "./RequestsBoardContent";
import ApprovalRequestReviewDialog from "./ApprovalRequestReviewDialog";
import BenefitRequestReviewDialog from "./BenefitRequestReviewDialog";
import {
  APPROVAL_REQUESTS_QUERY,
  type ApprovalRequestRecord,
  type ApprovalRequestsQuery,
} from "./approval-requests.graphql";
import {
  BENEFIT_REQUESTS_QUERY,
  type BenefitRequestRecord,
  type BenefitRequestsQuery,
} from "./benefit-requests.graphql";
import { isToday } from "./approval-request-time-formatters";

const EMPTY_REQUESTS: ApprovalRequestRecord[] = [];
const EMPTY_BENEFIT_REQUESTS: BenefitRequestRecord[] = [];

type RequestsBoardProps = {
  currentUserIdentifier: string;
  currentUserRole: string;
};

export default function RequestsBoard({
  currentUserIdentifier,
  currentUserRole,
}: RequestsBoardProps) {
  const normalizedRole = currentUserRole.trim().toLowerCase();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedBenefitRequestId, setSelectedBenefitRequestId] = useState<string | null>(null);
  const { data, error, loading, refetch } =
    useQuery<ApprovalRequestsQuery>(APPROVAL_REQUESTS_QUERY, {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    });
  const {
    data: benefitRequestData,
    error: benefitRequestError,
    loading: benefitRequestLoading,
    refetch: refetchBenefitRequests,
  } = useQuery<BenefitRequestsQuery>(BENEFIT_REQUESTS_QUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    variables: { targetRole: normalizedRole },
  });

  const requests = data?.approvalRequests ?? EMPTY_REQUESTS;
  const benefitRequests = benefitRequestData?.benefitRequests ?? EMPTY_BENEFIT_REQUESTS;
  const roleScopedRequests = useMemo(() => {
    return requests.filter((request) => request.target_role === normalizedRole);
  }, [normalizedRole, requests]);

  const configurationRequests = useMemo(() => {
    return roleScopedRequests
      .filter((request) => request.entity_type !== "benefit")
      .sort((left, right) => right.created_at.localeCompare(left.created_at));
  }, [roleScopedRequests]);

  const selectedBenefitRequest = useMemo(
    () =>
      benefitRequests.find((request) => request.id === selectedBenefitRequestId) ?? null,
    [benefitRequests, selectedBenefitRequestId],
  );

  const metrics = useMemo(
    () => ({
      approvedToday:
        configurationRequests.filter(
          (request) => request.status === "approved" && isToday(request.reviewed_at),
        ).length +
        benefitRequests.filter(
          (request) => request.status === "approved" && isToday(request.updated_at),
        ).length,
      awaitingYourApproval:
        configurationRequests.filter(
          (request) =>
            request.status === "pending" &&
            request.requested_by.trim().toLowerCase() !==
              currentUserIdentifier.trim().toLowerCase(),
        ).length +
        benefitRequests.filter(
          (request) =>
            request.status === "pending" &&
            request.employee.email.trim().toLowerCase() !==
              currentUserIdentifier.trim().toLowerCase(),
        ).length,
      awaitingFinance:
        requests.filter(
          (request) =>
            request.status === "pending" && request.target_role === "finance_manager",
        ).length +
        benefitRequests.filter(
          (request) =>
            request.status === "pending" &&
            request.approval_role === "finance_manager",
        ).length,
      pendingOverrides: roleScopedRequests.filter(
        (request) =>
          request.status === "pending" &&
          (request.action_type === "update" || request.action_type === "delete"),
      ).length,
      pendingRequests:
        configurationRequests.filter((request) => request.status === "pending").length +
        benefitRequests.filter((request) => request.status === "pending").length,
      rejectedToday:
        configurationRequests.filter(
          (request) => request.status === "rejected" && isToday(request.reviewed_at),
        ).length +
        benefitRequests.filter(
          (request) => request.status === "rejected" && isToday(request.updated_at),
        ).length,
    }),
    [benefitRequests, configurationRequests, currentUserIdentifier, requests, roleScopedRequests],
  );

  return (
    <>
      <RequestsBoardContent
        benefitRequests={benefitRequests}
        configurationRequests={configurationRequests}
        currentUserIdentifier={currentUserIdentifier}
        benefitError={benefitRequestError?.message ?? null}
        configurationError={error?.message ?? null}
        loading={loading || benefitRequestLoading}
        metrics={metrics}
        onBenefitReview={setSelectedBenefitRequestId}
        onConfigurationReview={setSelectedRequestId}
      />

      {selectedRequestId ? (
        <ApprovalRequestReviewDialog
          currentUserIdentifier={currentUserIdentifier}
          onClose={() => setSelectedRequestId(null)}
          onReviewed={refetch}
          requestId={selectedRequestId}
        />
      ) : null}
      {selectedBenefitRequest ? (
        <BenefitRequestReviewDialog
          currentUserIdentifier={currentUserIdentifier}
          onClose={() => setSelectedBenefitRequestId(null)}
          onReviewed={refetchBenefitRequests}
          request={selectedBenefitRequest}
        />
      ) : null}
    </>
  );
}
