import type { ApprovalRequestsQuery } from "@/shared/apollo/generated";
import {
  ApprovalEntityType,
  ApprovalRequestStatus,
} from "@/shared/apollo/generated";
import { parseLinkedBenefits } from "./rule-section-list.utils";
import type { RuleSectionView } from "../types";

export const ALL_RULES_TAB = "All Rules";

export type EligibilityRuleDashboardStat = {
  helper: string;
  label: string;
  value: number;
};

export type EligibilityRuleFilterTab = {
  count: number;
  key: string;
  label: string;
};

export function buildRuleFilterTabs(
  sections: RuleSectionView[],
): EligibilityRuleFilterTab[] {
  const sectionTabs = sections.map((section) => ({
    count: section.cards.length,
    key: section.title,
    label: section.title,
  }));
  const totalRules = sectionTabs.reduce((sum, section) => sum + section.count, 0);

  return [
    {
      count: totalRules,
      key: ALL_RULES_TAB,
      label: ALL_RULES_TAB,
    },
    ...sectionTabs,
  ];
}

export function buildEligibilityRuleDashboardStats(
  definitions: Array<{ linked_benefits_json: string }>,
  approvalRequests: ApprovalRequestsQuery["approvalRequests"],
): EligibilityRuleDashboardStat[] {
  const ruleRequests = approvalRequests.filter(
    (request) => request.entity_type === ApprovalEntityType.Rule,
  );
  const pendingRequests = ruleRequests.filter(
    (request) => request.status === ApprovalRequestStatus.Pending,
  ).length;
  const uniqueBenefitIds = new Set<string>();

  for (const definition of definitions) {
    for (const benefit of parseLinkedBenefits(definition.linked_benefits_json)) {
      uniqueBenefitIds.add(benefit.id);
    }
  }

  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth();
  const updatedThisMonth = ruleRequests.filter((request) => {
    const createdAt = new Date(request.created_at);
    if (Number.isNaN(createdAt.getTime())) return false;
    return (
      createdAt.getUTCFullYear() === currentYear &&
      createdAt.getUTCMonth() === currentMonth
    );
  }).length;

  return [
    {
      helper: "Total number of eligibility rules set up across all benefits.",
      label: "All Rules",
      value: definitions.length,
    },
    {
      helper: "Distinct benefits that use one or more eligibility rules.",
      label: "Linked Benefits",
      value: uniqueBenefitIds.size,
    },
    {
      helper:
        pendingRequests === 1
          ? "1 request is currently pending review."
          : `${pendingRequests} requests are currently pending review.`,
      label: "Updated This Month",
      value: updatedThisMonth,
    },
  ];
}
