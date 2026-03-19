import type {
  AuditLogsBenefitRequestRecord,
  AuditLogsEmployeeRecord,
} from "./audit-logs.graphql";
import type { AuditLogEntry } from "./audit-log-types";
import { getEmptyAuditLogValue } from "./audit-log-builder-formatters";
import { formatBenefitRuleLabel, resolvePerson } from "./audit-log-people";

const EMPTY_VALUE = getEmptyAuditLogValue();

export function buildBenefitRequestEntries(
  request: AuditLogsBenefitRequestRecord,
  peopleIndex: Map<string, AuditLogsEmployeeRecord>,
) {
  const employeeName = request.employee.name.trim();
  const benefitRule = formatBenefitRuleLabel(request.benefit.title, request.benefit.vendorName);
  const requester = resolvePerson(request.employee.id, peopleIndex, request.employee.position);
  const entries: AuditLogEntry[] = [
    {
      actor: "user",
      benefitRule,
      benefitRequestDetail: request,
      employee: employeeName,
      event: "Benefit Requested",
      id: `${request.id}-submitted`,
      occurredAt: request.created_at,
      performedBy: { name: requester.name, role: requester.role },
      result: "Submitted",
      reviewedBy: EMPTY_VALUE,
    },
  ];

  if (request.status === "approved" || request.status === "rejected") {
    const reviewer = request.reviewed_by
      ? resolvePerson(request.reviewed_by.id, peopleIndex, request.reviewed_by.position)
      : resolvePerson(null, peopleIndex, "Admin");
    entries.push({
      actor: reviewer.actor,
      benefitRule,
      benefitRequestDetail: request,
      employee: employeeName,
      event: `Benefit Request ${request.status === "approved" ? "Approved" : "Rejected"}`,
      id: `${request.id}-${request.status}`,
      occurredAt: request.updated_at,
      performedBy: { name: reviewer.name, role: reviewer.role },
      result: request.status === "approved" ? "Approved" : "Rejected",
      reviewedBy: reviewer.name,
    });
  }

  if (request.status === "cancelled") {
    entries.push({
      actor: "user",
      benefitRule,
      benefitRequestDetail: request,
      employee: employeeName,
      event: "Benefit Request Cancelled",
      id: `${request.id}-cancelled`,
      occurredAt: request.updated_at,
      performedBy: { name: requester.name, role: requester.role },
      result: "Cancelled",
      reviewedBy: EMPTY_VALUE,
    });
  }

  return entries;
}
