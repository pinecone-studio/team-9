import type { ApprovalRequestRecord } from "./approval-requests.graphql";
import { parseApprovalPayload, parseApprovalSnapshot } from "./approval-request-parsers";
import { formatShortDateTime } from "./approval-request-time-formatters";
import { formatApprovalRole } from "./approval-request-label-formatters";
import {
  getRuleTechnicalExpression,
  parseRuleJsonScalar,
} from "./approval-request-rule-utils";
import { formatDetailSubsidy } from "./request-detail-formatters";

function isEmployeeBenefitActivationRequest(request: ApprovalRequestRecord) {
  if (request.entity_type !== "benefit") {
    return false;
  }

  const payload = parseApprovalPayload(request);
  return payload.entityType === "benefit" && Boolean(payload.employeeRequest);
}

function formatSummaryTextValue(value: string | null | undefined) {
  const normalized = value?.trim() ?? "";
  return normalized || "-";
}

function countBenefitChangeFields(request: ApprovalRequestRecord) {
  const payload = parseApprovalPayload(request);
  const snapshot = parseApprovalSnapshot(request) as
    | {
        benefit?: {
          approvalRole?: string | null;
          subsidyPercent?: number | string | null;
          vendorName?: string | null;
        } | null;
        ruleAssignments?: Array<unknown>;
      }
    | null;

  if (payload.entityType !== "benefit") {
    return 1;
  }

  const currentBenefit = payload.benefit;
  const previousBenefit = snapshot?.benefit ?? null;
  const nextSubsidy = formatDetailSubsidy(currentBenefit?.subsidyPercent);
  const previousSubsidy = formatDetailSubsidy(previousBenefit?.subsidyPercent);
  const nextVendor = formatSummaryTextValue(currentBenefit?.vendorName);
  const previousVendor = formatSummaryTextValue(previousBenefit?.vendorName);
  const nextApprover = formatApprovalRole(
    currentBenefit?.approvalRole === "finance_manager" ? "finance_manager" : "hr_admin",
  );
  const previousApprover = formatApprovalRole(
    previousBenefit?.approvalRole === "finance_manager" ? "finance_manager" : "hr_admin",
  );

  let count = 0;

  if (nextSubsidy !== previousSubsidy && (nextSubsidy !== "-" || previousSubsidy !== "-")) count += 1;
  if (nextVendor !== previousVendor && (nextVendor !== "-" || previousVendor !== "-")) count += 1;
  if (nextApprover !== previousApprover) count += 1;

  const nextRuleCount = payload.ruleAssignments.length;
  const previousRuleCount = Array.isArray(snapshot?.ruleAssignments)
    ? snapshot.ruleAssignments.length
    : 0;

  if (count === 0 && (nextRuleCount > 0 || previousRuleCount > 0)) {
    count = 1;
  }

  return count || 1;
}

function countRuleChangeFields(request: ApprovalRequestRecord) {
  const payload = parseApprovalPayload(request);
  const snapshot = parseApprovalSnapshot(request) as
    | {
        default_operator?: string | null;
        default_value?: string | null;
        description?: string | null;
        rule_type?: string | null;
      }
    | null;

  if (payload.entityType !== "rule") {
    return 1;
  }

  const nextCondition = getRuleTechnicalExpression(
    payload.rule?.ruleType,
    payload.rule?.defaultOperator,
    parseRuleJsonScalar(payload.rule?.defaultValue),
  );
  const previousCondition = getRuleTechnicalExpression(
    snapshot?.rule_type,
    snapshot?.default_operator,
    parseRuleJsonScalar(snapshot?.default_value),
  );
  const nextDescription = formatSummaryTextValue(payload.rule?.description);
  const previousDescription = formatSummaryTextValue(snapshot?.description);

  let count = 0;
  if (nextCondition !== previousCondition) count += 1;
  if (nextDescription !== previousDescription) count += 1;
  return count || 1;
}

export function formatRequestChangeSummary(request: ApprovalRequestRecord) {
  if (request.entity_type === "rule") {
    if (request.action_type === "create") return "New rule";
    if (request.action_type === "update") {
      const count = countRuleChangeFields(request);
      return `${count} field${count === 1 ? "" : "s"} modified`;
    }
    return "Rule removed";
  }

  if (request.action_type === "create") return "New benefit";
  if (isEmployeeBenefitActivationRequest(request)) return "Status override";
  if (request.action_type === "update") {
    const count = countBenefitChangeFields(request);
    return `${count} field${count === 1 ? "" : "s"} modified`;
  }
  return "Benefit removed";
}

export function formatProgressLabel(request: ApprovalRequestRecord) {
  if (request.status === "approved") {
    return request.reviewed_at ? `Approved ${formatShortDateTime(request.reviewed_at)}` : "Approved";
  }

  if (request.status === "rejected") {
    return request.reviewed_at ? `Rejected ${formatShortDateTime(request.reviewed_at)}` : "Rejected";
  }

  if (isEmployeeBenefitActivationRequest(request)) {
    return `Waiting for ${formatApprovalRole(request.target_role)} approval`;
  }

  return `Waiting for ${formatApprovalRole(request.target_role)}`;
}
