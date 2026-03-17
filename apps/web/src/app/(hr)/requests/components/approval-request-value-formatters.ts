import type { ApprovalRequestRecord } from "./approval-requests.graphql";
import { parseApprovalPayload, parseApprovalSnapshot } from "./approval-request-parsers";
import { formatShortDateTime } from "./approval-request-time-formatters";

export function formatApprovalRole(role: ApprovalRequestRecord["target_role"]) {
  return role === "finance_manager" ? "Finance Manager" : "HR Admin";
}

export function formatApprovalAction(
  action: ApprovalRequestRecord["action_type"],
) {
  if (action === "create") return "Create";
  if (action === "update") return "Update";
  return "Delete";
}

function isEmployeeBenefitActivationRequest(request: ApprovalRequestRecord) {
  if (request.entity_type !== "benefit") {
    return false;
  }

  const payload = parseApprovalPayload(request);
  return payload.entityType === "benefit" && Boolean(payload.employeeRequest);
}

export function formatApprovalRequestAction(request: ApprovalRequestRecord) {
  if (isEmployeeBenefitActivationRequest(request)) {
    return "Activate";
  }

  return formatApprovalAction(request.action_type);
}

export function formatApprovalStatus(
  status: ApprovalRequestRecord["status"],
) {
  if (status === "approved") {
    return "Approved";
  }

  if (status === "rejected") {
    return "Rejected";
  }

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

export function formatRequestChangeSummary(request: ApprovalRequestRecord) {
  const payload = parseApprovalPayload(request);
  const snapshot = parseApprovalSnapshot(request) as Record<string, unknown> | null;

  if (request.entity_type === "rule") {
    if (request.action_type === "create") {
      return "New rule creation";
    }

    if (request.action_type === "update") {
      return "Rule configuration updated";
    }

    return "Rule deletion request";
  }

  if (request.action_type === "create") {
    return "New benefit creation";
  }

  if (isEmployeeBenefitActivationRequest(request)) {
    return "Employee benefit activation request";
  }

  const previousSubsidy =
    typeof snapshot?.subsidyPercent === "number"
      ? snapshot.subsidyPercent
      : typeof snapshot?.subsidyPercent === "string"
        ? Number(snapshot.subsidyPercent)
        : null;
  const nextSubsidy =
    payload.entityType === "benefit" ? payload.benefit?.subsidyPercent ?? null : null;

  if (
    previousSubsidy !== null &&
    nextSubsidy !== null &&
    previousSubsidy !== nextSubsidy
  ) {
    return `Subsidy percentage: ${previousSubsidy}% -> ${nextSubsidy}%`;
  }

  return "Benefit configuration updated";
}

export function formatProgressLabel(request: ApprovalRequestRecord) {
  if (request.status === "approved") {
    return request.reviewed_at
      ? `Approved ${formatShortDateTime(request.reviewed_at)}`
      : "Approved";
  }

  if (request.status === "rejected") {
    return request.reviewed_at
      ? `Rejected ${formatShortDateTime(request.reviewed_at)}`
      : "Rejected";
  }

  if (isEmployeeBenefitActivationRequest(request)) {
    return `Waiting for ${formatApprovalRole(request.target_role)} approval`;
  }

  return `Waiting for ${formatApprovalRole(request.target_role)}`;
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
