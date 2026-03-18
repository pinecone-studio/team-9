"use client";

import { useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";

import RequestsBoardContent from "./RequestsBoardContent";
import ApprovalRequestReviewDialog from "./ApprovalRequestReviewDialog";
import BenefitRequestReviewDialog from "./BenefitRequestReviewDialog";
import { RequestPeopleProvider } from "./RequestPeopleContext";
import {
  APPROVAL_REQUESTS_QUERY,
  type ApprovalRequestRecord,
  type ApprovalRequestsQuery,
  REQUESTS_EMPLOYEES_DIRECTORY_QUERY,
  type RequestsEmployeesDirectoryQuery,
} from "./approval-requests.graphql";
import {
  BENEFIT_REQUESTS_QUERY,
  type BenefitRequestRecord,
  type BenefitRequestsQuery,
} from "./benefit-requests.graphql";
import {
  buildEmployeeDirectory,
  buildRequestsBoardMetrics,
} from "./requests-board.utils";

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
  const { data: employeesDirectoryData } = useQuery<RequestsEmployeesDirectoryQuery>(
    REQUESTS_EMPLOYEES_DIRECTORY_QUERY,
    {
      fetchPolicy: "cache-first",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: false,
    },
  );
  const {
    data: benefitRequestData,
    error: benefitRequestError,
    loading: benefitRequestLoading,
    refetch: refetchBenefitRequests,
  } = useQuery<BenefitRequestsQuery>(BENEFIT_REQUESTS_QUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const requests = data?.approvalRequests ?? EMPTY_REQUESTS;
  const benefitRequests = benefitRequestData?.benefitRequests ?? EMPTY_BENEFIT_REQUESTS;
  const roleScopedRequests = useMemo(() => {
    return requests.filter((request) => request.target_role === normalizedRole);
  }, [normalizedRole, requests]);

  const configurationRequests = useMemo(() => {
    return requests
      .filter(
        (request) =>
          (request.entity_type === "benefit" || request.entity_type === "rule") &&
          (request.action_type === "create" || request.action_type === "update"),
      )
      .sort((left, right) => right.created_at.localeCompare(left.created_at));
  }, [requests]);

  const selectedBenefitRequest = useMemo(
    () =>
      benefitRequests.find((request) => request.id === selectedBenefitRequestId) ?? null,
    [benefitRequests, selectedBenefitRequestId],
  );

  const metrics = useMemo(
    () =>
      buildRequestsBoardMetrics({
        benefitRequests,
        configurationRequests,
        currentUserIdentifier,
        requests,
        roleScopedRequests,
      }),
    [benefitRequests, configurationRequests, currentUserIdentifier, requests, roleScopedRequests],
  );
  const employeeDirectory = useMemo(
    () => buildEmployeeDirectory(employeesDirectoryData?.employees),
    [employeesDirectoryData?.employees],
  );

  return (
    <RequestPeopleProvider value={employeeDirectory}>
      <RequestsBoardContent
        benefitRequests={benefitRequests}
        configurationRequests={configurationRequests}
        currentUserIdentifier={currentUserIdentifier}
        currentUserRole={currentUserRole}
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
          currentUserRole={currentUserRole}
          onClose={() => setSelectedBenefitRequestId(null)}
          onReviewed={refetchBenefitRequests}
          request={selectedBenefitRequest}
        />
      ) : null}
    </RequestPeopleProvider>
  );
}
