import type {
  AuditLogEntry,
  AuditLogFilterOption,
  AuditLogFilters,
  AuditLogSummary,
} from "./audit-log-types";

export { buildAuditLogEntries } from "./audit-log-builders";

const RESULT_OPTIONS = ["Submitted", "Approved", "Rejected", "Cancelled"] as const;

export function applyAuditLogFilters(entries: AuditLogEntry[], filters: AuditLogFilters) {
  return entries.filter((entry) => {
    if (filters.event !== "all" && entry.event !== filters.event) return false;
    if (filters.result !== "all" && entry.result !== filters.result) return false;
    if (filters.actor !== "all" && entry.actor !== filters.actor) return false;
    if (filters.search.trim()) {
      const normalizedSearch = filters.search.trim().toLowerCase();
      const haystack = [
        entry.event,
        entry.employee,
        entry.benefitRule,
        entry.performedBy.name,
        entry.performedBy.role,
        entry.reviewedBy,
        entry.result,
        entry.benefitRequestDetail?.reviewComment ?? "",
        entry.benefitRequestDetail?.employee.department ?? "",
        entry.benefitApprovalDetail?.name ?? "",
        entry.benefitApprovalDetail?.category ?? "",
        entry.benefitApprovalDetail?.vendorName ?? "",
        entry.benefitApprovalDetail?.subsidyPercentage ?? "",
        entry.benefitApprovalDetail?.approverRole ?? "",
        entry.benefitApprovalDetail?.description ?? "",
        entry.benefitApprovalDetail?.reviewComment ?? "",
        ...(entry.benefitApprovalDetail?.attachedRules ?? []),
        entry.ruleApprovalDetail?.name ?? "",
        entry.ruleApprovalDetail?.category ?? "",
        entry.ruleApprovalDetail?.sourceField ?? "",
        entry.ruleApprovalDetail?.blockingMessage ?? "",
        entry.ruleApprovalDetail?.reviewComment ?? "",
        ...(entry.ruleApprovalDetail?.targetBenefits ?? []),
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(normalizedSearch)) return false;
    }
    return true;
  });
}

export function buildAuditLogSummary(entries: AuditLogEntry[]): AuditLogSummary {
  return entries.reduce(
    (summary, entry) => ({
      approved: summary.approved + Number(entry.result === "Approved"),
      rejected: summary.rejected + Number(entry.result === "Rejected"),
      submitted: summary.submitted + Number(entry.result === "Submitted"),
      totalActions: summary.totalActions + 1,
    }),
    { approved: 0, rejected: 0, submitted: 0, totalActions: 0 },
  );
}

export function buildEventOptions(entries: AuditLogEntry[]): AuditLogFilterOption[] {
  return Array.from(new Set(entries.map((entry) => entry.event))).map((event) => ({
    label: event,
    value: event,
  }));
}

export function buildResultOptions(entries: AuditLogEntry[]): AuditLogFilterOption[] {
  return RESULT_OPTIONS.filter((result) => entries.some((entry) => entry.result === result)).map(
    (result) => ({ label: result, value: result }),
  );
}
