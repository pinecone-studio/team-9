import type { ApprovalRequestRecord } from "./approval-requests.graphql";
import { parseApprovalPayload } from "./approval-request-parsers";

function isEmployeeBenefitActivationRequest(request: ApprovalRequestRecord) {
  if (request.entity_type !== "benefit") {
    return false;
  }

  const payload = parseApprovalPayload(request);
  return payload.entityType === "benefit" && Boolean(payload.employeeRequest);
}

export function formatApprovalRole(
  role: ApprovalRequestRecord["target_role"] | "finance_manager" | "hr_admin",
) {
  return String(role) === "finance_manager" ? "Finance Manager" : "HR Admin";
}

export function formatApprovalRoleShort(
  role: ApprovalRequestRecord["target_role"] | "finance_manager" | "hr_admin",
) {
  return String(role) === "finance_manager" ? "Finance" : "HR";
}

export function formatApprovalAction(
  action: ApprovalRequestRecord["action_type"] | "create" | "update" | "delete",
) {
  if (String(action) === "create") return "Create";
  if (String(action) === "update") return "Update";
  return "Delete";
}

export function formatApprovalRequestAction(request: ApprovalRequestRecord) {
  if (isEmployeeBenefitActivationRequest(request)) {
    return "Activate";
  }

  return formatApprovalAction(request.action_type);
}

export function formatApprovalStatus(
  status: ApprovalRequestRecord["status"] | "approved" | "pending" | "rejected",
) {
  if (String(status) === "approved") return "Approved";
  if (String(status) === "rejected") return "Rejected";
  return "Pending";
}

export function formatApprovalRequestTitle(request: ApprovalRequestRecord) {
  return `${formatApprovalRequestAction(request)} ${
    request.entity_type === "benefit" ? "Benefit" : "Rule"
  }`;
}

export function formatApprovalRequestName(request: ApprovalRequestRecord) {
  const payload = parseApprovalPayload(request);
  return payload.entityType === "benefit"
    ? payload.benefit?.name?.trim() || "Untitled Benefit"
    : payload.rule?.name?.trim() || "Untitled Rule";
}

export function formatPersonLabel(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  const normalized = value.trim();
  if (!normalized) {
    return "-";
  }

  const emailLocal = normalized.includes("@")
    ? normalized.split("@")[0] ?? normalized
    : normalized;

  return emailLocal
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatJsonLikeValue(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (typeof parsed === "string" || typeof parsed === "number") {
      return String(parsed);
    }

    if (Array.isArray(parsed)) {
      return parsed.join(", ");
    }

    return value;
  } catch {
    return value;
  }
}
