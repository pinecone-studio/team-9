import { parseJson } from "./employee-dashboard-json";
import type { EmployeeRequestItem } from "./employee-types";

export function formatShortDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function formatPerson(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  const normalized = value.trim();

  if (!normalized) {
    return "-";
  }

  if (!normalized.includes("@")) {
    return normalized;
  }

  const localPart = normalized.split("@")[0] ?? "";
  const prettified = localPart
    .replace(/[._-]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");

  return prettified || normalized;
}

export function extractBenefitName(payloadJson: string) {
  const parsed = parseJson(payloadJson);

  if (!parsed) {
    return null;
  }

  const benefitValue = parsed.benefit;

  if (!benefitValue || typeof benefitValue !== "object") {
    return null;
  }

  const benefit = benefitValue as Record<string, unknown>;
  const name = benefit.name;
  const title = benefit.title;

  if (typeof name === "string" && name.trim()) {
    return name.trim();
  }

  if (typeof title === "string" && title.trim()) {
    return title.trim();
  }

  return null;
}

export function extractEmployeeRequestBenefitId(payloadJson: string) {
  const parsed = parseJson(payloadJson);

  if (!parsed) {
    return null;
  }

  const employeeRequest = parsed.employeeRequest;

  if (!employeeRequest || typeof employeeRequest !== "object") {
    return null;
  }

  const benefitId = (employeeRequest as Record<string, unknown>).benefitId;

  if (typeof benefitId !== "string" || !benefitId.trim()) {
    return null;
  }

  return benefitId.trim();
}

export function isCurrentUserRequest(
  requestEmployeeEmail: string,
  requestEmployeeName: string,
  employeeEmail: string | null,
  employeeName: string,
) {
  const normalizedRequestEmail = requestEmployeeEmail.trim().toLowerCase();
  const normalizedRequestName = requestEmployeeName.trim().toLowerCase();
  const normalizedEmail = employeeEmail?.trim().toLowerCase() ?? "";
  const normalizedName = employeeName.trim().toLowerCase();

  if (!normalizedRequestEmail && !normalizedRequestName) {
    return false;
  }

  return (
    normalizedRequestEmail === normalizedEmail ||
    normalizedRequestName === normalizedName
  );
}

export function getRequestStatusLabel(status: string): EmployeeRequestItem["status"] {
  const normalizedStatus = status.trim().toLowerCase();

  if (normalizedStatus === "approved") {
    return "Accepted";
  }

  if (normalizedStatus === "rejected") {
    return "Rejected";
  }

  return "Pending";
}
