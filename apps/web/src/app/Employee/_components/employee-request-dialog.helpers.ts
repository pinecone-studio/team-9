import { formatApprovalRoleLabel, formatDialogDateTime } from "./employee-benefit-request.helpers";
import type { HistoricalBenefitRequest } from "./employee-benefit-request.helpers";
import type { BenefitTimelineItem } from "./employee-benefit-request.helpers";
import type { EmployeeRequestItem } from "./employee-types";

export type RequestDialogBadgeTone =
  | "approved"
  | "cancelled"
  | "pending"
  | "rejected";

export type RequestDialogBadge = {
  label: EmployeeRequestItem["status"];
  tone: RequestDialogBadgeTone;
};

export function getRequestDialogBadge(
  status: EmployeeRequestItem["status"],
): RequestDialogBadge {
  if (status === "Accepted") {
    return { label: status, tone: "approved" };
  }

  if (status === "Rejected") {
    return { label: status, tone: "rejected" };
  }

  if (status === "Cancelled") {
    return { label: status, tone: "cancelled" };
  }

  return { label: status, tone: "pending" };
}

export function buildHistoricalTimelineItems(
  request: HistoricalBenefitRequest,
  status: EmployeeRequestItem["status"],
): BenefitTimelineItem[] {
  const reviewLabel = `Sent for ${formatApprovalRoleLabel(request.approval_role)} review`;
  const finalTimestamp = formatDialogDateTime(request.updated_at || request.created_at);

  if (status === "Accepted") {
    return [
      {
        id: `${request.id}-submitted`,
        label: "Request submitted",
        timestamp: formatDialogDateTime(request.created_at),
        tone: "neutral",
      },
      {
        id: `${request.id}-review`,
        label: reviewLabel,
        timestamp: formatDialogDateTime(request.created_at),
        tone: "neutral",
      },
      {
        id: `${request.id}-approved`,
        label: `Approved by ${formatApprovalRoleLabel(request.approval_role)}`,
        timestamp: finalTimestamp,
        tone: "success",
      },
    ];
  }

  if (status === "Rejected") {
    return [
      {
        id: `${request.id}-submitted`,
        label: "Request submitted",
        timestamp: formatDialogDateTime(request.created_at),
        tone: "neutral",
      },
      {
        id: `${request.id}-review`,
        label: reviewLabel,
        timestamp: formatDialogDateTime(request.created_at),
        tone: "neutral",
      },
      {
        id: `${request.id}-rejected`,
        label: `Rejected by ${formatApprovalRoleLabel(request.approval_role)}`,
        timestamp: finalTimestamp,
        tone: "danger",
      },
    ];
  }

  if (status === "Cancelled") {
    return [
      {
        id: `${request.id}-submitted`,
        label: "Request submitted",
        timestamp: formatDialogDateTime(request.created_at),
        tone: "neutral",
      },
      {
        id: `${request.id}-review`,
        label: reviewLabel,
        timestamp: formatDialogDateTime(request.created_at),
        tone: "neutral",
      },
      {
        id: `${request.id}-cancelled`,
        label: "Cancelled by employee",
        timestamp: finalTimestamp,
        tone: "neutral",
      },
    ];
  }

  return [
    {
      id: `${request.id}-submitted`,
      label: "Request submitted",
      timestamp: formatDialogDateTime(request.created_at),
      tone: "neutral",
    },
    {
      id: `${request.id}-review`,
      label: reviewLabel,
      timestamp: formatDialogDateTime(request.created_at),
      tone: "neutral",
    },
  ];
}
