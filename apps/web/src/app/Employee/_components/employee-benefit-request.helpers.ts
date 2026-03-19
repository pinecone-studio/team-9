import type {
  EmployeeBenefitDialogQuery,
  EmployeeBenefitRequestsQuery,
} from "@/shared/apollo/generated";

type BenefitRequestRecord =
  | EmployeeBenefitDialogQuery["benefitRequests"][number]
  | EmployeeBenefitRequestsQuery["benefitRequests"][number];

export type ActiveBenefitRequest = BenefitRequestRecord;
export type HistoricalBenefitRequest = BenefitRequestRecord;
export type PendingBenefitRequest = BenefitRequestRecord;

export type BenefitTimelineItem = {
  id: string;
  label: string;
  timestamp: string;
  tone: "danger" | "neutral" | "success";
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

function findBenefitRequest(
  requests: readonly BenefitRequestRecord[],
  benefitId: string,
  statuses: readonly string[],
) {
  const matchingRequests = requests
    .filter((request) => {
      const normalizedStatus = request.status.trim().toLowerCase();
      return statuses.includes(normalizedStatus) && request.benefit.id === benefitId;
    })
    .sort(
      (left, right) =>
        new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
    );

  return matchingRequests[0] ?? null;
}

export function findApprovedBenefitRequest(
  requests: readonly BenefitRequestRecord[],
  benefitId: string,
) {
  return findBenefitRequest(requests, benefitId, ["approved"]);
}

export function findPendingBenefitRequest(
  requests: readonly BenefitRequestRecord[],
  benefitId: string,
) {
  return findBenefitRequest(requests, benefitId, ["pending"]);
}

export function findBenefitRequestById(
  requests: readonly BenefitRequestRecord[],
  requestId: string,
) {
  return requests.find((request) => request.id === requestId) ?? null;
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
      timestamp: formatDialogDateTime(request.created_at),
      tone: "neutral",
    },
  ];
}

export function buildActiveTimelineItems(
  request: ActiveBenefitRequest | null,
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
      timestamp: formatDialogDateTime(request.created_at),
      tone: "neutral",
    },
    {
      id: `${request.id}-approved`,
      label: `Approved by ${formatApprovalRoleLabel(request.approval_role)}`,
      timestamp: formatDialogDateTime(request.updated_at || request.created_at),
      tone: "success",
    },
  ];
}

export function buildContractAgreementNote(
  request: PendingBenefitRequest | ActiveBenefitRequest | null,
  fallback = "This agreement was locked when the request was submitted.",
) {
  if (!request) {
    return fallback;
  }

  const details = [];

  if (request.contractAcceptedAt) {
    details.push(`Accepted ${formatDialogDateTime(request.contractAcceptedAt)}`);
  }
  if (request.contractVersionAccepted) {
    details.push(`Version ${request.contractVersionAccepted}`);
  }

  return details.join(" • ") || fallback;
}
