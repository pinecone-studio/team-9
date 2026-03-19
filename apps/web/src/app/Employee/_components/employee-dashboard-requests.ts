import type {
  BenefitRequestsQueryResult,
  EmployeeBenefitStatusOverride,
} from "./employee-dashboard.graphql";
import {
  formatPerson,
  formatShortDate,
  getRequestStatusLabel,
  isCurrentUserRequest,
} from "./employee-dashboard-formatters";
import type { EmployeeBenefitCard, EmployeeRequestItem } from "./employee-types";

type BenefitRequest = BenefitRequestsQueryResult["benefitRequests"][number];

type RequestSummary = {
  pendingCount: number;
  requests: BenefitRequest[];
  statusByBenefitId: Map<string, EmployeeBenefitStatusOverride>;
};

export function buildRequestSummary(
  requests: BenefitRequestsQueryResult["benefitRequests"],
  employeeEmail: string | null,
  employeeName: string,
): RequestSummary {
  const scoped = requests
    .filter((request) =>
      isCurrentUserRequest(
        request.employee.email,
        request.employee.name,
        employeeEmail,
        employeeName,
      ),
    )
    .sort(
      (left, right) =>
        new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
    );
  const statusByBenefitId = new Map<string, EmployeeBenefitStatusOverride>();

  for (const request of scoped) {
    mapStatusByBenefit(request, statusByBenefitId);
  }

  return {
    pendingCount: scoped.filter((request) => request.status === "pending").length,
    requests: scoped,
    statusByBenefitId,
  };
}

export function mapRequests(
  requests: BenefitRequest[],
  benefitCardsById: Map<string, EmployeeBenefitCard>,
): EmployeeRequestItem[] {
  return requests.slice(0, 6).map((request) => ({
    benefit: request.benefit.title || "Benefit request",
    dialogCard:
      benefitCardsById.get(request.benefit.id) ?? buildFallbackDialogCard(request),
    id: request.id,
    request,
    reviewedBy: request.reviewed_by
      ? formatPerson(request.reviewed_by.name || request.reviewed_by.email)
      : "-",
    status: getRequestStatusLabel(request.status),
    submittedAt: formatShortDate(request.created_at),
  }));
}

function buildFallbackDialogCard(request: BenefitRequest): EmployeeBenefitCard {
  return {
    accent: "",
    approvalRole: request.benefit.approvalRole,
    badge: "",
    categoryId: request.benefit.categoryId,
    categoryName: request.benefit.category,
    description: request.benefit.description,
    dots: [],
    id: request.benefit.id,
    isActive: request.benefit.isActive,
    isCore: request.benefit.isCore,
    isOverridden: false,
    overrideReason: null,
    passed: "",
    requiresContract: request.benefit.requiresContract,
    ruleEvaluationJson: request.ruleEvaluationJson ?? "[]",
    status: mapRequestStatusToCardStatus(request.status),
    subsidyPercent: request.benefit.subsidyPercent ?? null,
    subsidyLabel: buildSubsidyLabel(
      request.benefit.subsidyPercent ?? null,
      request.benefit.vendorName ?? null,
    ),
    title: request.benefit.title,
    vendorName: request.benefit.vendorName ?? null,
  };
}

function buildSubsidyLabel(
  subsidyPercent: number | null,
  vendorName: string | null,
) {
  if (typeof subsidyPercent === "number") {
    return `${subsidyPercent}% subsidy${vendorName ? ` by ${vendorName}` : ""}`;
  }

  return vendorName || "No subsidy details";
}

function mapRequestStatusToCardStatus(status: BenefitRequest["status"]) {
  if (status === "approved") {
    return "Active" as const;
  }

  if (status === "pending") {
    return "Pending" as const;
  }

  return "Eligible" as const;
}

function mapStatusByBenefit(
  request: BenefitRequest,
  statusByBenefitId: Map<string, EmployeeBenefitStatusOverride>,
) {
  const benefitId = request.benefit.id;
  if (!benefitId || statusByBenefitId.has(benefitId)) {
    return;
  }

  if (request.status === "approved") {
    statusByBenefitId.set(benefitId, "Active");
    return;
  }

  if (request.status === "pending") {
    statusByBenefitId.set(benefitId, "Pending");
    return;
  }

  if (request.status === "rejected" || request.status === "cancelled") {
    statusByBenefitId.set(benefitId, "Eligible");
  }
}
