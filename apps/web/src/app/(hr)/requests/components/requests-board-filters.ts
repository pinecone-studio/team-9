import type { ApprovalRequestRecord } from "./approval-requests.graphql";
import { isToday } from "./approval-request-time-formatters";
import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import type { RequestsMetricKey } from "./RequestsBoardMetrics";

export type RequestsBoardTab = "benefit" | "configuration";

export const METRIC_LABELS: Record<RequestsMetricKey, string> = {
  approvedToday: "Approved Today",
  awaitingYourApproval: "Awaiting Your Approval",
  pendingOverrides: "Pending Override",
  pendingRequests: "Pending Requests",
  rejectedToday: "Rejected Today",
};

export function filterBenefitRequests(
  requests: BenefitRequestRecord[],
  activeMetric: RequestsMetricKey | null,
  normalizedUserIdentifier: string,
) {
  return requests.filter((request) => {
    switch (activeMetric) {
      case "approvedToday":
        return request.status === "approved" && isToday(request.updated_at);
      case "awaitingYourApproval":
        return (
          request.status === "pending" &&
          request.employee.email.trim().toLowerCase() !== normalizedUserIdentifier
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

export function filterConfigurationRequests(
  requests: ApprovalRequestRecord[],
  activeMetric: RequestsMetricKey | null,
  normalizedUserIdentifier: string,
) {
  return requests.filter((request) => {
    switch (activeMetric) {
      case "approvedToday":
        return request.status === "approved" && isToday(request.reviewed_at);
      case "awaitingYourApproval":
        return (
          request.status === "pending" &&
          request.requested_by.trim().toLowerCase() !== normalizedUserIdentifier
        );
      case "pendingOverrides":
        return (
          request.status === "pending" &&
          (request.action_type === "update" || request.action_type === "delete")
        );
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
  benefitCount: number,
  configurationCount: number,
) {
  if (!activeMetric) {
    return currentTab;
  }

  if (activeMetric === "pendingOverrides") {
    return "configuration";
  }

  if (currentTab === "benefit" && benefitCount === 0 && configurationCount > 0) {
    return "configuration";
  }

  if (currentTab === "configuration" && configurationCount === 0 && benefitCount > 0) {
    return "benefit";
  }

  return currentTab;
}
