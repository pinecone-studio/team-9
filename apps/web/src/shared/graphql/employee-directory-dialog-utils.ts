import type { EmployeeDirectoryDialogQuery } from "@/shared/apollo/generated";
import { getTenureMonths } from "@/shared/graphql/employees-page-utils";
import { normalizeStatus } from "@/shared/graphql/employees-page-view-utils";

export const BENEFIT_STATUS_ORDER = [
  "locked",
  "pending",
  "eligible",
  "active",
] as const;

export type BenefitStatus = (typeof BENEFIT_STATUS_ORDER)[number];
export type EmployeeDirectoryBenefit = NonNullable<
  NonNullable<EmployeeDirectoryDialogQuery["employeeEligibility"]>[number]
>;
export type EmployeeDirectoryEmployee = NonNullable<
  EmployeeDirectoryDialogQuery["employee"]
>;
export type EmployeeDirectoryRequest = NonNullable<
  NonNullable<EmployeeDirectoryDialogQuery["benefitRequests"]>[number]
>;

export function formatDateLabel(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export function formatStatusLabel(value: string) {
  return value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function getTenureLabel(hireDate: string) {
  return getTenureMonths(hireDate);
}

export function getProbationSignal(status: string) {
  return normalizeStatus(status) === "probation" ? "In Progress" : "Completed";
}

export function getBooleanSignalClass(value: boolean) {
  return value
    ? "bg-[#DCFCE7] text-[#016630]"
    : "bg-[#FEF3C6] text-[#973C00]";
}

export function getBenefitStatusClass(status: string) {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "active") {
    return "bg-[#DCFCE7] text-[#016630]";
  }

  if (normalizedStatus === "eligible") {
    return "bg-[#DBEAFE] text-[#193CB8]";
  }

  if (normalizedStatus === "pending") {
    return "bg-[#FEF3C6] text-[#973C00]";
  }

  return "bg-[#FEF2F2] text-[#C10007]";
}

export function getRequestStatusClass(status: string) {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "approved") {
    return "bg-[#DCFCE7] text-[#016630]";
  }

  if (normalizedStatus === "pending") {
    return "bg-[#FEF3C6] text-[#973C00]";
  }

  if (normalizedStatus === "cancelled") {
    return "bg-[#F4F4F5] text-[#52525B]";
  }

  return "bg-[#FEF2F2] text-[#C10007]";
}

export function groupBenefitsByStatus(benefits: EmployeeDirectoryBenefit[]) {
  return BENEFIT_STATUS_ORDER.reduce(
    (groups, status) => ({
      ...groups,
      [status]: benefits.filter(
        (benefit) => normalizeStatus(benefit.status) === status,
      ),
    }),
    {
      active: [] as EmployeeDirectoryBenefit[],
      eligible: [] as EmployeeDirectoryBenefit[],
      locked: [] as EmployeeDirectoryBenefit[],
      pending: [] as EmployeeDirectoryBenefit[],
    },
  );
}

export function getBenefitMessage(benefit: EmployeeDirectoryBenefit) {
  const overrideReason = benefit.overrideReason?.trim();
  const normalizedStatus = normalizeStatus(benefit.status);

  if (overrideReason && normalizedStatus !== "locked") {
    return overrideReason;
  }

  if (benefit.failedRuleMessages.length > 0) {
    return benefit.failedRuleMessages[0];
  }

  if (normalizedStatus === "pending") {
    return "Waiting for approval before this benefit becomes active.";
  }

  if (normalizedStatus === "eligible") {
    return "Eligible and ready for activation by the employee.";
  }

  return "Benefit is currently active for this employee.";
}
