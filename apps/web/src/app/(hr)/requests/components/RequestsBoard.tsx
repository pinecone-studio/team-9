"use client";

import { useMemo, useState } from "react";

import {
  useApprovalRequestsQuery,
  useHrBenefitRequestsQuery,
  useRequestsEmployeesDirectoryQuery,
} from "@/shared/apollo/generated";
import ApprovalRequestReviewDialog from "./ApprovalRequestReviewDialog";
import BenefitRequestReviewDialog from "./BenefitRequestReviewDialog";
import RequestsBoardContent from "./RequestsBoardContent";
import { RequestPeopleProvider } from "./RequestPeopleContext";
import type { ApprovalRequestRecord } from "./approval-requests.graphql";
import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import {
  buildEmployeeDirectory,
  buildRequestsBoardMetrics,
  splitApprovalRequests,
} from "./requests-board.utils";

const EMPTY_APPROVAL_REQUESTS: ApprovalRequestRecord[] = [];
const EMPTY_BENEFIT_REQUESTS: BenefitRequestRecord[] = [];

type RequestsBoardProps = {
  currentUserIdentifier: string;
  currentUserRole: string;
};

export default function RequestsBoard({
  currentUserIdentifier,
  currentUserRole,
}: RequestsBoardProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedBenefitRequestId, setSelectedBenefitRequestId] = useState<string | null>(null);
  const {
    data: approvalData,
    error: approvalError,
    loading: approvalLoading,
    refetch: refetchApprovalRequests,
  } = useApprovalRequestsQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });
  const { data: employeesDirectoryData } = useRequestsEmployeesDirectoryQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });
  const {
    data: benefitRequestData,
    error: benefitRequestError,
    loading: benefitRequestLoading,
    refetch: refetchBenefitRequests,
  } = useHrBenefitRequestsQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const approvalRequests = approvalData?.approvalRequests ?? EMPTY_APPROVAL_REQUESTS;
  const benefitRequests = benefitRequestData?.benefitRequests ?? EMPTY_BENEFIT_REQUESTS;
  const { configurationRequests, overrideRequests } = useMemo(
    () => splitApprovalRequests(approvalRequests),
    [approvalRequests],
  );
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
        currentUserRole,
        overrideRequests,
      }),
    [
      benefitRequests,
      configurationRequests,
      currentUserIdentifier,
      currentUserRole,
      overrideRequests,
    ],
  );
  const employeeDirectory = useMemo(
    () => buildEmployeeDirectory(employeesDirectoryData?.employees),
    [employeesDirectoryData?.employees],
  );

  return (
    <RequestPeopleProvider value={employeeDirectory}>
      <RequestsBoardContent
        benefitError={benefitRequestError?.message ?? null}
        benefitRequests={benefitRequests}
        configurationError={approvalError?.message ?? null}
        configurationRequests={configurationRequests}
        currentUserIdentifier={currentUserIdentifier}
        currentUserRole={currentUserRole}
        loading={approvalLoading || benefitRequestLoading}
        metrics={metrics}
        onBenefitReview={setSelectedBenefitRequestId}
        onConfigurationReview={setSelectedRequestId}
        overrideRequests={overrideRequests}
      />

      {selectedRequestId ? (
        <ApprovalRequestReviewDialog
          currentUserIdentifier={currentUserIdentifier}
          onClose={() => setSelectedRequestId(null)}
          onReviewed={refetchApprovalRequests}
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
