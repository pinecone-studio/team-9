"use client";

import { useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";

import RequestsBoardContent from "./RequestsBoardContent";
import ApprovalRequestReviewDialog from "./ApprovalRequestReviewDialog";
import {
  APPROVAL_REQUESTS_QUERY,
  type ApprovalRequestRecord,
  type ApprovalRequestsQuery,
} from "./approval-requests.graphql";
import { isToday } from "./approval-request-time-formatters";

const EMPTY_REQUESTS: ApprovalRequestRecord[] = [];

type RequestsBoardProps = {
  currentUserIdentifier: string;
  currentUserRole: string;
};

export default function RequestsBoard({
  currentUserIdentifier,
  currentUserRole,
}: RequestsBoardProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const { data, error, loading, refetch } =
    useQuery<ApprovalRequestsQuery>(APPROVAL_REQUESTS_QUERY, {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    });

  const requests = data?.approvalRequests ?? EMPTY_REQUESTS;
  const normalizedRole = currentUserRole.trim().toLowerCase();
  const roleScopedRequests = useMemo(() => {
    return requests.filter((request) => request.target_role === normalizedRole);
  }, [normalizedRole, requests]);

  const configurationRequests = useMemo(() => {
    return [...roleScopedRequests].sort((left, right) =>
      right.created_at.localeCompare(left.created_at),
    );
  }, [roleScopedRequests]);

  const benefitRequests = useMemo(() => {
    return configurationRequests.filter((request) => request.entity_type === "benefit");
  }, [configurationRequests]);

  const metrics = useMemo(
    () => ({
      approvedToday: roleScopedRequests.filter(
        (request) => request.status === "approved" && isToday(request.reviewed_at),
      ).length,
      awaitingFinance: requests.filter(
        (request) =>
          request.status === "pending" && request.target_role === "finance_manager",
      ).length,
      pendingOverrides: roleScopedRequests.filter(
        (request) => request.status === "pending" && request.action_type === "update",
      ).length,
      pendingRequests: roleScopedRequests.filter(
        (request) => request.status === "pending",
      ).length,
      rejectedToday: roleScopedRequests.filter(
        (request) => request.status === "rejected" && isToday(request.reviewed_at),
      ).length,
    }),
    [requests, roleScopedRequests],
  );

  return (
    <>
      <RequestsBoardContent
        benefitRequests={benefitRequests}
        configurationRequests={configurationRequests}
        currentUserIdentifier={currentUserIdentifier}
        error={error?.message ?? null}
        loading={loading}
        metrics={metrics}
        onReview={setSelectedRequestId}
      />

      {selectedRequestId ? (
        <ApprovalRequestReviewDialog
          currentUserIdentifier={currentUserIdentifier}
          onClose={() => setSelectedRequestId(null)}
          onReviewed={refetch}
          requestId={selectedRequestId}
        />
      ) : null}
    </>
  );
}
