import type {
  ApprovalRequestRecord,
  RequestsEmployeesDirectoryQuery,
} from "./approval-requests.graphql";
import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import { parseApprovalPayload } from "./approval-request-parsers";
import { isToday } from "./approval-request-time-formatters";

function normalizeValue(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function isOverrideApprovalRequest(request: ApprovalRequestRecord) {
  const payload = parseApprovalPayload(request);
  return payload.entityType === "benefit" && Boolean(payload.employeeRequest);
}

function isPendingAssignedToCurrentRole(
  request: ApprovalRequestRecord | BenefitRequestRecord,
  normalizedUserIdentifier: string,
  normalizedUserRole: string,
) {
  if ("approval_role" in request) {
    return (
      request.status === "pending" &&
      normalizeValue(request.approval_role) === normalizedUserRole &&
      normalizeValue(request.employee.email) !== normalizedUserIdentifier
    );
  }

  return (
    request.status === "pending" &&
    normalizeValue(request.target_role) === normalizedUserRole &&
    normalizeValue(request.requested_by) !== normalizedUserIdentifier
  );
}

export function splitApprovalRequests(requests: ApprovalRequestRecord[]) {
  const configurationRequests: ApprovalRequestRecord[] = [];
  const overrideRequests: ApprovalRequestRecord[] = [];

  for (const request of requests) {
    if (isOverrideApprovalRequest(request)) {
      overrideRequests.push(request);
      continue;
    }

    configurationRequests.push(request);
  }

  return {
    configurationRequests,
    overrideRequests,
  };
}

export function buildRequestsBoardMetrics({
  benefitRequests,
  configurationRequests,
  currentUserIdentifier,
  currentUserRole,
  overrideRequests,
}: {
  benefitRequests: BenefitRequestRecord[];
  configurationRequests: ApprovalRequestRecord[];
  currentUserIdentifier: string;
  currentUserRole: string;
  overrideRequests: ApprovalRequestRecord[];
}) {
  const normalizedUserIdentifier = normalizeValue(currentUserIdentifier);
  const normalizedUserRole = normalizeValue(currentUserRole);
  const approvalRequests = [...configurationRequests, ...overrideRequests];

  return {
    approvedToday:
      approvalRequests.filter(
        (request) => request.status === "approved" && isToday(request.reviewed_at),
      ).length +
      benefitRequests.filter(
        (request) => request.status === "approved" && isToday(request.updated_at),
      ).length,
    awaitingYourApproval:
      approvalRequests.filter((request) =>
        isPendingAssignedToCurrentRole(
          request,
          normalizedUserIdentifier,
          normalizedUserRole,
        ),
      ).length +
      benefitRequests.filter((request) =>
        isPendingAssignedToCurrentRole(
          request,
          normalizedUserIdentifier,
          normalizedUserRole,
        ),
      ).length,
    pendingOverrides: overrideRequests.filter((request) => request.status === "pending").length,
    pendingRequests:
      approvalRequests.filter((request) => request.status === "pending").length +
      benefitRequests.filter((request) => request.status === "pending").length,
    rejectedToday:
      approvalRequests.filter(
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

  return Object.fromEntries(
    rows.flatMap((employee) => {
      if (!employee?.name?.trim()) {
        return [];
      }

      const person = {
        name: employee.name.trim(),
        position: employee.position.trim() || null,
      };

      return [
        [employee.id.trim().toLowerCase(), person],
        [employee.email.trim().toLowerCase(), person],
      ] as const;
    }),
  );
}
