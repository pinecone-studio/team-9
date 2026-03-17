import type {
  ApprovalRequestsQueryResult,
  EmployeeBenefitStatusOverride,
} from "./employee-dashboard.graphql";
import {
  extractBenefitName,
  extractEmployeeRequestBenefitId,
  formatPerson,
  formatShortDate,
  getRequestStatusLabel,
  isCurrentUserRequest,
} from "./employee-dashboard-formatters";
import type { EmployeeRequestItem } from "./employee-types";

type ApprovalRequest = NonNullable<ApprovalRequestsQueryResult["approvalRequests"]>[number];

type RequestMapResult = {
  pendingCount: number;
  requests: EmployeeRequestItem[];
  statusByBenefitId: Map<string, EmployeeBenefitStatusOverride>;
};

export function mapRequests(
  requests: NonNullable<ApprovalRequestsQueryResult["approvalRequests"]>,
  employeeEmail: string | null,
  employeeName: string,
  benefitNameById: Map<string, string>,
): RequestMapResult {
  const scoped = requests
    .filter(
      (request) =>
        request.entity_type === "benefit" &&
        isCurrentUserRequest(request.requested_by, employeeEmail, employeeName),
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  const statusByBenefitId = new Map<string, EmployeeBenefitStatusOverride>();

  for (const request of scoped) {
    mapStatusByBenefit(request, statusByBenefitId);
  }

  const mapped: EmployeeRequestItem[] = scoped.slice(0, 6).map((request) => ({
    benefit:
      extractBenefitName(request.payload_json) ??
      (request.entity_id ? benefitNameById.get(request.entity_id) : null) ??
      "Benefit request",
    id: request.id,
    reviewedBy: request.reviewed_by ? formatPerson(request.reviewed_by) : "-",
    status: getRequestStatusLabel(request.status),
    submittedAt: formatShortDate(request.created_at),
  }));

  const pendingCount = scoped.filter(
    (request) => request.status.trim().toLowerCase() === "pending",
  ).length;

  return {
    pendingCount,
    requests: mapped,
    statusByBenefitId,
  };
}

function mapStatusByBenefit(
  request: ApprovalRequest,
  statusByBenefitId: Map<string, EmployeeBenefitStatusOverride>,
) {
  const benefitId =
    extractEmployeeRequestBenefitId(request.payload_json) ?? request.entity_id ?? null;

  if (!benefitId || statusByBenefitId.has(benefitId)) {
    return;
  }

  const normalizedStatus = request.status.trim().toLowerCase();

  if (normalizedStatus === "approved") {
    statusByBenefitId.set(benefitId, "Active");
    return;
  }

  if (normalizedStatus === "pending") {
    statusByBenefitId.set(benefitId, "Pending");
    return;
  }

  if (normalizedStatus === "rejected") {
    statusByBenefitId.set(benefitId, "Eligible");
  }
}
