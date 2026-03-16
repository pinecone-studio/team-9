import type { EmployeeBenefitCard } from "./employee-types";

type BenefitRequestBase = {
  card: EmployeeBenefitCard;
  employeeEmail: string | null;
  employeeId: string;
};

type BenefitRequestPayloadInput = BenefitRequestBase & {
  employeeName: string;
};

export function buildEmployeeBenefitRequestPayload({
  card,
  employeeEmail,
  employeeId,
  employeeName,
}: BenefitRequestPayloadInput) {
  return JSON.stringify({
    benefit: {
      approvalRole: card.approvalRole,
      categoryId: card.categoryId,
      description: card.description,
      id: card.id,
      isActive: card.isActive,
      isCore: card.isCore,
      name: card.title,
      requiresContract: card.requiresContract,
      subsidyPercent: card.subsidyPercent,
      vendorName: card.vendorName,
    },
    employeeRequest: {
      benefitId: card.id,
      employeeEmail,
      employeeId,
      employeeName,
      requestedStatus: "active",
    },
  });
}

export function buildEmployeeBenefitRequestSnapshot({
  card,
  employeeEmail,
  employeeId,
}: BenefitRequestBase) {
  return JSON.stringify({
    employeeRequest: {
      benefitId: card.id,
      employeeEmail,
      employeeId,
      previousStatus: card.status.toLowerCase(),
      requestedStatus: "active",
    },
  });
}
