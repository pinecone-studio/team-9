import { useMemo } from "react";
import type {
  ApprovalRequestsQuery,
  EligibilityRulesPageDataQuery,
} from "@/shared/apollo/generated";
import { ALL_RULES_TAB, buildEligibilityRuleDashboardStats, buildRuleFilterTabs } from "./eligibility-rules-dashboard";
import { sectionMeta } from "../rule-sections";
import { buildSections } from "./rule-section-list.utils";

type UseRuleSectionListDataParams = {
  approvalRequests: ApprovalRequestsQuery["approvalRequests"];
  data?: EligibilityRulesPageDataQuery;
  searchTerm: string;
  selectedTab: string;
};

export function useRuleSectionListData({
  approvalRequests,
  data,
  searchTerm,
  selectedTab,
}: UseRuleSectionListDataParams) {
  const sectionTitles = useMemo(
    () => sectionMeta.map((meta) => meta.title),
    [],
  );
  const allSections = useMemo(
    () => buildSections(data?.ruleDefinitions ?? [], approvalRequests, sectionTitles, ""),
    [approvalRequests, data?.ruleDefinitions, sectionTitles],
  );
  const sections = useMemo(() => {
    const searchedSections = buildSections(
      data?.ruleDefinitions ?? [],
      approvalRequests,
      sectionTitles,
      searchTerm,
    );

    return selectedTab === ALL_RULES_TAB
      ? searchedSections
      : searchedSections.filter((section) => section.title === selectedTab);
  }, [approvalRequests, data?.ruleDefinitions, searchTerm, sectionTitles, selectedTab]);
  const stats = useMemo(
    () => buildEligibilityRuleDashboardStats(data?.ruleDefinitions ?? [], approvalRequests),
    [approvalRequests, data?.ruleDefinitions],
  );
  const tabs = useMemo(() => buildRuleFilterTabs(allSections), [allSections]);
  const categoryNameToId = useMemo(() => {
    const map = new Map<string, string>();
    for (const definition of data?.ruleDefinitions ?? []) {
      map.set(definition.category_name, definition.category_id);
    }
    return map;
  }, [data?.ruleDefinitions]);
  const employeeRoles = useMemo(
    () =>
      Array.from(
        new Set(
          (data?.employees ?? [])
            .map((employee) => employee?.position?.trim() ?? "")
            .filter(Boolean),
        ),
      ),
    [data?.employees],
  );

  return { categoryNameToId, employeeRoles, sections, stats, tabs };
}
