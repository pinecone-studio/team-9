import type { RuleApprovalRequestReviewQuery } from "./approval-requests.graphql";
import ApprovalRequestStatusBadge from "./ApprovalRequestStatusBadge";
import {
  DetailSection,
  SubmissionDetailsCard,
} from "./ApprovalRequestDetailSections";
import { formatApprovalRole } from "./approval-request-utils";
import { formatDetailDateTime } from "./request-detail-formatters";

type ReviewRecord = NonNullable<
  RuleApprovalRequestReviewQuery["ruleApprovalRequestReview"]
>;

export default function RuleApprovalRequestReviewSubmissionSection({
  request,
  submissionDetails,
}: Pick<ReviewRecord, "request" | "submissionDetails">) {
  return (
    <DetailSection title="Submission Details">
      <SubmissionDetailsCard
        approverName={submissionDetails.assignedApprover.name}
        approverSubtitle={
          submissionDetails.assignedApprover.position ??
          formatApprovalRole(request.target_role)
        }
        requesterName={submissionDetails.submittedBy.name}
        requesterSubtitle={submissionDetails.submittedBy.position ?? "Requester"}
        statusBadge={
          <ApprovalRequestStatusBadge
            pendingLabel="Pending Approval"
            status={request.status}
            variant="pill"
          />
        }
        submittedAt={formatDetailDateTime(submissionDetails.submittedAt)}
      />
    </DetailSection>
  );
}
