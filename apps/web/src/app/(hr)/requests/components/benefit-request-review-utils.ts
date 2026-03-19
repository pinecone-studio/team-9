import type { EmployeeBenefitDialogQuery } from "@/shared/apollo/generated";
import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import {
  buildRuleDescription,
  buildRuleLabel,
  buildRulePassQueue,
  readRulePassState,
} from "./benefit-request-review-rule-formatters";

type BenefitRequestRule = EmployeeBenefitDialogQuery["eligibilityRules"][number];

export type BenefitRequestEligibilityItem = {
  description: string;
  id: string;
  label: string;
  passed: boolean;
};

type BenefitRequestAuditEntry = {
  actor: string;
  id: string;
  label: string;
  timestamp: string;
  tone: "danger" | "neutral" | "success";
};

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
  if (/^https?:\/\//i.test(signedUrl)) return signedUrl;
  if (endpoint) return new URL(signedUrl, new URL(endpoint).origin).toString();
  if (typeof window !== "undefined") return new URL(signedUrl, window.location.origin).toString();
  return signedUrl;
}

export function buildBenefitRequestEligibilityItems(
  request: BenefitRequestRecord,
  rules: EmployeeBenefitDialogQuery["eligibilityRules"],
) {
  const queueByRuleType = buildRulePassQueue(request.ruleEvaluationJson);
  const fallbackPassed = request.status === "approved" || request.status === "pending";
  const orderedRules = [...rules].sort((left, right) => left.priority - right.priority);
  const items = orderedRules.map((rule) => {
    const passed = readRulePassState(queueByRuleType, rule.rule_type, fallbackPassed);

    return {
      description: buildRuleDescription(rule, passed),
      id: rule.id,
      label: buildRuleLabel(rule.rule_type, rule),
      passed,
    } satisfies BenefitRequestEligibilityItem;
  });

  if (items.length > 0) return items;

  return Array.from(queueByRuleType.entries()).flatMap(([ruleType, queue], index) =>
    queue.map((passed, resultIndex) => ({
      description: passed ? "Requirement satisfied." : "Requirement not met.",
      id: `${ruleType}-${index}-${resultIndex}`,
      label: buildRuleLabel(ruleType as BenefitRequestRule["rule_type"], null),
      passed,
    })),
  );
}

export function buildBenefitRequestAuditEntries(
  request: BenefitRequestRecord,
): BenefitRequestAuditEntry[] {
  const reviewerName = request.reviewed_by?.name?.trim() || "Reviewer";
  const reviewerRole = formatBenefitReviewerRole(request.approval_role);

  return [
    {
      actor: "Employee",
      id: "submitted",
      label: "Request submitted",
      timestamp: request.created_at,
      tone: "neutral",
    },
    request.contractAcceptedAt
      ? {
          actor: "Employee",
          id: "contract",
          label: "Contract accepted",
          timestamp: request.contractAcceptedAt,
          tone: "neutral",
        }
      : null,
    {
      actor: "System",
      id: "eligibility",
      label: "Eligibility validated",
      timestamp: request.created_at,
      tone: "neutral",
    },
    {
      actor: "System",
      id: "route",
      label: `Routed to ${formatBenefitApprovalRoute(request.approval_role)}`,
      timestamp: request.created_at,
      tone: "neutral",
    },
    request.status !== "pending"
      ? {
          actor: `by ${reviewerName} (${reviewerRole})`,
          id: "reviewed",
          label:
            request.status === "approved"
              ? `Approved by ${reviewerName}.`
              : request.status === "cancelled"
                ? "Cancelled by employee."
                : `Rejected by ${reviewerName}.`,
          timestamp: request.updated_at,
          tone:
            request.status === "approved"
              ? "success"
              : request.status === "rejected"
                ? "danger"
                : "neutral",
        }
      : null,
  ].filter((entry): entry is BenefitRequestAuditEntry => Boolean(entry));
}
