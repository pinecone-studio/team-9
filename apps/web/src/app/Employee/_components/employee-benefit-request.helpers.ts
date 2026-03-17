import type { EmployeeBenefitRequestsQuery } from "@/shared/apollo/generated";

export type PendingBenefitRequest = EmployeeBenefitRequestsQuery["benefitRequests"][number];

export type BenefitTimelineItem = {
  id: string;
  label: string;
  timestamp: string;
  tone: "neutral" | "warning";
};

export function formatDialogDateTime(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "short",
  }).format(date).replace(",", " at");
}

export function formatApprovalRoleLabel(role: PendingBenefitRequest["approval_role"]) {
  return role === "finance_manager" ? "Finance" : "HR";
}

export function findPendingBenefitRequest(
  requests: EmployeeBenefitRequestsQuery["benefitRequests"],
  benefitId: string,
) {
  const pendingRequests = requests
    .filter((request) => {
      const normalizedStatus = request.status.trim().toLowerCase();
      return normalizedStatus === "pending" && request.benefit.id === benefitId;
    })
    .sort(
      (left, right) =>
        new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
    );

  return pendingRequests[0] ?? null;
}

export function buildPendingTimelineItems(
  request: PendingBenefitRequest | null,
): BenefitTimelineItem[] {
  if (!request) {
    return [];
  }

  return [
    {
      id: `${request.id}-submitted`,
      label: "Request submitted",
      timestamp: formatDialogDateTime(request.created_at),
      tone: "neutral",
    },
    {
      id: `${request.id}-review`,
      label: `Sent for ${formatApprovalRoleLabel(request.approval_role)} review`,
      timestamp: formatDialogDateTime(request.updated_at || request.created_at),
      tone: "warning",
    },
  ];
}

export function buildContractAgreementNote(request: PendingBenefitRequest | null) {
  if (!request) {
    return "This agreement was locked when the request was submitted.";
  }

  const details = [];

  if (request.contractAcceptedAt) {
    details.push(`Accepted ${formatDialogDateTime(request.contractAcceptedAt)}`);
  }
  if (request.contractVersionAccepted) {
    details.push(`Version ${request.contractVersionAccepted}`);
  }

  return details.join(" • ") || "This agreement was locked when the request was submitted.";
}
