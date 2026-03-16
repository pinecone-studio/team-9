import { useMemo, useState } from "react";

import type {
  AvailableRuleDefinition,
  ExistingEligibilityRule,
} from "./edit-benefit-dialog.graphql";
import type { AssignedBenefitRule } from "./edit-benefit-dialog.types";

function mapExistingRule(rule: ExistingEligibilityRule): AssignedBenefitRule {
  return {
    id: rule.id,
    ruleId: rule.rule_id,
    name: rule.name,
    operator: rule.operator,
    value: rule.value,
    defaultUnit: rule.default_unit,
    errorMessage: rule.error_message,
  };
}

function normalizeAvailableRules(
  rules: Array<AvailableRuleDefinition | null | undefined>,
): AvailableRuleDefinition[] {
  return rules.filter(
    (rule): rule is AvailableRuleDefinition =>
      !!rule &&
      typeof rule.id === "string" &&
      typeof rule.name === "string" &&
      typeof rule.default_operator === "string" &&
      typeof rule.description === "string",
  );
}

type UseBenefitRuleAssignmentsProps = {
  initialRules?: ExistingEligibilityRule[] | null;
  ruleDefinitions?: Array<AvailableRuleDefinition | null | undefined> | null;
};

export function useBenefitRuleAssignments({
  initialRules,
  ruleDefinitions,
}: UseBenefitRuleAssignmentsProps) {
  const [draftAssignedRules, setDraftAssignedRules] = useState<AssignedBenefitRule[] | null>(
    null,
  );
  const [selectedRuleId, setSelectedRuleId] = useState("");

  const serverAssignedRules = useMemo(
    () => (initialRules ?? []).map(mapExistingRule),
    [initialRules],
  );

  const assignedRules = draftAssignedRules ?? serverAssignedRules;
  const normalizedRuleDefinitions = useMemo(
    () => normalizeAvailableRules(ruleDefinitions ?? []),
    [ruleDefinitions],
  );
  const availableRules = useMemo(
    () =>
      normalizedRuleDefinitions.filter(
        (rule) => !assignedRules.some((assigned) => assigned.ruleId === rule.id),
      ),
    [assignedRules, normalizedRuleDefinitions],
  );

  function handleAddRule() {
    const selectedRule = availableRules.find((rule) => rule.id === selectedRuleId);

    if (!selectedRule) {
      return;
    }

    setDraftAssignedRules((current) => [
      ...(current ?? serverAssignedRules),
      {
        id: `draft-${selectedRule.id}`,
        ruleId: selectedRule.id,
        name: selectedRule.name,
        operator: selectedRule.default_operator,
        value: selectedRule.default_value ?? '""',
        defaultUnit: selectedRule.default_unit,
        errorMessage: selectedRule.description,
      },
    ]);
    setSelectedRuleId("");
  }

  function handleDeleteRule(ruleId: string) {
    setDraftAssignedRules((current) =>
      (current ?? serverAssignedRules).filter((rule) => rule.id !== ruleId),
    );
  }

  return {
    assignedRules,
    availableRules,
    handleAddRule,
    handleDeleteRule,
    selectedRuleId,
    setSelectedRuleId,
  };
}
