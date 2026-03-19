"use client";

import { useState } from "react";
import {
  useApprovalRequestsQuery,
  useCreateRuleApprovalRequestMutation,
  useDeleteRuleApprovalRequestMutation,
  useEligibilityRulesPageDataQuery,
  useUpdateRuleApprovalRequestMutation,
} from "@/shared/apollo/generated";
import type { Operator, RuleType, RuleValueType } from "@/shared/apollo/generated";
import AddRuleDialog from "./AddRuleDialog";
import EditRuleDialog from "./EditRuleDialog";
import EligibilityRulesHeader from "./EligibilityRulesHeader";
import { ALL_RULES_TAB } from "./eligibility-rules-dashboard";
import { getRuleRequestNoticeMessage } from "./rule-request-notice-message";
import RulePendingRequestDialog from "./RulePendingRequestDialog";
import RuleRequestNotice from "./RuleRequestNotice";
import {
  submitAddRuleRequest,
  submitDeleteRuleRequest,
  submitUpdateRuleRequest,
} from "./rule-section-actions";
import RuleSectionsView from "./RuleSectionsView";
import { useRuleSectionListData } from "./useRuleSectionListData";
import { useAutoOpenRuleDialog } from "./useAutoOpenRuleDialog";
import type { ApprovalRoleValue } from "./RuleApprovalSection";
import type { RuleCardModel } from "../types";

type RuleSectionListProps = {
  currentUserIdentifier: string;
  onSearchChange: (value: string) => void;
  requestedCreateSection?: string | null;
  searchTerm?: string;
  shouldAutoOpenCreateRule?: boolean;
};
export default function RuleSectionList({
  currentUserIdentifier,
  onSearchChange,
  requestedCreateSection,
  searchTerm = "",
  shouldAutoOpenCreateRule = false,
}: RuleSectionListProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<RuleCardModel | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>(ALL_RULES_TAB);
  const [submitting, setSubmitting] = useState(false);
  const { data, error, loading, refetch } = useEligibilityRulesPageDataQuery({ fetchPolicy: "network-only" });
  const { data: approvalRequestsData, refetch: refetchApprovalRequests } = useApprovalRequestsQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const [createRuleApprovalRequest] = useCreateRuleApprovalRequestMutation();
  const [updateRuleApprovalRequest] = useUpdateRuleApprovalRequestMutation();
  const [deleteRuleApprovalRequest] = useDeleteRuleApprovalRequestMutation();
  useAutoOpenRuleDialog({
    requestedCreateSection,
    setActiveSection,
    shouldAutoOpenCreateRule,
  });
  const { categoryNameToId, employeeRoles, sections, stats, tabs } =
    useRuleSectionListData({
      approvalRequests: approvalRequestsData?.approvalRequests ?? [],
      data,
      searchTerm,
      selectedTab,
    });
  async function handleAddRule(input: { approvalRole: ApprovalRoleValue; defaultOperator: Operator; defaultUnit?: string; description: string; name: string; optionsJson?: string; ruleType: RuleType; value: string; valueType: RuleValueType }) {
    if (!activeSection) return;
    setSubmitting(true);
    try {
      await submitAddRuleRequest({
        activeSection,
        categoryNameToId,
        createRuleApprovalRequest,
        currentUserIdentifier,
        input,
      });
      setNoticeMessage(getRuleRequestNoticeMessage(input.approvalRole));
      await refetch();
      setActiveSection(null);
    } finally {
      setSubmitting(false);
    }
  }
  async function handleSaveRule(payload: { approvalRole: ApprovalRoleValue; description: string; id: string; measurement?: string; name: string; optionsJson?: string; value?: string }) {
    if (!editingRule) return;
    setSubmitting(true);
    try {
      await submitUpdateRuleRequest({
        currentUserIdentifier,
        editingRule,
        input: payload,
        updateRuleApprovalRequest,
      });
      setNoticeMessage(getRuleRequestNoticeMessage(payload.approvalRole));
      await refetch();
      setEditingRule(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteRule(payload: { approvalRole: ApprovalRoleValue; id: string }) {
    setSubmitting(true);
    try {
      const didSubmit = await submitDeleteRuleRequest({
        currentUserIdentifier,
        deleteRuleApprovalRequest,
        editingRule,
        input: payload,
      });
      if (!didSubmit) return;
      setNoticeMessage(getRuleRequestNoticeMessage(payload.approvalRole));
      await refetch();
      setEditingRule(null);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <>
      {noticeMessage ? <RuleRequestNotice message={noticeMessage} onClose={() => setNoticeMessage(null)} /> : null}
      {error && <div className="mx-auto mt-4 w-full max-w-[1300px] px-4 text-sm text-red-600 sm:px-0">{error.message}</div>}
      <EligibilityRulesHeader
        activeTab={selectedTab}
        onSearchChange={onSearchChange}
        onTabChange={setSelectedTab}
        searchValue={searchTerm}
        stats={stats}
        tabs={tabs}
      />
      <RuleSectionsView loading={loading} onAddRule={setActiveSection} onEditRule={setEditingRule} onOpenRequest={setSelectedRequestId} searchTerm={searchTerm} sections={sections} />
      {activeSection && <AddRuleDialog employeeRoles={employeeRoles} onClose={() => setActiveSection(null)} onSubmit={handleAddRule} sectionTitle={activeSection} submitting={submitting} />}
      {editingRule && <EditRuleDialog onDelete={handleDeleteRule} onClose={() => setEditingRule(null)} onSave={handleSaveRule} rule={editingRule} submitting={submitting} />}
      <RulePendingRequestDialog
        currentUserIdentifier={currentUserIdentifier}
        onClose={() => setSelectedRequestId(null)}
        onReviewed={async () => {
          await refetchApprovalRequests();
          await refetch();
        }}
        requestId={selectedRequestId}
      />
    </>
  );
}
