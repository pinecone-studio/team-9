import { formatDetailDateTimeWithAt } from "@/app/(hr)/requests/components/request-detail-formatters";
import type {
  AuditLogBenefitApprovalDetail,
  AuditLogBenefitRequestDetail,
  AuditLogEntry,
  AuditLogRuleApprovalDetail,
} from "./audit-log-types";
import type { ChangeSummaryItem } from "./audit-log-dialog-primitives";

export function getBenefitApprovalDialogState(
  entry: AuditLogEntry,
  detail: AuditLogBenefitApprovalDetail,
) {
  const isApproved = entry.result === "Approved";
  const isUpdate = detail.actionType === "update";
  const isArchived = isApproved && detail.actionType === "delete";
  const isRejectedUpdate = isUpdate && !isApproved;

  const changeSummaryItems = (
    isUpdate
      ? isRejectedUpdate
        ? [
            createChangeSummaryItem(
              "Monthly Amount",
              detail.previousMonthlyCap,
              detail.monthlyCap,
            ),
          ]
        : [
            createChangeSummaryItem(
              "Subsidy Percentage",
              detail.previousSubsidyPercentage,
              detail.subsidyPercentage,
            ),
            createChangeSummaryItem("Monthly Cap", detail.previousMonthlyCap, detail.monthlyCap),
          ]
      : []
  ).filter((item): item is ChangeSummaryItem => Boolean(item));

  return {
    changeSummaryItems,
    decisionNotes:
      detail.reviewComment?.trim() ||
      (isApproved
        ? "No decision notes were saved for this request."
        : "No rejection reason was saved for this request."),
    dialogEventLabel: isArchived ? "Benefit Archived" : entry.event,
    isApproved,
    isArchived,
    isRejectedUpdate,
    resultBadgeLabel: isArchived ? "Archived" : entry.result,
    showApproverRole: !isUpdate && !isArchived,
    showAttachedRules:
      isApproved && !isUpdate && !isArchived && detail.attachedRules.length > 0,
    showDecisionSection: !isArchived,
    showDescription: !isUpdate && !isArchived,
    showSubmissionDetails: !isArchived,
    showSubsidyPercentage: !isArchived,
    showVendor: !isRejectedUpdate && !isArchived,
  };
}

export function getBenefitRequestDecisionDialogState(
  entry: AuditLogEntry,
  request: AuditLogBenefitRequestDetail,
) {
  const isApproved = entry.result === "Approved";
  const isCancelled = entry.result === "Cancelled";
  const isActivated = isApproved && entry.event === "Benefit Activation Approved";
  const isDeactivated = isCancelled && entry.event === "Benefit Request Cancelled";
  const reviewerName =
    request.reviewed_by?.name?.trim() || entry.reviewedBy || "Unassigned reviewer";
  const reviewerRole =
    request.approval_role === "finance_manager" ? "Finance Manager" : "HR Admin";

  return {
    decisionNotes:
      request.reviewComment?.trim() ||
      (isApproved
        ? "No decision notes were saved for this request."
        : "No rejection reason was saved for this request."),
    decisionTitle: isActivated
      ? "Benefit Activated"
      : isDeactivated
        ? "Benefit Deactivated"
        : entry.event,
    isActivated,
    isApproved,
    isDeactivated,
    resultBadgeLabel: isActivated ? "Activated" : isDeactivated ? "Archived" : entry.result,
    reviewerName,
    reviewerRole,
    timelineEntries: [
      {
        colorClassName: "bg-[#2B7FFF]",
        id: "submitted",
        label: "Request Submitted",
        timestamp: formatDetailDateTimeWithAt(request.created_at),
      },
      ...(isApproved && request.contractAcceptedAt
        ? [{
            colorClassName: "bg-[#2B7FFF]",
            id: "contract-accepted",
            label: "Contract Accepted",
            timestamp: formatDetailDateTimeWithAt(request.contractAcceptedAt),
          }]
        : []),
      {
        colorClassName: isApproved ? "bg-[#00C950]" : "bg-[#FB2C36]",
        id: "reviewed",
        label: "Reviewed",
        timestamp: formatDetailDateTimeWithAt(request.updated_at),
      },
    ],
  };
}

export function getRuleDecisionDialogState(
  entry: AuditLogEntry,
  detail: AuditLogRuleApprovalDetail,
) {
  const isApproved = entry.result === "Approved";
  const isArchived = isApproved && detail.actionType === "delete";
  const changeSummaryItems = [
    createChangeSummaryItem(
      "Requirement Value",
      detail.previousRequirementValue,
      detail.requirementValue,
    ),
    createChangeSummaryItem(
      "Blocking Message",
      detail.previousBlockingMessage,
      detail.blockingMessage,
    ),
  ].filter((item): item is ChangeSummaryItem => Boolean(item));

  return {
    changeSummaryItems,
    dialogEventLabel: isArchived ? "Rule Archived" : entry.event,
    isApproved,
    isArchived,
    notesFallback: isApproved
      ? "No decision notes were saved for this request."
      : "No rejection reason was saved for this request.",
    resultBadgeLabel: isArchived ? "Archived" : entry.result,
    showChangeSummary: changeSummaryItems.length > 0,
    showNotesSection: !isArchived && (!isApproved || detail.actionType !== "update"),
    showSubmissionDetails: !isArchived,
    showTargetBenefits: !isArchived,
  };
}

function createChangeSummaryItem(
  label: string,
  previousValue: string | null | undefined,
  currentValue: string | null | undefined,
) {
  if (!previousValue || !currentValue || previousValue === currentValue) {
    return null;
  }

  return { currentValue, label, previousValue };
}
