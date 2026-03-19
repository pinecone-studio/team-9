import type { ApprovalRequestQuery } from "./approval-requests.graphql";
import { formatApprovalRole } from "./approval-request-utils";
import { formatTableDateTime } from "./request-table-formatters";
import type { RequestPerson } from "./RequestPeopleContext";

type RequestRecord = NonNullable<ApprovalRequestQuery["approvalRequest"]>;
type EmployeeData = {
  employee?: {
    department: string;
    employmentStatus: string;
    lateArrivalCount: number;
    name: string;
    okrSubmitted: boolean;
    position: string;
    responsibilityLevel: number;
  } | null;
} | null;

function parseRecord(value?: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function readText(source: Record<string, unknown> | null, ...keys: string[]) {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function readNumber(source: Record<string, unknown> | null, ...keys: string[]) {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return null;
}

function readBoolean(source: Record<string, unknown> | null, ...keys: string[]) {
  for (const key of keys) {
    const value = source?.[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      if (value === "true") return true;
      if (value === "false") return false;
    }
  }
  return null;
}

function readEmployeeId(source: Record<string, unknown> | null) {
  return readText(source, "employeeId", "employee_id");
}

function formatTitle(value: string | null | undefined, fallback = "-") {
  const normalized = value?.trim();
  if (!normalized) return fallback;
  return normalized
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function formatLevel(value: number | null) {
  return value === null ? "-" : `Level ${value}`;
}

function formatBoolean(value: boolean | null) {
  return value === null ? "-" : value ? "Yes" : "No";
}

function formatProbationStatus(value: string | null) {
  if (!value) return "-";
  return value.trim().toLowerCase() === "probation" ? "Active" : "Completed";
}

export function extractDataUpdateEmployeeId(request: RequestRecord) {
  return readEmployeeId(parseRecord(request.payload_json)) ?? readEmployeeId(parseRecord(request.snapshot_json)) ?? request.entity_id ?? null;
}

export function buildDataUpdateReviewViewModel({
  currentUserName,
  currentUserRole,
  employeeData,
  request,
  requester,
  reviewer,
}: {
  currentUserName: string;
  currentUserRole: string;
  employeeData: EmployeeData;
  request: RequestRecord;
  requester: RequestPerson | null;
  reviewer: RequestPerson | null;
}) {
  const payload = parseRecord(request.payload_json);
  const snapshot = parseRecord(request.snapshot_json);
  const assignedName =
    reviewer?.name ||
    (request.status === "pending" ? currentUserName : formatApprovalRole(request.target_role));
  const assignedRole =
    reviewer?.position ||
    (request.status === "pending"
      ? formatApprovalRole(currentUserRole as typeof request.target_role)
      : formatApprovalRole(request.target_role));

  const previousEmployment = readText(snapshot, "employmentStatus", "employment_status");
  const nextEmployment =
    readText(payload, "employmentStatus", "employment_status") ||
    employeeData?.employee?.employmentStatus ||
    null;
  const rows = [
    {
      label: "Late Arrivals",
      previousValue: String(readNumber(snapshot, "lateArrivalCount", "late_arrival_count") ?? "-"),
      nextValue: String(readNumber(payload, "lateArrivalCount", "late_arrival_count") ?? employeeData?.employee?.lateArrivalCount ?? "-"),
    },
    {
      label: "Probation Status",
      previousValue: formatProbationStatus(previousEmployment),
      nextValue: formatProbationStatus(nextEmployment),
    },
    {
      label: "Responsibility Level",
      previousValue: formatLevel(readNumber(snapshot, "responsibilityLevel", "responsibility_level")),
      nextValue: formatLevel(readNumber(payload, "responsibilityLevel", "responsibility_level") ?? employeeData?.employee?.responsibilityLevel ?? null),
    },
    {
      label: "OKR Submitted",
      previousValue: formatBoolean(readBoolean(snapshot, "okrSubmitted", "okr_submitted")),
      nextValue: formatBoolean(readBoolean(payload, "okrSubmitted", "okr_submitted") ?? employeeData?.employee?.okrSubmitted ?? null),
    },
  ].filter((row) => row.previousValue !== "-" || row.nextValue !== "-");

  return {
    employeeDepartment: employeeData?.employee?.department?.trim() || readText(payload, "department") || "-",
    employeeName: employeeData?.employee?.name?.trim() || readText(payload, "employeeName", "name") || requester?.name || "-",
    employeeRole: employeeData?.employee?.position?.trim() || readText(payload, "position", "role") || requester?.position || "-",
    employmentStatus: formatTitle(nextEmployment),
    requestedChanges: rows,
    reviewerName: assignedName,
    reviewerRole: assignedRole,
    statusLabel: request.status === "pending" ? "Pending" : formatTitle(request.status),
    submittedAt: formatTableDateTime(request.created_at),
    submittedBy: requester?.name || "-",
    submittedByRole: requester?.position || formatApprovalRole(request.target_role),
  };
}
