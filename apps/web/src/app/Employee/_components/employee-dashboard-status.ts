import type { EmployeeBenefitStatus } from "./employee-types";

export function toStatusLabel(status: string): EmployeeBenefitStatus {
  const normalizedStatus = status.trim().toLowerCase();

  if (normalizedStatus === "active") {
    return "Active";
  }

  if (normalizedStatus === "eligible") {
    return "Eligible";
  }

  if (normalizedStatus === "pending") {
    return "Pending";
  }

  if (normalizedStatus === "inactive") {
    return "Inactive";
  }

  return "Locked";
}

export function toBadgeClass(status: EmployeeBenefitStatus) {
  if (status === "Eligible") {
    return "bg-[#E8EEFF] text-[#2F6BFF]";
  }

  if (status === "Active") {
    return "bg-[#DCFCE7] text-[#16A34A]";
  }

  if (status === "Pending") {
    return "bg-[#FEF3C7] text-[#D97706]";
  }

  return "bg-[#F3F4F6] text-[#9CA3AF]";
}
