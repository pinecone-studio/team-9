import { asc, and, eq, or } from "drizzle-orm";

import { getDb } from "../../../db";
import { approvalRequests } from "../../../db/schema/approval-requests";
import { benefitRules } from "../../../db/schema/benefit-rules";
import { benefits } from "../../../db/schema/benefits";
import { employees } from "../../../db/schema/employees";
import type {
  ApprovalRequestPersonSummary,
  QueryRuleApprovalRequestReviewArgs,
  RuleApprovalRequestReview,
} from "../../generated/resolvers-types";
import {
  mapApprovalRequest,
  mapApprovalRequestStatus,
} from "../approval-request-mappers";
import { buildRuleApprovalImpact } from "../rule-approval-review-impact";
import {
  buildFallbackApprovalRequestEvents,
  listApprovalRequestEvents,
} from "../approval-request-review-events";
import {
  buildRuleChangeSummary,
  buildRuleTechnicalExpression,
  resolveRuleReviewStates,
} from "../rule-approval-review-state";
import {
  formatMeasurement,
  formatPersonLabel,
  formatRuleTypeLabel,
  getRuleActionCopy,
  getRuleFieldKey,
  getRuleFieldLabel,
  parseRuleScalar,
} from "../rule-approval-review-utils";

function formatApprovalRole(role: "finance_manager" | "hr_admin") {
  return role === "finance_manager" ? "Finance Manager" : "HR Admin";
}

function formatPositionLabel(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  if (value === "finance_manager" || value === "hr_admin") {
    return formatApprovalRole(value);
  }

  return value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildConditionText(params: {
  fieldKey: string;
  fieldLabel: string;
  measurement: string;
  operator: string;
  requirementValue: string;
}) {
  const { fieldKey, fieldLabel, measurement, operator, requirementValue } = params;
  const valueWithUnit =
    measurement !== "-" ? `${requirementValue} ${measurement.toLowerCase()}` : requirementValue;

  if (fieldKey === "employment_months" && operator === "gte") {
    return `Employees must have at least ${valueWithUnit} of employment.`;
  }

  if (fieldKey === "employment_months" && operator === "lte") {
    return `Employees must have no more than ${valueWithUnit} of employment.`;
  }

  if (operator === "eq") return `${fieldLabel} must equal ${valueWithUnit}.`;
  if (operator === "neq") return `${fieldLabel} must not equal ${valueWithUnit}.`;
  if (operator === "gt") return `${fieldLabel} must be greater than ${valueWithUnit}.`;
  if (operator === "gte") return `${fieldLabel} must be at least ${valueWithUnit}.`;
  if (operator === "lt") return `${fieldLabel} must be less than ${valueWithUnit}.`;
  if (operator === "lte") return `${fieldLabel} must be at most ${valueWithUnit}.`;
  return `${fieldLabel} will use the configured comparison.`;
}

async function resolvePersonSummary(
  DB: D1Database,
  identifier: string | null,
  fallbackName: string,
): Promise<ApprovalRequestPersonSummary> {
  if (!identifier) {
    return { identifier: null, name: fallbackName, position: null };
  }

  const db = getDb({ DB });
  const [person] = await db
    .select({ email: employees.email, id: employees.id, name: employees.name, position: employees.role })
    .from(employees)
    .where(or(eq(employees.id, identifier), eq(employees.email, identifier)))
    .limit(1);

  return person
    ? {
        identifier: person.email ?? person.id,
        name: person.name,
        position: formatPositionLabel(person.position),
      }
    : { identifier, name: fallbackName, position: null };
}

async function resolveAssignedApproverSummary(
  DB: D1Database,
  targetRole: "finance_manager" | "hr_admin",
  reviewedBy: string | null,
) {
  if (reviewedBy) {
    return resolvePersonSummary(DB, reviewedBy, formatPersonLabel(reviewedBy));
  }

  const db = getDb({ DB });
  const [approver] = await db
    .select({ email: employees.email, id: employees.id, name: employees.name, position: employees.role })
    .from(employees)
    .where(eq(employees.role, targetRole))
    .orderBy(asc(employees.name))
    .limit(1);

  return approver
    ? {
        identifier: approver.email ?? approver.id,
        name: approver.name,
        position: formatPositionLabel(approver.position),
      }
    : {
        identifier: null,
        name: formatApprovalRole(targetRole),
        position: formatApprovalRole(targetRole),
      };
}

export async function getRuleApprovalRequestReview(
  DB: D1Database,
  { id }: QueryRuleApprovalRequestReviewArgs,
): Promise<RuleApprovalRequestReview | null> {
  const db = getDb({ DB });
  const [requestRow] = await db
    .select()
    .from(approvalRequests)
    .where(eq(approvalRequests.id, id))
    .limit(1);

  if (!requestRow || requestRow.entityType !== "rule") {
    return null;
  }

  const { currentRule, previousRule } = resolveRuleReviewStates(
    requestRow.payloadJson,
    requestRow.snapshotJson,
  );
  const fieldKey = getRuleFieldKey(currentRule.ruleType);
  const fieldLabel = getRuleFieldLabel(currentRule.ruleType);
  const requirementValue = parseRuleScalar(currentRule.value);
  const measurement = formatMeasurement(currentRule.unit);
  const appliedBenefits = requestRow.entityId
    ? await db
        .select({ id: benefits.id, name: benefits.name })
        .from(benefitRules)
        .innerJoin(benefits, eq(benefits.id, benefitRules.benefitId))
        .where(
          and(eq(benefitRules.ruleId, requestRow.entityId), eq(benefitRules.isActive, true)),
        )
    : [];
  const employeeRows = await db
    .select({
      employment_status: employees.employmentStatus,
      hire_date: employees.hireDate,
      late_arrival_count: employees.lateArrivalCount,
      okr_submitted: employees.okrSubmitted,
      responsibility_level: employees.responsibilityLevel,
      role: employees.role,
    })
    .from(employees);
  const impact = buildRuleApprovalImpact({
    actionType: requestRow.actionType,
    currentRule,
    employees: employeeRows,
    previousRule,
  });
  const timelineEntries = await listApprovalRequestEvents(DB, requestRow.id);
  const fallbackEntries = buildFallbackApprovalRequestEvents({
    createdAt: requestRow.createdAt,
    id: requestRow.id,
    requestedBy: requestRow.requestedBy,
    reviewedAt: requestRow.reviewedAt,
    reviewedBy: requestRow.reviewedBy,
    reviewComment: requestRow.reviewComment,
    status: requestRow.status,
    targetRole: requestRow.targetRole,
  });
  const submittedBy = await resolvePersonSummary(
    DB,
    requestRow.requestedBy,
    formatPersonLabel(requestRow.requestedBy),
  );
  const assignedApprover = await resolveAssignedApproverSummary(
    DB,
    requestRow.targetRole,
    requestRow.reviewedBy,
  );
  const reviewedBy = requestRow.reviewedBy
    ? await resolvePersonSummary(DB, requestRow.reviewedBy, formatPersonLabel(requestRow.reviewedBy))
    : null;
  const actionCopy = getRuleActionCopy(requestRow.actionType);

  return {
    actionBadgeLabel: actionCopy.actionBadgeLabel,
    actionBadgeTone: actionCopy.actionBadgeTone,
    appliedBenefits,
    auditLog: (timelineEntries.length > 0 ? timelineEntries : fallbackEntries).map((entry) => ({
      actorIdentifier: entry.actorIdentifier,
      actorType: entry.actorType,
      createdAt: entry.createdAt,
      id: entry.id,
      label: entry.label,
      reviewComment: entry.reviewComment,
    })),
    changeSummary: buildRuleChangeSummary(previousRule, currentRule),
    decisionNoteRequiredOnReject: true,
    impact: {
      affectedEmployees: impact.affectedEmployees,
      benefitsUsingRule: appliedBenefits.length,
      eligibilityEffect: impact.eligibilityEffect,
      newlyRestrictedEmployees: impact.newlyRestrictedEmployees,
      summary: impact.summary,
    },
    overview: {
      condition: buildConditionText({
        fieldKey,
        fieldLabel,
        measurement,
        operator: currentRule.operator,
        requirementValue,
      }),
      description: currentRule.description,
      measurement,
      requirementValue,
      ruleName: currentRule.name,
      ruleTypeLabel: formatRuleTypeLabel(currentRule.ruleType),
      technicalExpression: buildRuleTechnicalExpression(currentRule),
      valueFieldLabel: fieldLabel,
    },
    request: mapApprovalRequest(requestRow),
    submissionDetails: {
      assignedApprover,
      reviewComment: requestRow.reviewComment,
      reviewedAt: requestRow.reviewedAt,
      reviewedBy,
      status: mapApprovalRequestStatus(requestRow.status),
      submittedAt: requestRow.createdAt,
      submittedBy,
    },
    subtitle: actionCopy.subtitle,
    title: actionCopy.title,
  };
}
