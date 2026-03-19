import type { ApprovalRequestRecord } from "./approval-requests.graphql";
import { isToday } from "./approval-request-time-formatters";
import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import type { RequestsMetricKey } from "./RequestsBoardMetrics";

export type RequestsBoardTab = "benefit" | "configuration" | "override";

export const METRIC_LABELS: Record<RequestsMetricKey, string> = {
  approvedToday: "Approved Today",
  awaitingYourApproval: "Awaiting Your Approval",
  pendingOverrides: "Pending Override",
  pendingRequests: "Pending Requests",
  rejectedToday: "Rejected Today",
};

function normalizeValue(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function filterBenefitRequests(
  requests: BenefitRequestRecord[],
  activeMetric: RequestsMetricKey | null,
  normalizedUserIdentifier: string,
  normalizedUserRole: string,
) {
  return requests.filter((request) => {
    switch (activeMetric) {
      case "approvedToday":
        return request.status === "approved" && isToday(request.updated_at);
      case "awaitingYourApproval":
        return (
          request.status === "pending" &&
          normalizeValue(request.approval_role) === normalizedUserRole &&
          normalizeValue(request.employee.email) !== normalizedUserIdentifier
        );
      case "pendingOverrides":
        return false;
      case "pendingRequests":
        return request.status === "pending";
      case "rejectedToday":
        return request.status === "rejected" && isToday(request.updated_at);
      default:
        return true;
    }
  });
}

export function filterApprovalRequests(
  requests: ApprovalRequestRecord[],
  activeMetric: RequestsMetricKey | null,
  normalizedUserIdentifier: string,
  normalizedUserRole: string,
) {
  return requests.filter((request) => {
    switch (activeMetric) {
      case "approvedToday":
        return request.status === "approved" && isToday(request.reviewed_at);
      case "awaitingYourApproval":
        return (
          request.status === "pending" &&
          normalizeValue(request.target_role) === normalizedUserRole &&
          normalizeValue(request.requested_by) !== normalizedUserIdentifier
        );
      case "pendingOverrides":
        return request.status === "pending";
      case "pendingRequests":
        return request.status === "pending";
      case "rejectedToday":
        return request.status === "rejected" && isToday(request.reviewed_at);
      default:
        return true;
    }
  });
}

export function getTabForMetric(
  activeMetric: RequestsMetricKey | null,
  currentTab: RequestsBoardTab,
  counts: Record<RequestsBoardTab, number>,
) {
  if (!activeMetric) {
    return currentTab;
  }

  const preferredTabs: RequestsBoardTab[] =
    activeMetric === "pendingOverrides"
      ? ["override", "benefit", "configuration"]
      : [currentTab, "benefit", "configuration", "override"];

  for (const tab of preferredTabs) {
    if (counts[tab] > 0) {
      return tab;
    }
  }

  return currentTab;
}
