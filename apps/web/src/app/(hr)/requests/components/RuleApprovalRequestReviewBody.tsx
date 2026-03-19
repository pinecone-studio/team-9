import type { RuleApprovalRequestReviewQuery } from "./approval-requests.graphql";
import {
  AuditLogSection,
  DetailSection,
  SubmissionDetailsCard,
} from "./ApprovalRequestDetailSections";
import {
  RuleAppliedBenefitsSection,
  RuleImpactSection,
  RuleOverviewSection,
} from "./ApprovalRequestRuleSections";
import ApprovalRequestStatusBadge from "./ApprovalRequestStatusBadge";
import { formatPersonLabel } from "./approval-request-utils";
import {
  formatDetailDateTime,
  formatDetailDateTimeWithAt,
} from "./request-detail-formatters";

type RuleReviewRecord = NonNullable<
  RuleApprovalRequestReviewQuery["ruleApprovalRequestReview"]
>;

function formatApprovalRole(role: RuleReviewRecord["request"]["target_role"]) {
  return role === "finance_manager" ? "Finance Manager" : "HR Admin";
}

function getActionBadgeClass(tone: RuleReviewRecord["actionBadgeTone"]) {
  if (tone === "success") {
    return "bg-[#DCFCE7] text-[#008236]";
  }

  if (tone === "danger") {
    return "bg-[#FEF2F2] text-[#B42318]";
  }

  return "bg-[#F5F5F5] text-[#171717]";
}

function resolveAuditActor(
  review: RuleReviewRecord,
  actorIdentifier: string | null | undefined,
  actorType: string,
) {
  if (actorType === "system") {
    return "System";
  }

  const knownPeople = [
    review.submissionDetails.submittedBy,
    review.submissionDetails.assignedApprover,
    review.submissionDetails.reviewedBy,
  ].filter(Boolean);
  const matchingPerson = knownPeople.find(
    (person) => person?.identifier && person.identifier === actorIdentifier,
  );

  if (matchingPerson?.name) {
    return matchingPerson.name;
  }

  if (actorIdentifier?.trim()) {
    return formatPersonLabel(actorIdentifier);
  }

  return actorType === "reviewer" ? "Reviewer" : "Employee";
}

export default function RuleApprovalRequestReviewBody({
  review,
}: {
  review: RuleReviewRecord;
}) {
  const auditEntries = review.auditLog.map((entry) => ({
    actor: resolveAuditActor(review, entry.actorIdentifier, entry.actorType),
    id: entry.id,
    label: entry.label,
    timestamp: entry.createdAt,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-[26px] items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white px-2 text-[14px] leading-5 font-medium text-[#0A0A0A]">
          Rule
        </span>
        <span
          className={`inline-flex h-[26px] items-center justify-center rounded-[8px] px-3 text-[12px] leading-4 font-medium ${getActionBadgeClass(review.actionBadgeTone)}`}
        >
          {review.actionBadgeLabel}
        </span>
      </div>

      <RuleOverviewSection
        condition={review.overview.condition}
        description={review.overview.description}
        measurement={review.overview.measurement}
        requirementValue={review.overview.requirementValue}
        ruleName={review.overview.ruleName}
        ruleType={review.overview.ruleTypeLabel}
        technicalExpression={review.overview.technicalExpression}
        valueFieldLabel={review.overview.valueFieldLabel}
      />

      <RuleImpactSection
        affectedEmployees={review.impact.affectedEmployees}
        eligibilityEffect={review.impact.eligibilityEffect}
        ruleUsageCount={review.impact.benefitsUsingRule}
        summary={review.impact.summary}
      />

      <RuleAppliedBenefitsSection
        linkedBenefits={review.appliedBenefits}
        ruleUsageCount={review.impact.benefitsUsingRule}
      />

      <DetailSection title="Submission Details">
        <SubmissionDetailsCard
          approverName={review.submissionDetails.assignedApprover.name}
          approverSubtitle={
            review.submissionDetails.assignedApprover.position ??
            formatApprovalRole(review.request.target_role)
          }
          requesterName={review.submissionDetails.submittedBy.name}
          requesterSubtitle={
            review.submissionDetails.submittedBy.position ?? "Requester"
          }
          statusBadge={
            <ApprovalRequestStatusBadge
              pendingLabel="Pending"
              status={review.request.status}
              variant="pill"
            />
          }
          submittedAt={formatDetailDateTime(review.submissionDetails.submittedAt)}
        />
      </DetailSection>

      <div className="h-px w-full bg-[#E5E5E5]" />

      <AuditLogSection
        entries={auditEntries}
        formatTimestamp={formatDetailDateTimeWithAt}
      />
    </div>
  );
}
