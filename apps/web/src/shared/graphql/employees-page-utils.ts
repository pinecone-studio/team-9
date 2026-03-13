import type { BenefitEligibility } from "@/shared/apollo/types";

export type EligibilitySummary = {
  active: number;
  eligible: number;
  locked: number;
};

export function buildEligibilitySummary(
  items: BenefitEligibility[],
): EligibilitySummary {
  return items.reduce(
    (acc, item) => {
      const status = item.status.toLowerCase();

      if (status === "active") {
        acc.active += 1;
      }

      if (status === "eligible") {
        acc.eligible += 1;
      }

      if (status === "locked") {
        acc.locked += 1;
      }

      return acc;
    },
    { active: 0, eligible: 0, locked: 0 },
  );
}

export function getInitials(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || "NA";
}

export function getTenureMonths(hireDate: string) {
  const parsedDate = new Date(hireDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown";
  }

  const today = new Date();
  const years = today.getFullYear() - parsedDate.getFullYear();
  const months = today.getMonth() - parsedDate.getMonth();
  const totalMonths = Math.max(0, years * 12 + months);

  return `${totalMonths} months`;
}

export function getStatusTone(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "active") {
    return "border-[#abd5ad] bg-[#edf8ed] text-[#1f8a35]";
  }

  if (normalizedStatus === "probation") {
    return "border-[#f2d19a] bg-[#fff6e8] text-[#d98508]";
  }

  return "border-[#d8dbe2] bg-[#f4f5f7] text-slate-600";
}
