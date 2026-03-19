import { AuditLogSection } from "./ApprovalRequestDetailSections";
import {
  BenefitRequestEligibilitySection,
  BenefitRequestEmployeeSnapshotSection,
  BenefitRequestNotesSection,
  BenefitRequestOverviewSection,
} from "./BenefitRequestReviewSections";
import {
  BenefitRequestApprovalProgressSection,
  BenefitRequestContractSection,
} from "./BenefitRequestReviewStatusSections";
import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import { formatDetailDateTime, formatDetailDateTimeWithAt } from "./request-detail-formatters";

type BenefitRequestReviewBodyProps = {
  approvalRoute: string;
  auditEntries: Array<{
    actor: string;
    id: string;
    label: string;
    timestamp: string;
  }>;
  contractError: string | null;
  contractLoading: boolean;
  contractStatusLabel: string;
  department: string;
  employmentStatus: string;
  isPending: boolean;
  level: number | null;
  onViewContract: () => void;
  position: string;
  request: BenefitRequestRecord;
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
  employmentStatus,
  isPending,
  level,
  onViewContract,
  position,
  request,
  reviewedByLabel,
  reviewedPrimaryValue,
  reviewSecondaryValue,
  statusBadge,
}: BenefitRequestReviewBodyProps) {
  return (
    <div className="flex max-h-[calc(100vh-220px)] flex-col gap-5 overflow-y-auto px-6 py-5">
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

      <BenefitRequestEligibilitySection />

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

      {request.reviewComment?.trim() ? (
        <>
          <BenefitRequestNotesSection reviewComment={request.reviewComment.trim()} />
          <div className="h-px w-full bg-[#E5E5E5]" />
        </>
      ) : null}

      <AuditLogSection
        entries={auditEntries}
        formatTimestamp={formatDetailDateTimeWithAt}
      />
    </div>
  );
}
