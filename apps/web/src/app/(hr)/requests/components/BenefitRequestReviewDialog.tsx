"use client";

import { useMemo, useState } from "react";

import { useEmployeeBenefitDialogQuery } from "@/shared/apollo/generated";
import {
  HR_DIALOG_MAX_HEIGHT_CLASS,
  HR_DIALOG_OVERLAY_BASE_CLASS,
} from "@/shared/ui/dialog-styles";

import BenefitRequestReviewBody from "./BenefitRequestReviewBody";
import BenefitRequestReviewFooter from "./BenefitRequestReviewFooter";
import BenefitRequestReviewHeader from "./BenefitRequestReviewHeader";
import { type BenefitRequestRecord } from "./benefit-requests.graphql";
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
import { formatDetailDateTime } from "./request-detail-formatters";
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
  const helperApproverLabel =
    isPending && !canReview && !isOwnRequest
      ? request.approval_role === "finance_manager"
        ? "Financial Manager"
        : "HR Admin"
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
  const primaryOverviewValue = request.benefit.category;
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
    setReviewComment("");
    void handleReview(true, null);
  }

  function handleReject() {
    void handleReview(false, reviewComment.trim() || null);
  }

  return (
    <div
      className={`${HR_DIALOG_OVERLAY_BASE_CLASS} z-[60]`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`mx-auto flex h-auto w-full max-w-[626px] flex-col overflow-hidden rounded-[8px] border border-[#CBD5E1] bg-white shadow-[0_20px_48px_rgba(15,23,42,0.08)] ${HR_DIALOG_MAX_HEIGHT_CLASS}`}>
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
          helperApproverLabel={helperApproverLabel}
          isPending={isPending}
          level={level}
          onReviewCommentChange={setReviewComment}
          onViewContract={() => void handleViewContract()}
          position={request.employee.position}
          reviewComment={reviewComment}
          request={request}
          reviewedBannerName={reviewedBannerName}
          reviewedByLabel={reviewedByLabel}
          reviewedPrimaryValue={primaryOverviewValue}
          reviewSecondaryValue={secondaryOverviewValue}
          statusBadge={statusBadge}
        />

        {isPending ? (
          <BenefitRequestReviewFooter
            canReview={canReview}
            errorMessage={errorMessage ?? helperMessage}
            loading={loading}
            onApprove={handleApprove}
            onRejectConfirm={handleReject}
          />
        ) : null}
      </div>
    </div>
  );
}
