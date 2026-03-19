import { AuditLogSection } from "./ApprovalRequestAuditLogSection";
import {
  BenefitRequestEligibilitySection,
  BenefitRequestEmployeeSnapshotSection,
  BenefitRequestNotesSection,
  BenefitRequestOverviewSection,
} from "./BenefitRequestReviewSections";
import {
  BenefitRequestAssignedBanner,
  BenefitRequestApprovalProgressSection,
  BenefitRequestContractSection,
  BenefitRequestReviewedBanner,
} from "./BenefitRequestReviewStatusSections";
import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import type { BenefitRequestEligibilityItem } from "./benefit-request-review-utils";
import {
  formatDetailDateTime,
  formatDetailDateTimeWithAt24Hour,
} from "./request-detail-formatters";

type BenefitRequestReviewBodyProps = {
  approvalRoute: string;
  auditEntries: Array<{
    actor: string;
    id: string;
    label: string;
    timestamp: string;
    tone?: "danger" | "neutral" | "success";
  }>;
  contractError: string | null;
  contractLoading: boolean;
  contractStatusLabel: string;
  department: string;
  eligibilityItems: BenefitRequestEligibilityItem[];
  eligibilityLoading: boolean;
  employmentStatus: string;
  helperApproverLabel: string | null;
  isPending: boolean;
  level: number | null;
  onReviewCommentChange: (value: string) => void;
  onViewContract: () => void;
  position: string;
  reviewComment: string;
  request: BenefitRequestRecord;
  reviewedBannerName: string;
  reviewedByLabel: string;
  reviewedPrimaryValue: string;
  reviewSecondaryValue: string;
  statusBadge: {
    bgClassName: string;
    iconClassName: string;
    label: string;
    textClassName: string;
  };
};

export default function BenefitRequestReviewBody({
  approvalRoute,
  auditEntries,
  contractError,
  contractLoading,
  contractStatusLabel,
  department,
  eligibilityItems,
  eligibilityLoading,
  employmentStatus,
  helperApproverLabel,
  isPending,
  level,
  onReviewCommentChange,
  onViewContract,
  position,
  reviewComment,
  request,
  reviewedBannerName,
  reviewedByLabel,
  reviewedPrimaryValue,
  reviewSecondaryValue,
  statusBadge,
}: BenefitRequestReviewBodyProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 pb-0 pt-7">
      <div className="flex flex-col gap-5">
        <BenefitRequestOverviewSection
          approvalRoute={approvalRoute}
          benefitTitle={request.benefit.title}
          employeeName={request.employee.name}
          employeePosition={request.employee.position}
          isPending={isPending}
          primaryValue={reviewedPrimaryValue}
          reviewedByLabel={reviewedByLabel}
          secondaryValue={reviewSecondaryValue}
          statusBadge={statusBadge}
        />

        <BenefitRequestEmployeeSnapshotSection
          department={department}
          employmentStatus={employmentStatus}
          lateArrivalCount={request.employeeLateArrivalCount}
          level={level}
          okrSubmitted={request.employeeOkrSubmitted}
          position={position}
        />

        <div className="h-px w-full bg-[#E5E5E5]" />

        <BenefitRequestEligibilitySection
          items={eligibilityItems}
          loading={eligibilityLoading}
        />

        <div className="h-px w-full bg-[#E5E5E5]" />

        {isPending && request.benefit.requiresContract ? (
          <>
            <BenefitRequestContractSection
              acceptedAt={formatDetailDateTime(request.contractAcceptedAt)}
              contractError={contractError}
              contractLoading={contractLoading}
              contractVersion={request.contractVersionAccepted ?? "-"}
              onViewContract={onViewContract}
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

        {isPending && helperApproverLabel === null ? (
          <BenefitRequestNotesSection
            editable
            onChange={onReviewCommentChange}
            reviewComment={reviewComment}
          />
        ) : null}

        {!isPending && request.reviewComment?.trim() ? (
          <>
            <BenefitRequestNotesSection reviewComment={request.reviewComment.trim()} />
            <div className="h-px w-full bg-[#E5E5E5]" />
          </>
        ) : null}

        <AuditLogSection
          entries={auditEntries}
          formatTimestamp={formatDetailDateTimeWithAt24Hour}
        />

        {isPending && helperApproverLabel ? (
          <BenefitRequestAssignedBanner approverLabel={helperApproverLabel} />
        ) : null}

        {!isPending ? (
          <BenefitRequestReviewedBanner reviewedBy={reviewedBannerName} status={request.status} />
        ) : null}
      </div>
    </div>
  );
}
