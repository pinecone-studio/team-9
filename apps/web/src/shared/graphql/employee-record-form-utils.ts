"use client";

import { EmploymentStatus } from "@/shared/apollo/generated";
import type { Employee } from "@/shared/apollo/types";

export type EmployeeFormValues = {
  department: string;
  email: string;
  employmentStatus: EmploymentStatus;
  hireDate: string;
  lateArrivalCount: string;
  name: string;
  okrSubmitted: boolean;
  position: string;
  responsibilityLevel: string;
};

export type EmployeeFormOptions = {
  departments: string[];
  employmentStatuses: Array<{ label: string; value: string }>;
  responsibilityLevels: string[];
  roles: string[];
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPLOYMENT_STATUSES = [
  EmploymentStatus.Active,
  EmploymentStatus.Probation,
  EmploymentStatus.Leave,
  EmploymentStatus.Terminated,
];

function dedupe(values: Array<string | null | undefined>) {
  return [...new Set(values.map((value) => value?.trim() ?? "").filter(Boolean))];
}

function formatOptionLabel(value: string) {
  return value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function buildEmployeeFormValues(employee?: Employee | null): EmployeeFormValues {
  return {
    department: employee?.department ?? "",
    email: employee?.email ?? "",
    employmentStatus:
      (employee?.employmentStatus as EmploymentStatus | undefined) ??
      EmploymentStatus.Active,
    hireDate: toDisplayDateValue(employee?.hireDate ?? getTodayDate()),
    lateArrivalCount: String(employee?.lateArrivalCount ?? 0),
    name: employee?.name ?? "",
    okrSubmitted: employee?.okrSubmitted ?? false,
    position: employee?.position ?? "",
    responsibilityLevel: String(employee?.responsibilityLevel ?? 1),
  };
}

export function buildEmployeeFormOptions(
  employees: Employee[],
  employee?: Employee | null,
): EmployeeFormOptions {
  return {
    departments: dedupe([
      ...employees.map((item) => item.department),
      employee?.department,
    ]),
    employmentStatuses: EMPLOYMENT_STATUSES.map((value) => ({
      label: formatOptionLabel(value),
      value,
    })),
    responsibilityLevels: dedupe([
      "1",
      "2",
      "3",
      "4",
      "5",
      employee?.responsibilityLevel ? String(employee.responsibilityLevel) : null,
    ]),
    roles: dedupe([...employees.map((item) => item.position), employee?.position]),
  };
}

export function normalizeEmployeeDateInput(value: string) {
  return value.replace(/[^\d.-]/g, "").replace(/-/g, ".").slice(0, 10);
}

export function toDisplayDateValue(value: string) {
  return value.replace(/-/g, ".");
}

export function toNativeDateValue(value: string) {
  return value.replace(/\./g, "-");
}

export function validateEmployeeForm(
  values: EmployeeFormValues,
  requireIdentity: boolean,
) {
  if (requireIdentity && !values.name.trim()) {
    return "Employee name is required.";
  }

  if (requireIdentity && !EMAIL_PATTERN.test(values.email.trim().toLowerCase())) {
    return "A valid email address is required.";
  }

  if (!values.position.trim()) {
    return "Role is required.";
  }

  if (!values.department.trim()) {
    return "Department is required.";
  }

  const nativeHireDate = toNativeDateValue(values.hireDate.trim());
  if (!/^\d{4}-\d{2}-\d{2}$/.test(nativeHireDate)) {
    return "Hire date must use yyyy.mm.dd format.";
  }

  if (!Number.isFinite(Date.parse(`${nativeHireDate}T00:00:00.000Z`))) {
    return "Hire date is invalid.";
  }

  const responsibilityLevel = Number.parseInt(values.responsibilityLevel, 10);
  if (!Number.isInteger(responsibilityLevel) || responsibilityLevel < 1) {
    return "Responsibility level must be 1 or greater.";
  }

  const lateArrivalCount = Number.parseInt(values.lateArrivalCount, 10);
  if (!Number.isInteger(lateArrivalCount) || lateArrivalCount < 0) {
    return "Late arrivals must be zero or greater.";
  }

  return null;
}

export function toEmployeeMutationInput(values: EmployeeFormValues) {
  return {
    department: values.department.trim(),
    email: values.email.trim().toLowerCase(),
    employmentStatus: values.employmentStatus,
    hireDate: toNativeDateValue(values.hireDate.trim()),
    lateArrivalCount: Number.parseInt(values.lateArrivalCount, 10),
    name: values.name.trim(),
    okrSubmitted: values.okrSubmitted,
    position: values.position.trim(),
    responsibilityLevel: Number.parseInt(values.responsibilityLevel, 10),
  };
}
