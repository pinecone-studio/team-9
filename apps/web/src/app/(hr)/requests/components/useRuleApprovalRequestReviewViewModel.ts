"use client";

import { useMemo } from "react";

import { useRequestsEmployeesDirectoryQuery } from "@/shared/apollo/generated";
import type {
  RequestsEmployeesDirectoryQuery,
  RuleApprovalRequestReviewQuery,
} from "./approval-requests.graphql";
import { parseApprovalPayload, parseApprovalSnapshot } from "./approval-request-utils";
import {
  getRuleChangeRows,
  getRuleOperator,
  getRuleValue,
  normalizeRuleType,
  type RuleShape,
} from "./approval-request-rule-utils";

type ReviewRecord = NonNullable<
  RuleApprovalRequestReviewQuery["ruleApprovalRequestReview"]
>;

export type RuleApprovalReviewChangeItem = {
  id: string;
  label: string;
  nextValue: string;
  previousValue: string;
};

export type RuleApprovalReviewImpactPreview = {
  affectedEmployees: number;
  benefitsUsingRule: number;
  eligibilityEffect: string;
  newlyRestrictedEmployees: number;
};

type RulePreviewEmployee = Exclude<
  NonNullable<RequestsEmployeesDirectoryQuery["employees"]>[number],
  null
>;

function isRulePreviewEmployee(
  employee: RulePreviewEmployee | null | undefined,
): employee is RulePreviewEmployee {
  return Boolean(employee);
}

function buildCurrentRule(request: ReviewRecord["request"]) {
  const payload = parseApprovalPayload(request);

  if (payload.entityType !== "rule") {
    return {} as RuleShape;
  }

  return {
    defaultOperator: payload.rule?.defaultOperator,
    defaultUnit: payload.rule?.defaultUnit,
    defaultValue: payload.rule?.defaultValue,
    description: payload.rule?.description,
    name: payload.rule?.name,
    ruleType: payload.rule?.ruleType,
  } satisfies RuleShape;
}

function readExpectedValue(value: string | null | undefined) {
  if (!value) return null;

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function evaluateRule(rule: RuleShape | null, employee: RulePreviewEmployee) {
  const ruleType = normalizeRuleType(rule?.ruleType ?? rule?.rule_type);
  const operator = getRuleOperator(rule);
  const expectedValue = readExpectedValue(getRuleValue(rule));
  if (!ruleType || expectedValue === null) return true;

  const metricValue =
    ruleType === "attendance"
      ? employee.lateArrivalCount
      : ruleType === "employment_status"
        ? employee.employmentStatus
        : ruleType === "okr_submitted"
          ? employee.okrSubmitted
          : ruleType === "responsibility_level"
            ? employee.responsibilityLevel
            : ruleType === "role"
              ? employee.position
              : Math.floor(
                  (Date.now() - new Date(employee.hireDate).getTime()) / 86400000,
                );

  if (operator === "eq") return metricValue === expectedValue;
  if (operator === "neq") return metricValue !== expectedValue;
  if (operator === "gt") return Number(metricValue) > Number(expectedValue);
  if (operator === "gte") return Number(metricValue) >= Number(expectedValue);
  if (operator === "lt") return Number(metricValue) < Number(expectedValue);
  if (operator === "lte") return Number(metricValue) <= Number(expectedValue);
  if (operator === "in") return Array.isArray(expectedValue) && expectedValue.includes(metricValue);
  if (operator === "not_in") return Array.isArray(expectedValue) && !expectedValue.includes(metricValue);
  return true;
}

function countEligibleEmployees(employees: RulePreviewEmployee[], rule: RuleShape | null) {
  return employees.filter((employee) => evaluateRule(rule, employee)).length;
}

export function useRuleApprovalRequestReviewViewModel(review: ReviewRecord) {
  const { data } = useRequestsEmployeesDirectoryQuery({
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
  });

  return useMemo(() => {
    const currentRule = buildCurrentRule(review.request);
    const previousRule = parseApprovalSnapshot(review.request) as RuleShape | null;
    const employees = (data?.employees ?? []).filter(isRulePreviewEmployee);
    const previousEligible =
      review.request.action_type === "create"
        ? employees.length
        : countEligibleEmployees(employees, previousRule);
    const nextEligible =
      review.request.action_type === "delete"
        ? employees.length
        : countEligibleEmployees(employees, currentRule);
    const delta = nextEligible - previousEligible;

    return {
      changeSummary: getRuleChangeRows(currentRule, previousRule).map((item) => ({
        id: item.label.toLowerCase().replace(/\s+/g, "_"),
        label: item.label,
        nextValue: item.nextValue,
        previousValue: item.previousValue,
      })) satisfies RuleApprovalReviewChangeItem[],
      impactPreview: {
        affectedEmployees: employees.length || review.impact.affectedEmployees,
        benefitsUsingRule: review.appliedBenefits.length || review.impact.benefitsUsingRule,
        eligibilityEffect:
          delta < 0 ? "Restrictive" : delta > 0 ? "Expanded" : "Unchanged",
        newlyRestrictedEmployees: delta,
      } satisfies RuleApprovalReviewImpactPreview,
    };
  }, [data?.employees, review]);
}
