"use client";

import { useMemo, useState } from "react";
import {
  ApprovalActionType,
  ApprovalEntityType,
  ApprovalRole,
  RuleValueType,
  useApprovalRequestsQuery,
  useCreateRuleApprovalRequestMutation,
  useDeleteRuleApprovalRequestMutation,
  useEligibilityRulesPageDataQuery,
  useUpdateRuleApprovalRequestMutation,
} from "@/shared/apollo/generated";
import type { Operator, RuleType } from "@/shared/apollo/generated";
import AddRuleDialog from "./AddRuleDialog";
import EditRuleDialog from "./EditRuleDialog";
import { getRuleRequestNoticeMessage } from "./rule-request-notice-message";
import RulePendingRequestDialog from "./RulePendingRequestDialog";
import RuleRequestNotice from "./RuleRequestNotice";
import RuleSectionsView from "./RuleSectionsView";
import type { ApprovalRoleValue } from "./RuleApprovalSection";
import { sectionMeta } from "../rule-sections";
import type { RuleCardModel } from "../types";
import { buildSections, getAllowedOperators, getFallbackCategoryId } from "./rule-section-list.utils";

type RuleSectionListProps = {
  currentUserIdentifier: string;
  searchTerm?: string;
};
export default function RuleSectionList({
  currentUserIdentifier,
  searchTerm = "",
}: RuleSectionListProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<RuleCardModel | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { data, error, loading, refetch } = useEligibilityRulesPageDataQuery({ fetchPolicy: "network-only" });
  const { data: approvalRequestsData, refetch: refetchApprovalRequests } = useApprovalRequestsQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const [createRuleApprovalRequest] = useCreateRuleApprovalRequestMutation();
  const [updateRuleApprovalRequest] = useUpdateRuleApprovalRequestMutation();
  const [deleteRuleApprovalRequest] = useDeleteRuleApprovalRequestMutation();
  const sections = useMemo(() => buildSections(data?.ruleDefinitions ?? [], approvalRequestsData?.approvalRequests ?? [], sectionMeta.map((meta) => meta.title), searchTerm), [approvalRequestsData?.approvalRequests, data?.ruleDefinitions, searchTerm]);
  const categoryNameToId = useMemo(() => {
    const map = new Map<string, string>();
    for (const definition of data?.ruleDefinitions ?? []) map.set(definition.category_name, definition.category_id);
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
  async function handleAddRule(input: { approvalRole: ApprovalRoleValue; defaultOperator: Operator; defaultUnit?: string; description: string; name: string; optionsJson?: string; ruleType: RuleType; value: string; valueType: RuleValueType }) {
    if (!activeSection) return;
    setSubmitting(true);
    try {
      const ruleInput = {
        allowedOperators: getAllowedOperators(input.valueType),
        categoryId: categoryNameToId.get(activeSection) ?? getFallbackCategoryId(activeSection),
        defaultOperator: input.defaultOperator,
        defaultUnit: input.defaultUnit,
        defaultValue: input.valueType === RuleValueType.Number || input.valueType === RuleValueType.Date ? JSON.stringify(Number(input.value)) : input.valueType === RuleValueType.Boolean ? JSON.stringify(input.value.toLowerCase() === "true") : JSON.stringify(input.value),
        description: input.description,
        isActive: true,
        name: input.name,
        optionsJson: input.optionsJson,
        ruleType: input.ruleType,
        valueType: input.valueType,
      };
      const result = await createRuleApprovalRequest({ variables: { input: {
        actionType: ApprovalActionType.Create,
        entityType: ApprovalEntityType.Rule,
        payloadJson: JSON.stringify({ rule: ruleInput }),
        requestedBy: currentUserIdentifier,
        targetRole: input.approvalRole,
      } } });
      if (!result.data?.createApprovalRequest.id) throw new Error("Failed to submit rule request");
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
      const ruleInput = {
        description: payload.description,
        defaultUnit: payload.measurement,
        defaultValue: payload.value,
        id: editingRule.id,
        name: payload.name,
        optionsJson: payload.optionsJson,
      };
      await updateRuleApprovalRequest({ variables: { input: {
        actionType: ApprovalActionType.Update,
        entityId: editingRule.id,
        entityType: ApprovalEntityType.Rule,
        payloadJson: JSON.stringify({ rule: ruleInput }),
        requestedBy: currentUserIdentifier,
        snapshotJson: JSON.stringify(editingRule),
        targetRole: payload.approvalRole,
      } } });
      setNoticeMessage(getRuleRequestNoticeMessage(payload.approvalRole));
      await refetch();
      setEditingRule(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteRule(payload: { approvalRole: ApprovalRoleValue; id: string }) {
    const { approvalRole, id } = payload;
    if (editingRule?.id === id && editingRule.usageCount > 0) {
      const list = editingRule.linkedBenefits.map((benefit) => `- ${benefit.name}`).join("\n");
      const shouldDelete = window.confirm(`This rule is linked to ${editingRule.usageCount} benefit(s):\n${list}\n\nDelete anyway?`);
      if (!shouldDelete) return;
    }
    setSubmitting(true);
    try {
      const result = await deleteRuleApprovalRequest({ variables: { input: {
        actionType: ApprovalActionType.Delete as ApprovalActionType,
        entityId: id,
        entityType: ApprovalEntityType.Rule,
        payloadJson: JSON.stringify({ rule: { id } }),
        requestedBy: currentUserIdentifier,
        snapshotJson: JSON.stringify(editingRule ?? { id }),
        targetRole: approvalRole ?? ApprovalRole.HrAdmin,
      } } });
      if (!result.data?.createApprovalRequest.id) throw new Error("Failed to submit delete request");
      setNoticeMessage(getRuleRequestNoticeMessage(approvalRole));
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
