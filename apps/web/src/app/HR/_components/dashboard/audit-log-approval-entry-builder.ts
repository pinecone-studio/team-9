import type {
  AuditLogsApprovalRequestRecord,
  AuditLogsEmployeeRecord,
} from "./audit-logs.graphql";
import type { AuditLogEntry, AuditLogResult } from "./audit-log-types";
import {
  buildApprovalBenefitRequestDetail,
  buildBenefitApprovalDetail,
  buildRuleApprovalDetail,
} from "./audit-log-builder-details";
import { getEmptyAuditLogValue } from "./audit-log-builder-formatters";
import {
  formatApprovalRole,
  formatPersonLabel,
  parseAuditPayload,
  resolvePerson,
} from "./audit-log-people";

const EMPTY_VALUE = getEmptyAuditLogValue();

export function buildApprovalRequestEntries(
  request: AuditLogsApprovalRequestRecord,
  peopleIndex: Map<string, AuditLogsEmployeeRecord>,
) {
  const payload = parseAuditPayload(request.payload_json);
  const hasEmployeeRequest = Boolean(payload?.employeeRequest);
  const benefitRequestDetail = buildApprovalBenefitRequestDetail(request, peopleIndex);
  const benefitApprovalDetail = buildBenefitApprovalDetail(request, peopleIndex);
  const ruleApprovalDetail = buildRuleApprovalDetail(request, peopleIndex);
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
  const entries: AuditLogEntry[] = [
    {
      actor: requester.actor,
      benefitApprovalDetail,
      benefitRule,
      benefitRequestDetail,
      employee,
      event: buildApprovalEvent(request, "Submitted", hasEmployeeRequest),
      id: `${request.id}-submitted`,
      occurredAt: request.created_at,
      performedBy: { name: requester.name, role: requester.role },
      result: "Submitted" as const,
      reviewedBy: EMPTY_VALUE,
      ruleApprovalDetail,
    },
  ];

  if (request.status !== "pending") {
    const reviewer = resolvePerson(
      request.reviewed_by,
      peopleIndex,
      formatApprovalRole(request.target_role),
    );
    const result = request.status === "approved" ? "Approved" : "Rejected";
    entries.push({
      actor: "admin",
      benefitApprovalDetail,
      benefitRule,
      benefitRequestDetail,
      employee,
      event: buildApprovalEvent(request, result, hasEmployeeRequest),
      id: `${request.id}-${request.status}`,
      occurredAt: request.reviewed_at ?? request.created_at,
      performedBy: { name: reviewer.name, role: reviewer.role },
      result,
      reviewedBy: reviewer.name,
      ruleApprovalDetail,
    });
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
