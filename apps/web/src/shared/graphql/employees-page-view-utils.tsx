import type { Employee } from "@/shared/apollo/types";

type FlagTone = "critical" | "warning";

export type EmployeeFlag = {
  label: string;
  tone: FlagTone;
};

const LATE_ARRIVAL_CRITICAL_THRESHOLD = 3;

type EmployeeFlagSource = Pick<
  Employee,
  "employmentStatus" | "lateArrivalCount" | "okrSubmitted"
>;

function pluralizeLateArrivals(count: number) {
  return `${count} late arrival${count === 1 ? "" : "s"}`;
}

export function normalizeStatus(status: string) {
  return status.trim().toLowerCase();
}

export function getStatusBadgeTone(status: string) {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "active") {
    return "bg-[#DCFCE7] text-[#016630]";
  }

  if (normalizedStatus === "probation") {
    return "bg-[#FEF3C6] text-[#973C00]";
  }

  if (normalizedStatus === "leave") {
    return "bg-[#DBEAFE] text-[#193CB8]";
  }

  return "bg-[#F4F4F5] text-[#52525B]";
}

export function getFlags(employee: EmployeeFlagSource): EmployeeFlag[] {
  const flags: EmployeeFlag[] = [];

  if (!employee.okrSubmitted) {
    flags.push({ label: "OKR missing", tone: "warning" });
  }

  if (employee.lateArrivalCount > 0) {
    flags.push({
      label: pluralizeLateArrivals(employee.lateArrivalCount),
      tone:
        employee.lateArrivalCount >= LATE_ARRIVAL_CRITICAL_THRESHOLD
          ? "critical"
          : "warning",
    });
  }

  if (normalizeStatus(employee.employmentStatus) === "probation") {
    flags.push({ label: "On probation", tone: "warning" });
  }

  return flags;
}

export function getFlagTone(flagTone: FlagTone) {
  if (flagTone === "critical") {
    return "border-[#FFA2A2] bg-[#FEF2F2] text-[#C10007]";
  }

  return "border-[#FFD230] bg-[#FFFBEB] text-[#BB4D00]";
}
