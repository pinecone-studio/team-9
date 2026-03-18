"use client";

import { AuditLogSection } from "./ApprovalRequestDetailSections";
import BenefitRequestReviewFooter from "./BenefitRequestReviewFooter";
import BenefitRequestReviewHeader from "./BenefitRequestReviewHeader";
import {
  BenefitRequestEligibilitySection,
  BenefitRequestEmployeeSnapshotSection,
  BenefitRequestOverviewSection,
} from "./BenefitRequestReviewSections";
import {
  BenefitRequestApprovalProgressSection,
  BenefitRequestContractSection,
  BenefitRequestReviewedBanner,
} from "./BenefitRequestReviewStatusSections";
import {
  type BenefitRequestRecord,
} from "./benefit-requests.graphql";
import {
  buildBenefitRequestAuditEntries,
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
  formatDetailDateTimeWithAt,
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
  const auditEntries = buildBenefitRequestAuditEntries(request, isPending);
  const department = getBenefitRequestDepartment(request);
  const employmentStatus = formatBenefitEmploymentStatus(
    getBenefitRequestEmploymentStatus(request),
  );
  const level = getBenefitRequestResponsibilityLevel(request);
  const primaryOverviewValue = isPending
    ? request.benefit.category
    : formatDetailDateTime(request.created_at);
  const secondaryOverviewValue = formatDetailDateTime(request.created_at);
  const reviewedBannerName = request.reviewed_by?.name ?? "the assigned reviewer";
  const contractStatusLabel = request.contractAcceptedAt ? "Accepted" : "Pending";

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto flex w-full max-w-[626px] flex-col overflow-hidden rounded-[12px] border border-[#CBD5E1] bg-white shadow-[0_24px_48px_rgba(15,23,42,0.18)]">
        <BenefitRequestReviewHeader isPending={isPending} onClose={onClose} />

        <div className="flex max-h-[calc(100vh-220px)] flex-col gap-5 overflow-y-auto px-6 py-5">
          <BenefitRequestOverviewSection
            approvalRoute={approvalRoute}
            benefitTitle={request.benefit.title}
            employeeName={request.employee.name}
            employeePosition={request.employee.position}
            isPending={isPending}
            primaryValue={primaryOverviewValue}
            reviewedByLabel={reviewedByLabel}
            secondaryValue={secondaryOverviewValue}
            statusBadge={statusBadge}
          />

          <BenefitRequestEmployeeSnapshotSection
            department={department}
            employmentStatus={employmentStatus}
            level={level}
            position={request.employee.position}
          />

          <div className="h-px w-full bg-[#E5E5E5]" />

          <BenefitRequestEligibilitySection />

          <div className="h-px w-full bg-[#E5E5E5]" />

          {isPending && request.benefit.requiresContract ? (
            <>
              <BenefitRequestContractSection
                acceptedAt={formatDetailDateTime(request.contractAcceptedAt)}
                contractError={contractError}
                contractLoading={contractLoading}
                contractVersion={request.contractVersionAccepted ?? "-"}
                onViewContract={() => void handleViewContract()}
                statusLabel={contractStatusLabel}
              />

              <div className="h-px w-full bg-[#E5E5E5]" />
            </>
          ) : null}

          {isPending ? (
            <>
              <BenefitRequestApprovalProgressSection approvalRoute={approvalRoute} />

              <div className="h-px w-full bg-[#E5E5E5]" />
            </>
          ) : null}

          <AuditLogSection entries={auditEntries} formatTimestamp={formatDetailDateTimeWithAt} />

        </div>

        <BenefitRequestReviewFooter
          canReview={canReview}
          errorMessage={errorMessage}
          helperMessage={helperMessage}
          isPending={isPending}
          loading={loading}
          onApprove={() => void handleReview(true)}
          onClose={onClose}
          onReject={() => void handleReview(false)}
        />
        {!isPending ? (
          <BenefitRequestReviewedBanner reviewedBy={reviewedBannerName} status={request.status} />
        ) : null}
      </div>
    </div>
  );
}
