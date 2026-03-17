import type { EmployeeBenefitCard, SummaryCard } from "./employee-types";

export function buildSummaryCards(
  benefitCards: EmployeeBenefitCard[],
  pendingRequestCount: number,
): SummaryCard[] {
  const activeCount = benefitCards.filter((card) => card.status === "Active").length;
  const eligibleCount = benefitCards.filter(
    (card) => card.status === "Eligible",
  ).length;
  const lockedCount = benefitCards.filter((card) => card.status === "Locked").length;

  return [
    {
      color: "#22C55E",
      icon: "check",
      label: "Active Benefits",
      value: String(activeCount),
    },
    {
      color: "#2563EB",
      icon: "clover",
      label: "Eligible Benefits",
      value: String(eligibleCount),
    },
    {
      color: "#6B7280",
      icon: "lock",
      label: "Locked Benefits",
      value: String(lockedCount),
    },
    {
      color: "#F59E0B",
      icon: "clock",
      label: "Pending Requests",
      value: String(pendingRequestCount),
    },
  ];
}
