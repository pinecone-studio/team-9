import type {
  AuditLogsApprovalRequestRecord,
  AuditLogsEmployeeRecord,
} from "./audit-logs.graphql";
import {
  formatCurrencyValue,
  formatPercentageValue,
  parseBenefitRuleNames,
  resolveBenefitMonthlyValue,
} from "./audit-log-builder-benefit-formatters";
import { getEmptyAuditLogValue } from "./audit-log-builder-formatters";
import { extractBenefitSnapshot } from "./audit-log-builder-snapshots";
import {
  formatApprovalRole,
  formatPersonLabel,
  parseAuditPayload,
  resolvePerson,
} from "./audit-log-people";

const EMPTY_VALUE = getEmptyAuditLogValue();

export function buildApprovalBenefitRequestDetail(
  request: AuditLogsApprovalRequestRecord,
  peopleIndex: Map<string, AuditLogsEmployeeRecord>,
) {
  if (
    request.entity_type !== "benefit" ||
    (request.status !== "approved" && request.status !== "rejected")
  ) {
    return null;
  }

  const payload = parseAuditPayload(request.payload_json);
  const employeeRequest = payload?.employeeRequest;
  if (!employeeRequest) {
    return null;
  }

  const employeeKey =
    employeeRequest.employeeId?.trim().toLowerCase() ||
    employeeRequest.employeeEmail?.trim().toLowerCase() ||
    employeeRequest.employeeName?.trim().toLowerCase() ||
    "";
  const employeeRecord = employeeKey ? peopleIndex.get(employeeKey) : null;
  const reviewer = resolvePerson(
    request.reviewed_by,
    peopleIndex,
    formatApprovalRole(request.target_role),
  );

  return {
    approval_role: request.target_role,
    benefit: {
      category: payload?.benefit?.category?.trim() || EMPTY_VALUE,
      id: payload?.benefit?.id?.trim() || request.entity_id || EMPTY_VALUE,
      requiresContract: Boolean(payload?.benefit?.requiresContract),
      subsidyPercentage: formatPercentageValue(
        payload?.benefit?.subsidyPercentage ?? payload?.benefit?.subsidyPercent,
      ),
      title: payload?.benefit?.name?.trim() || "Untitled Benefit",
      vendorName: payload?.benefit?.vendorName?.trim() || null,
    },
    contractAcceptedAt: null,
    created_at: request.created_at,
    employee: {
      department: employeeRecord?.department?.trim() || EMPTY_VALUE,
      email: employeeRecord?.email?.trim() || employeeRequest.employeeEmail?.trim() || EMPTY_VALUE,
      id: employeeRecord?.id?.trim() || employeeRequest.employeeId?.trim() || EMPTY_VALUE,
      name:
        employeeRecord?.name?.trim() ||
        employeeRequest.employeeName?.trim() ||
        formatPersonLabel(employeeRequest.employeeEmail ?? employeeRequest.employeeId),
      position: employeeRecord?.position?.trim() || EMPTY_VALUE,
    },
    id: request.id,
    reviewComment: request.review_comment,
    reviewed_by: {
      email: request.reviewed_by?.trim() || null,
      id: request.reviewed_by?.trim() || null,
      name: reviewer.name,
      position: formatApprovalRole(request.target_role),
    },
    status: request.status,
    updated_at: request.reviewed_at ?? request.created_at,
  };
}

export function buildBenefitApprovalDetail(
  request: AuditLogsApprovalRequestRecord,
  peopleIndex: Map<string, AuditLogsEmployeeRecord>,
) {
  if (
    request.entity_type !== "benefit" ||
    (request.status !== "approved" && request.status !== "rejected")
  ) {
    return null;
  }

  const payload = parseAuditPayload(request.payload_json);
  if (payload?.employeeRequest) {
    return null;
  }

  const reviewer = resolvePerson(
    request.reviewed_by,
    peopleIndex,
    formatApprovalRole(request.target_role),
  );
  const requester = resolvePerson(
    request.requested_by,
    peopleIndex,
    formatApprovalRole(request.target_role),
  );
  const snapshot = extractBenefitSnapshot(request.snapshot_json);

  return {
    actionType: request.action_type,
    approverRole:
      payload?.benefit?.approvalRole?.trim() ||
      snapshot?.approvalRole?.trim() ||
      reviewer.role,
    attachedRules: parseBenefitRuleNames(
      payload?.benefit?.linkedRules ?? snapshot?.attachedRules,
    ),
    category:
      payload?.benefit?.category?.trim() ||
      snapshot?.category?.trim() ||
      EMPTY_VALUE,
    decisionAt: request.reviewed_at ?? request.created_at,
    description:
      payload?.benefit?.description?.trim() ||
      snapshot?.description?.trim() ||
      EMPTY_VALUE,
    monthlyCap: formatCurrencyValue(
      resolveBenefitMonthlyValue(payload?.benefit) ?? snapshot?.monthlyCap,
    ),
    name: payload?.benefit?.name?.trim() || snapshot?.name?.trim() || "Untitled Benefit",
    previousMonthlyCap: snapshot ? formatCurrencyValue(snapshot.monthlyCap) : null,
    previousSubsidyPercentage: snapshot
      ? formatPercentageValue(snapshot.subsidyPercentage)
      : null,
    requiresContract:
      payload?.benefit?.requiresContract ?? snapshot?.requiresContract ?? false,
    reviewComment: request.review_comment,
    reviewedBy: {
      name: reviewer.name,
      role: reviewer.role,
    },
    subsidyPercentage: formatPercentageValue(
      payload?.benefit?.subsidyPercentage ??
        payload?.benefit?.subsidyPercent ??
        snapshot?.subsidyPercentage,
    ),
    submittedAt: request.created_at,
    submittedBy: {
      name: requester.name,
      role: requester.role,
    },
    vendorName:
      payload?.benefit?.vendorName?.trim() ||
      snapshot?.vendorName?.trim() ||
      EMPTY_VALUE,
  };
}
