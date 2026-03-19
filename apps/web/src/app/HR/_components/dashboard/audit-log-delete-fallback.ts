import type {
  AuditLogsApprovalRequestRecord,
  AuditLogsDirectEntryRecord,
  AuditLogsEmployeeRecord,
} from "./audit-logs.graphql";
import type { AuditLogEntry } from "./audit-log-types";
import { formatApprovalRole, formatPersonLabel, parseAuditPayload, resolvePerson } from "./audit-log-people";

export function buildDirectBenefitDeleteEntityIds(entries?: AuditLogsDirectEntryRecord[] | null) {
  try {
    return new Set(
      (entries ?? [])
        .filter((entry) => {
          const entityType = entry.entityType.trim().toLowerCase();
          const action = entry.action.trim().toLowerCase();
          return (
            (entityType === "benefit_delete" || entityType === "benefit") &&
            (action === "submitted" || action.includes("delete")) &&
            Boolean(entry.entityId)
          );
        })
        .map((entry) => entry.entityId as string),
    );
  } catch {
    return new Set<string>();
  }
}

export function buildBenefitDeleteApprovalFallback(
  request: AuditLogsApprovalRequestRecord,
  peopleIndex: Map<string, AuditLogsEmployeeRecord>,
): AuditLogEntry[] {
  const payload = parseAuditPayload(request.payload_json);
  const benefitRule = payload?.benefit?.name?.trim() || "Untitled Benefit";
  const employee =
    payload?.employeeRequest?.employeeName?.trim() ||
    formatPersonLabel(payload?.employeeRequest?.employeeEmail ?? payload?.employeeRequest?.employeeId);
  const reviewer = resolvePerson(request.reviewed_by, peopleIndex, formatApprovalRole(request.target_role));

  return [
    {
      actor: "admin",
      benefitRule,
      employee,
      event: "Benefit Delete Submitted",
      id: `${request.id}-approved-fallback`,
      occurredAt: request.reviewed_at ?? request.created_at,
      performedBy: { name: reviewer.name, role: reviewer.role },
      result: "Submitted",
      reviewedBy: reviewer.name,
    },
  ];
}
