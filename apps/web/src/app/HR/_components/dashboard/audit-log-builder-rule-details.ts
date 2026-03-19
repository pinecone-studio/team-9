import type {
  AuditLogsApprovalRequestRecord,
  AuditLogsEmployeeRecord,
} from "./audit-logs.graphql";
import {
  formatRuleRequirementValue,
  getEmptyAuditLogValue,
  getRuleCategoryLabel,
  getRuleSourceFieldLabel,
  parseRuleTargetBenefits,
} from "./audit-log-builder-formatters";
import { extractRuleSnapshot } from "./audit-log-builder-snapshots";
import { formatApprovalRole, parseAuditPayload, resolvePerson } from "./audit-log-people";

const EMPTY_VALUE = getEmptyAuditLogValue();

export function buildRuleApprovalDetail(
  request: AuditLogsApprovalRequestRecord,
  peopleIndex: Map<string, AuditLogsEmployeeRecord>,
) {
  if (
    request.entity_type !== "rule" ||
    (request.status !== "approved" && request.status !== "rejected")
  ) {
    return null;
  }

  const payload = parseAuditPayload(request.payload_json);
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
  const snapshot = extractRuleSnapshot(request.snapshot_json);

  return {
    actionType: request.action_type,
    blockingMessage: payload?.rule?.description?.trim() || EMPTY_VALUE,
    category: getRuleCategoryLabel(payload?.rule?.categoryId, payload?.rule?.ruleType),
    decisionAt: request.reviewed_at ?? request.created_at,
    name: payload?.rule?.name?.trim() || "Untitled Rule",
    previousBlockingMessage: snapshot?.description?.trim() || (snapshot ? EMPTY_VALUE : null),
    previousRequirementValue: snapshot
      ? formatRuleRequirementValue(
          payload?.rule?.ruleType,
          snapshot.defaultOperator,
          snapshot.defaultValue,
          snapshot.defaultUnit,
        )
      : null,
    requirementValue: formatRuleRequirementValue(
      payload?.rule?.ruleType,
      payload?.rule?.defaultOperator,
      payload?.rule?.defaultValue,
      payload?.rule?.defaultUnit,
    ),
    reviewComment: request.review_comment,
    reviewedBy: {
      name: reviewer.name,
      role: formatApprovalRole(request.target_role),
    },
    sourceField: getRuleSourceFieldLabel(
      payload?.rule?.optionsJson,
      payload?.rule?.ruleType,
      payload?.rule?.defaultUnit,
    ),
    submittedAt: request.created_at,
    submittedBy: {
      name: requester.name,
      role: requester.role,
    },
    targetBenefits: (() => {
      const benefits = parseRuleTargetBenefits(request.snapshot_json, payload?.rule?.linkedBenefits);
      return benefits.length > 0 ? benefits : request.action_type === "update" ? ["All Benefits"] : [];
    })(),
  };
}
