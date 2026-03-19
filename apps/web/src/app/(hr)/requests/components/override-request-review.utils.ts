import type { ApprovalRequestQuery } from "./approval-requests.graphql";
import { formatApprovalRole, parseApprovalPayload, parseApprovalSnapshot } from "./approval-request-utils";
import { formatTableDateTime } from "./request-table-formatters";
import type { RequestPerson } from "./RequestPeopleContext";

type RequestRecord = NonNullable<ApprovalRequestQuery["approvalRequest"]>;
type EmployeeDialogData = {
  employee?: {
    department: string;
    employmentStatus: string;
    name: string;
    position: string;
  } | null;
  employeeEligibility: Array<{
    failedRuleMessages: string[];
    overrideExpiresAt?: string | null;
    overrideReason?: string | null;
    status: string;
    benefit: {
      category: string;
      id: string;
      title: string;
    };
  }>;
} | null;

function formatTitleCase(value: string | null | undefined, fallback = "-") {
  const normalized = value?.trim();
  if (!normalized) {
    return fallback;
  }

  return normalized
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function readText(source: Record<string, unknown> | null, key: string) {
  const value = source?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readTextList(source: Record<string, unknown> | null, key: string) {
  const value = source?.[key];
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export function buildOverrideReviewViewModel({
  currentUserName,
  currentUserRole,
  employeeData,
  request,
  requester,
  reviewer,
}: {
  currentUserName: string;
  currentUserRole: string;
  employeeData: EmployeeDialogData;
  request: RequestRecord;
  requester: RequestPerson | null;
  reviewer: RequestPerson | null;
}) {
  const payload = parseApprovalPayload(request);
  const snapshot = parseApprovalSnapshot(request) as Record<string, unknown> | null;
  const snapshotEmployeeRequest =
    snapshot && typeof snapshot.employeeRequest === "object" && snapshot.employeeRequest !== null
      ? (snapshot.employeeRequest as Record<string, unknown>)
      : null;
  const employeeRequest = payload.entityType === "benefit" ? payload.employeeRequest : null;
  const benefit = payload.entityType === "benefit" ? payload.benefit : null;
  const benefitId = employeeRequest?.benefitId ?? benefit?.id ?? request.entity_id ?? "";
  const eligibility = employeeData?.employeeEligibility.find((item) => item.benefit.id === benefitId);
  const blockingReasons = [
    ...readTextList(snapshot, "failedRuleMessages"),
    ...(eligibility?.failedRuleMessages ?? []),
  ];
  const overrideReason =
    eligibility?.overrideReason?.trim() ||
    readText(snapshot, "overrideReason") ||
    readText(payload as Record<string, unknown>, "overrideReason") ||
    request.review_comment?.trim() ||
    "-";
  const overrideExpiry =
    eligibility?.overrideExpiresAt?.trim() ||
    readText(snapshot, "overrideExpiresAt") ||
    readText(payload as Record<string, unknown>, "overrideExpiresAt") ||
    "-";
  const assignedName =
    reviewer?.name ||
    (request.status === "pending" ? currentUserName : formatApprovalRole(request.target_role));
  const assignedRole =
    reviewer?.position ||
    (request.status === "pending"
      ? formatApprovalRole(currentUserRole as typeof request.target_role)
      : formatApprovalRole(request.target_role));
  const currentStatus =
    readText(snapshotEmployeeRequest, "previousStatus") ||
    eligibility?.status ||
    employeeRequest?.previousStatus ||
    "locked";

  return {
    assignedRole,
    blockingReason: blockingReasons[0] ?? readText(snapshot, "blockingReason") ?? "-",
    benefitCategory: eligibility?.benefit.category || benefit?.category?.trim() || "-",
    benefitName: eligibility?.benefit.title || benefit?.name?.trim() || "Untitled Benefit",
    currentStatus: formatTitleCase(currentStatus),
    employeeDepartment: employeeData?.employee?.department?.trim() || "-",
    employeeName:
      employeeData?.employee?.name?.trim() ||
      requester?.name ||
      employeeRequest?.employeeName?.trim() ||
      "-",
    employeeRole:
      employeeData?.employee?.position?.trim() || requester?.position || "-",
    employmentStatus: formatTitleCase(
      employeeData?.employee?.employmentStatus || readText(snapshot, "employmentStatus"),
    ),
    justification: overrideReason,
    overrideType: formatTitleCase(
      readText(snapshot, "overrideType") ||
        readText(payload as Record<string, unknown>, "overrideType") ||
        (overrideExpiry !== "-" ? "temporary" : "permanent"),
    ),
    reviewerName: assignedName,
    reviewerRole: assignedRole,
    statusLabel: request.status === "pending" ? "Pending" : formatTitleCase(request.status),
    submittedAt: formatTableDateTime(request.created_at),
    submittedBy: requester?.name || "-",
    submittedByRole: requester?.position || formatApprovalRole(request.target_role),
    expiryDate: overrideExpiry === "-" ? "-" : overrideExpiry.slice(0, 10),
  };
}
