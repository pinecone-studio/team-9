import type {
  AuditLogsApprovalRequestRecord,
  AuditLogsBenefitRequestRecord,
  AuditLogsEmployeeRecord,
  AuditLogsPageDataQuery,
} from "./audit-logs.graphql";
import type { AuditLogEntry, AuditLogResult } from "./audit-log-types";
import {
  buildPeopleIndex,
  formatApprovalRole,
  formatBenefitRuleLabel,
  formatPersonLabel,
  parseAuditPayload,
  resolvePerson,
} from "./audit-log-people";

const EMPTY_VALUE = "—";

function createEntry(entry: AuditLogEntry) {
  return entry;
}

function buildBenefitRequestEntries(
  request: AuditLogsBenefitRequestRecord,
  peopleIndex: Map<string, AuditLogsEmployeeRecord>,
) {
  const employeeName = request.employee.name.trim();
  const benefitRule = formatBenefitRuleLabel(
    request.benefit.title,
    request.benefit.vendorName,
  );
  const requester = resolvePerson(request.employee.id, peopleIndex, request.employee.position);
  const entries = [
    createEntry({
      actor: "user",
      benefitRule,
      employee: employeeName,
      event: "Benefit Requested",
      id: `${request.id}-submitted`,
      occurredAt: request.created_at,
      performedBy: { name: requester.name, role: requester.role },
      result: "Submitted",
      reviewedBy: EMPTY_VALUE,
    }),
  ];

  if (request.status === "approved" || request.status === "rejected") {
    const reviewer = request.reviewed_by
      ? resolvePerson(request.reviewed_by.id, peopleIndex, request.reviewed_by.position)
      : resolvePerson(null, peopleIndex, "Admin");
    entries.push(
      createEntry({
        actor: reviewer.actor,
        benefitRule,
        employee: employeeName,
        event: `Benefit Request ${request.status === "approved" ? "Approved" : "Rejected"}`,
        id: `${request.id}-${request.status}`,
        occurredAt: request.updated_at,
        performedBy: { name: reviewer.name, role: reviewer.role },
        result: request.status === "approved" ? "Approved" : "Rejected",
        reviewedBy: reviewer.name,
      }),
    );
  }

  if (request.status === "cancelled") {
    entries.push(
      createEntry({
        actor: "user",
        benefitRule,
        employee: employeeName,
        event: "Benefit Request Cancelled",
        id: `${request.id}-cancelled`,
        occurredAt: request.updated_at,
        performedBy: { name: requester.name, role: requester.role },
        result: "Cancelled",
        reviewedBy: EMPTY_VALUE,
      }),
    );
  }

  return entries;
}

function buildApprovalEvent(
  request: AuditLogsApprovalRequestRecord,
  result: Exclude<AuditLogResult, "Cancelled">,
  hasEmployeeRequest: boolean,
) {
  if (hasEmployeeRequest) return `Benefit Activation ${result}`;
  const entity = request.entity_type === "benefit" ? "Benefit" : "Rule";
  if (request.action_type === "create") return `New ${entity} ${result}`;
  return `${entity} ${request.action_type === "update" ? "Update" : "Delete"} ${result}`;
}

function buildApprovalRequestEntries(
  request: AuditLogsApprovalRequestRecord,
  peopleIndex: Map<string, AuditLogsEmployeeRecord>,
) {
  const payload = parseAuditPayload(request.payload_json);
  const hasEmployeeRequest = Boolean(payload?.employeeRequest);
  const benefitRule =
    request.entity_type === "benefit"
      ? payload?.benefit?.name?.trim() || "Untitled Benefit"
      : payload?.rule?.name?.trim() || "Untitled Rule";
  const employee =
    payload?.employeeRequest?.employeeName?.trim() ||
    formatPersonLabel(payload?.employeeRequest?.employeeEmail ?? payload?.employeeRequest?.employeeId);
  const requester = resolvePerson(
    request.requested_by,
    peopleIndex,
    formatApprovalRole(request.target_role),
  );
  const entries = [
    createEntry({
      actor: requester.actor,
      benefitRule,
      employee,
      event: buildApprovalEvent(request, "Submitted", hasEmployeeRequest),
      id: `${request.id}-submitted`,
      occurredAt: request.created_at,
      performedBy: { name: requester.name, role: requester.role },
      result: "Submitted",
      reviewedBy: EMPTY_VALUE,
    }),
  ];

  if (request.status !== "pending") {
    const reviewer = resolvePerson(
      request.reviewed_by,
      peopleIndex,
      formatApprovalRole(request.target_role),
    );
    const result = request.status === "approved" ? "Approved" : "Rejected";
    entries.push(
      createEntry({
        actor: "admin",
        benefitRule,
        employee,
        event: buildApprovalEvent(request, result, hasEmployeeRequest),
        id: `${request.id}-${request.status}`,
        occurredAt: request.reviewed_at ?? request.created_at,
        performedBy: { name: reviewer.name, role: reviewer.role },
        result,
        reviewedBy: reviewer.name,
      }),
    );
  }

  return entries;
}

export function buildAuditLogEntries(data?: AuditLogsPageDataQuery) {
  const peopleIndex = buildPeopleIndex(data?.employees);
  return [...(data?.benefitRequests ?? []).flatMap((request) => buildBenefitRequestEntries(request, peopleIndex))]
    .concat((data?.approvalRequests ?? []).flatMap((request) => buildApprovalRequestEntries(request, peopleIndex)))
    .sort((left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime());
}
