"use client";

import { useMemo, useState } from "react";

import { useEmployeeBenefitDialogQuery } from "@/shared/apollo/generated";

import BenefitRequestReviewBody from "./BenefitRequestReviewBody";
import BenefitRequestReviewFooter from "./BenefitRequestReviewFooter";
import BenefitRequestReviewHeader from "./BenefitRequestReviewHeader";
import {
  BenefitRequestReviewedBanner,
} from "./BenefitRequestReviewStatusSections";
import {
  type BenefitRequestRecord,
} from "./benefit-requests.graphql";
import {
  buildBenefitRequestAuditEntries,
  buildBenefitRequestEligibilityItems,
  formatBenefitApprovalRoute,
  formatBenefitEmploymentStatus,
  formatBenefitReviewerRole,
  getBenefitRequestDepartment,
  getBenefitRequestEmploymentStatus,
  getBenefitRequestResponsibilityLevel,
  getBenefitRequestStatusBadge,
} from "./benefit-request-review-utils";
import {
  formatDetailDateTime,
} from "./request-detail-formatters";
import { useBenefitRequestReviewController } from "./useBenefitRequestReviewController";

type BenefitRequestReviewDialogProps = {
  currentUserIdentifier: string;
  currentUserRole: string;
  onClose: () => void;
  onReviewed: () => Promise<unknown> | void;
  request: BenefitRequestRecord;
};

export default function BenefitRequestReviewDialog({
  currentUserIdentifier,
  currentUserRole,
  onClose,
  onReviewed,
  request,
}: BenefitRequestReviewDialogProps) {
  const [rejectMode, setRejectMode] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const {
    contractError,
    contractLoading,
    errorMessage,
    handleReview,
    handleViewContract,
    loading,
  } = useBenefitRequestReviewController({
    currentUserIdentifier,
    onClose,
    onReviewed,
    request,
  });

  const isPending = request.status === "pending";
  const isOwnRequest =
    request.employee.email.trim().toLowerCase() ===
    currentUserIdentifier.trim().toLowerCase();
  const canReview =
    isPending &&
    !isOwnRequest &&
    request.approval_role === currentUserRole.trim().toLowerCase();
  const helperMessage =
    isPending && !canReview
      ? isOwnRequest
        ? "You can view your own request, but you cannot approve or reject it."
        : "You can view this request, but only the assigned approver can review it."
      : null;
  const reviewedByLabel = request.reviewed_by?.name
    ? `${request.reviewed_by.name} (${formatBenefitReviewerRole(request.approval_role)})`
    : "-";

  const statusBadge = getBenefitRequestStatusBadge(request.status);
  const approvalRoute = formatBenefitApprovalRoute(request.approval_role);
  const auditEntries = buildBenefitRequestAuditEntries(request);
  const department = getBenefitRequestDepartment(request);
  const employmentStatus = formatBenefitEmploymentStatus(
    getBenefitRequestEmploymentStatus(request),
  );
  const level = getBenefitRequestResponsibilityLevel(request);
  const primaryOverviewValue = isPending
    ? request.benefit.category
    : approvalRoute;
  const secondaryOverviewValue = formatDetailDateTime(request.created_at);
  const reviewedBannerName = request.reviewed_by?.name ?? "the assigned reviewer";
  const contractStatusLabel = request.contractAcceptedAt ? "Accepted" : "Pending";
  const { data: eligibilityData, loading: eligibilityLoading } = useEmployeeBenefitDialogQuery({
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    variables: {
      benefitId: request.benefit.id,
      employeeId: request.employee.id,
    },
  });
  const eligibilityItems = useMemo(
    () =>
      buildBenefitRequestEligibilityItems(
        request,
        eligibilityData?.eligibilityRules ?? [],
      ),
    [eligibilityData?.eligibilityRules, request],
  );

  function handleApprove() {
    setRejectMode(false);
    setReviewComment("");
    void handleReview(true, null);
  }

  function handleReject() {
    void handleReview(false, reviewComment.trim() || null);
  }

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto flex h-full max-h-[calc(100vh-48px)] w-full max-w-[980px] flex-col overflow-hidden rounded-[12px] border border-[#CBD5E1] bg-white shadow-[0_24px_48px_rgba(15,23,42,0.18)]">
        <BenefitRequestReviewHeader isPending={isPending} onClose={onClose} />

        <BenefitRequestReviewBody
          approvalRoute={approvalRoute}
          auditEntries={auditEntries}
          contractError={contractError}
          contractLoading={contractLoading}
          contractStatusLabel={contractStatusLabel}
          department={department}
          eligibilityItems={eligibilityItems}
          eligibilityLoading={eligibilityLoading}
          employmentStatus={employmentStatus}
          isPending={isPending}
          level={level}
          onViewContract={() => void handleViewContract()}
          position={request.employee.position}
          request={request}
          reviewedByLabel={reviewedByLabel}
          reviewedPrimaryValue={primaryOverviewValue}
          reviewSecondaryValue={secondaryOverviewValue}
          statusBadge={statusBadge}
        />

        <BenefitRequestReviewFooter
          canReview={canReview}
          errorMessage={errorMessage}
          helperMessage={helperMessage}
          isPending={isPending}
          loading={loading}
          onApprove={handleApprove}
          onClose={onClose}
          onRejectClick={() => {
            setRejectMode(true);
          }}
          onRejectConfirm={handleReject}
          onReviewCommentChange={setReviewComment}
          rejectMode={rejectMode}
          reviewComment={reviewComment}
        />
        {!isPending ? (
          <BenefitRequestReviewedBanner reviewedBy={reviewedBannerName} status={request.status} />
        ) : null}
      </div>
    </div>
  );
}
