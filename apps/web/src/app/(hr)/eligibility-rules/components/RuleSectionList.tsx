"use client";

import { useMemo, useState } from "react";
import {
  ApprovalActionType,
  ApprovalEntityType,
  RuleValueType,
  useCreateRuleApprovalRequestMutation,
  useDeleteRuleDefinitionMutation,
  useEligibilityRulesPageDataQuery,
  useUpdateRuleApprovalRequestMutation,
} from "@/shared/apollo/generated";
import type { Operator, RuleType } from "@/shared/apollo/generated";

import AddRuleDialog from "./AddRuleDialog";
import EditRuleDialog from "./EditRuleDialog";
import RuleSectionsView from "./RuleSectionsView";
import type { ApprovalRoleValue } from "./RuleApprovalSection";
import { sectionMeta } from "../rule-sections";
import type { RuleCardModel } from "../types";
import { buildSections, getAllowedOperators, getFallbackCategoryId } from "./rule-section-list.utils";

type RuleSectionListProps = {
  searchTerm?: string;
};

const FALLBACK_REQUESTED_BY = "current_hr_admin";

export default function RuleSectionList({ searchTerm = "" }: RuleSectionListProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingRule, setEditingRule] = useState<RuleCardModel | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { data, error, loading, refetch } = useEligibilityRulesPageDataQuery({ fetchPolicy: "network-only" });
  const [createRuleApprovalRequest] = useCreateRuleApprovalRequestMutation();
  const [updateRuleApprovalRequest] = useUpdateRuleApprovalRequestMutation();
  const [deleteRuleDefinition] = useDeleteRuleDefinitionMutation();

  const sections = useMemo(
    () => buildSections(data?.ruleDefinitions ?? [], sectionMeta.map((meta) => meta.title), searchTerm),
    [data?.ruleDefinitions, searchTerm],
  );
  const categoryNameToId = useMemo(() => {
    const map = new Map<string, string>();
    for (const definition of data?.ruleDefinitions ?? []) map.set(definition.category_name, definition.category_id);
    return map;
  }, [data?.ruleDefinitions]);

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
        requestedBy: FALLBACK_REQUESTED_BY,
        targetRole: input.approvalRole,
      } } });
      if (!result.data?.createApprovalRequest.id) throw new Error("Failed to submit rule request");
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
        requestedBy: FALLBACK_REQUESTED_BY,
        snapshotJson: JSON.stringify(editingRule),
        targetRole: payload.approvalRole,
      } } });
      await refetch();
      setEditingRule(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteRule(id: string) {
    if (editingRule?.id === id && editingRule.usageCount > 0) {
      const list = editingRule.linkedBenefits.map((benefit) => `- ${benefit.name}`).join("\n");
      const shouldDelete = window.confirm(`This rule is linked to ${editingRule.usageCount} benefit(s):\n${list}\n\nDelete anyway?`);
      if (!shouldDelete) return;
    }
    setSubmitting(true);
    try {
      await deleteRuleDefinition({ variables: { id } });
      await refetch();
      setEditingRule(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {error && <div className="mx-auto mt-4 w-full max-w-[1300px] px-4 text-sm text-red-600 sm:px-0">{error.message}</div>}
      <RuleSectionsView loading={loading} onAddRule={setActiveSection} onEditRule={setEditingRule} searchTerm={searchTerm} sections={sections} />
      {activeSection && <AddRuleDialog onClose={() => setActiveSection(null)} onSubmit={handleAddRule} sectionTitle={activeSection} submitting={submitting} />}
      {editingRule && <EditRuleDialog onDelete={handleDeleteRule} onClose={() => setEditingRule(null)} onSave={handleSaveRule} rule={editingRule} submitting={submitting} />}
    </>
  );
}
