import type { BenefitRequestRecord } from "./benefit-requests.graphql";

export function getBenefitRequestDepartment(request: BenefitRequestRecord) {
  return request.employee.department || "-";
}

export function getBenefitRequestEmploymentStatus(request: BenefitRequestRecord) {
  return request.employee.employmentStatus || "unknown";
}

export function getBenefitRequestResponsibilityLevel(request: BenefitRequestRecord) {
  return request.employee.responsibilityLevel;
}

export function formatBenefitApprovalRoute(role: BenefitRequestRecord["approval_role"]) {
  return role === "finance_manager" ? "Finance Review" : "HR Review";
}

export function formatBenefitReviewerRole(role: BenefitRequestRecord["approval_role"]) {
  return role === "finance_manager" ? "Finance Manager" : "HR Admin";
}

export function getBenefitRequestStatusBadge(status: BenefitRequestRecord["status"]) {
  if (status === "approved") {
    return {
      bgClassName: "bg-[#DCFCE7]",
      iconClassName: "text-[#016630]",
      label: "Approved",
      textClassName: "text-[#016630]",
    };
  }

  if (status === "rejected" || status === "cancelled") {
    return {
      bgClassName: "bg-[#FEF2F2]",
      iconClassName: "text-[#B42318]",
      label: status === "cancelled" ? "Cancelled" : "Rejected",
      textClassName: "text-[#B42318]",
    };
  }

  return {
    bgClassName: "bg-[#FEF3C6]",
    iconClassName: "text-[#973C00]",
    label: "Pending",
    textClassName: "text-[#973C00]",
  };
}

export function formatBenefitEmploymentStatus(value: string) {
  return value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizeSignedBenefitUrl(endpoint: string | undefined, signedUrl: string) {
  if (/^https?:\/\//i.test(signedUrl)) {
    return signedUrl;
  }

  if (endpoint) {
    return new URL(signedUrl, new URL(endpoint).origin).toString();
  }

  if (typeof window !== "undefined") {
    return new URL(signedUrl, window.location.origin).toString();
  }

  return signedUrl;
}

export function buildBenefitRequestAuditEntries(
  request: BenefitRequestRecord,
  isPending: boolean,
) {
  return [
    {
      actor: "Employee",
      id: "submitted",
      label: "Request submitted",
      timestamp: request.created_at,
    },
    request.contractAcceptedAt
      ? {
          actor: "Employee",
          id: "contract",
          label: "Contract accepted",
          timestamp: request.contractAcceptedAt,
        }
      : null,
    {
      actor: "System",
      id: "eligibility",
      label: "Eligibility validated",
      timestamp: request.created_at,
    },
    isPending
      ? {
          actor: "System",
          id: "route",
          label: `Routed to ${formatBenefitApprovalRoute(request.approval_role)}`,
          timestamp: request.created_at,
        }
      : null,
    !isPending
      ? {
          actor: request.reviewed_by?.name ?? "Reviewer",
          id: "reviewed",
          label: request.status === "approved" ? "Request approved" : "Request rejected",
          timestamp: request.updated_at,
        }
      : null,
  ].filter((entry): entry is { actor: string; id: string; label: string; timestamp: string } => Boolean(entry));
}
