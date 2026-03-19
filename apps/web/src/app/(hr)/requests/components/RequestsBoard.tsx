"use client";

import { useEffect, useMemo, useState } from "react";

import {
  useApprovalRequestsQuery,
  useHrBenefitRequestsQuery,
  useRequestsEmployeesDirectoryQuery,
} from "@/shared/apollo/generated";
import RequestsReviewToast from "./RequestsReviewToast";
import RequestsBoardContent from "./RequestsBoardContent";
import RequestsBoardDialogs from "./RequestsBoardDialogs";
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
  const [reviewToastMessage, setReviewToastMessage] = useState<string | null>(null);
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
  const selectedApprovalRequest = useMemo(
    () => approvalRequests.find((request) => request.id === selectedRequestId) ?? null,
    [approvalRequests, selectedRequestId],
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

  useEffect(() => {
    if (!reviewToastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setReviewToastMessage(null);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [reviewToastMessage]);

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
      <RequestsBoardDialogs
        currentUserIdentifier={currentUserIdentifier}
        currentUserRole={currentUserRole}
        onBenefitClose={() => setSelectedBenefitRequestId(null)}
        onConfigurationClose={() => setSelectedRequestId(null)}
        onReviewedApproval={refetchApprovalRequests}
        onReviewedBenefit={refetchBenefitRequests}
        onReviewSuccess={setReviewToastMessage}
        selectedApprovalRequest={selectedApprovalRequest}
        selectedBenefitRequest={selectedBenefitRequest}
      />

      <RequestsReviewToast message={reviewToastMessage} />
    </RequestPeopleProvider>
  );
}
