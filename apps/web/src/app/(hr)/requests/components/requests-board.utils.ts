import type {
  ApprovalRequestRecord,
  RequestsEmployeesDirectoryQuery,
} from "./approval-requests.graphql";
import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import { isToday } from "./approval-request-time-formatters";

export function buildRequestsBoardMetrics({
  benefitRequests,
  configurationRequests,
  currentUserIdentifier,
  requests,
  roleScopedRequests,
}: {
  benefitRequests: BenefitRequestRecord[];
  configurationRequests: ApprovalRequestRecord[];
  currentUserIdentifier: string;
  requests: ApprovalRequestRecord[];
  roleScopedRequests: ApprovalRequestRecord[];
}) {
  return {
    approvedToday:
      configurationRequests.filter(
        (request) => request.status === "approved" && isToday(request.reviewed_at),
      ).length +
      benefitRequests.filter(
        (request) => request.status === "approved" && isToday(request.updated_at),
      ).length,
    awaitingFinance:
      requests.filter(
        (request) => request.status === "pending" && request.target_role === "finance_manager",
      ).length +
      benefitRequests.filter(
        (request) => request.status === "pending" && request.approval_role === "finance_manager",
      ).length,
    awaitingYourApproval:
      configurationRequests.filter(
        (request) =>
          request.status === "pending" &&
          request.requested_by.trim().toLowerCase() !== currentUserIdentifier.trim().toLowerCase(),
      ).length +
      benefitRequests.filter(
        (request) =>
          request.status === "pending" &&
          request.employee.email.trim().toLowerCase() !== currentUserIdentifier.trim().toLowerCase(),
      ).length,
    pendingOverrides: roleScopedRequests.filter(
      (request) =>
        request.status === "pending" &&
        (request.action_type === "update" || request.action_type === "delete"),
    ).length,
    pendingRequests:
      configurationRequests.filter((request) => request.status === "pending").length +
      benefitRequests.filter((request) => request.status === "pending").length,
    rejectedToday:
      configurationRequests.filter(
        (request) => request.status === "rejected" && isToday(request.reviewed_at),
      ).length +
      benefitRequests.filter(
        (request) => request.status === "rejected" && isToday(request.updated_at),
      ).length,
  };
}

export function buildEmployeeDirectory(
  employees: RequestsEmployeesDirectoryQuery["employees"] | undefined,
) {
  const rows = employees ?? [];
  const entries = rows.flatMap((employee) => {
    const name = employee.name?.trim();
    if (!name) {
      return [];
    }

    return [
      [employee.id.trim().toLowerCase(), name],
      [employee.email.trim().toLowerCase(), name],
    ] as const;
  });

  return Object.fromEntries(entries);
}
