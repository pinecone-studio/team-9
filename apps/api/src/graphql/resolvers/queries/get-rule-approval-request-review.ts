import { and, eq, or } from "drizzle-orm";

import { getDb } from "../../../db";
import { approvalRequests } from "../../../db/schema/approval-requests";
import { benefitRules } from "../../../db/schema/benefit-rules";
import { benefits } from "../../../db/schema/benefits";
import { employees } from "../../../db/schema/employees";
import { buildEmployeeMetrics } from "../../../utils/build-employee-metrics";
import { evaluateRule } from "../../../utils/eveluate-rule";
import type {
  ApprovalRequestPersonSummary,
  QueryRuleApprovalRequestReviewArgs,
  RuleApprovalRequestReview,
} from "../../generated/resolvers-types";
import {
  mapApprovalRequest,
  mapApprovalRequestStatus,
} from "../approval-request-mappers";
import {
  buildFallbackApprovalRequestEvents,
  listApprovalRequestEvents,
} from "../approval-request-review-events";
import {
  formatMeasurement,
  formatPersonLabel,
  formatRuleTypeLabel,
  getOperatorSymbol,
  getRuleActionCopy,
  getRuleFieldKey,
  getRuleFieldLabel,
  parseRuleScalar,
  resolveRuleReviewSource,
} from "../rule-approval-review-utils";

function formatApprovalRole(role: "finance_manager" | "hr_admin") {
  return role === "finance_manager" ? "Finance Manager" : "HR Admin";
}

function buildConditionText(params: {
  description: string;
  fieldKey: string;
  fieldLabel: string;
  measurement: string;
  operator: string;
  requirementValue: string;
}) {
  const { description, fieldKey, fieldLabel, measurement, operator, requirementValue } =
    params;
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
  return description;
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
    ? { identifier: person.email ?? person.id, name: person.name, position: person.position }
    : { identifier, name: fallbackName, position: null };
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

  const source = resolveRuleReviewSource(requestRow.payloadJson, requestRow.snapshotJson);
  const fieldKey = getRuleFieldKey(source.ruleType);
  const fieldLabel = getRuleFieldLabel(source.ruleType);
  const requirementValue = parseRuleScalar(source.value);
  const measurement = formatMeasurement(source.unit);
  const appliedBenefitsRows = requestRow.entityId
    ? await db
        .select({ id: benefits.id, name: benefits.name })
        .from(benefitRules)
        .innerJoin(benefits, eq(benefits.id, benefitRules.benefitId))
        .where(
          and(
            eq(benefitRules.ruleId, requestRow.entityId),
            eq(benefitRules.isActive, true),
          ),
        )
    : [];
  const appliedBenefits =
    appliedBenefitsRows.length > 0 ? appliedBenefitsRows : source.linkedBenefits;
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
  const affectedEmployees =
    source.ruleType && source.value
      ? employeeRows.filter(
          (employee) =>
            !evaluateRule(
              {
                operator: source.operator as Parameters<typeof evaluateRule>[0]["operator"],
                rule_type: source.ruleType as Parameters<typeof evaluateRule>[0]["rule_type"],
                value: source.value ?? "",
              },
              buildEmployeeMetrics(employee),
            ),
        ).length
      : 0;
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
  const assignedApprover = await resolvePersonSummary(
    DB,
    requestRow.reviewedBy,
    formatApprovalRole(requestRow.targetRole),
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
    decisionNoteRequiredOnReject: true,
    impact: {
      affectedEmployees,
      benefitsUsingRule: appliedBenefits.length,
      eligibilityEffect: requestRow.actionType === "delete" ? "Removing" : "Restrictive",
      summary:
        requestRow.actionType === "delete"
          ? "Removing this rule will stop this requirement from restricting eligibility."
          : "This rule will restrict eligibility for employees who do not meet the required condition.",
    },
    overview: {
      condition: buildConditionText({
        description: source.description,
        fieldKey,
        fieldLabel,
        measurement,
        operator: source.operator,
        requirementValue,
      }),
      description: source.description,
      measurement,
      requirementValue,
      ruleName: source.name,
      ruleTypeLabel: formatRuleTypeLabel(source.ruleType),
      technicalExpression: `${fieldKey} ${getOperatorSymbol(source.operator)} ${requirementValue}`,
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
