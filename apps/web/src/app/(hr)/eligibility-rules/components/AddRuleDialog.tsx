"use client";

import { useMemo, useState } from "react";
import DiscardChangesDialog from "@/app/(hr)/components/DiscardChangesDialog";
import { ApprovalRole, RuleValueType } from "@/shared/apollo/generated";
import type { Operator, RuleType } from "@/shared/apollo/generated";

import AddRuleDialogFrame from "./AddRuleDialogFrame";
import AddRuleDialogFields from "./AddRuleDialogFields";
import RuleApprovalSection, { type ApprovalRoleValue } from "./RuleApprovalSection";
import { buildRuleOptionsJson, validateRuleInput } from "./add-rule-dialog.helpers";
import { getAddRuleDialogPresentation } from "./add-rule-dialog.presentation";
import { getRuleTypeLabel } from "./add-rule-dialog.utils";
import { getBackendRuleTemplates, getDefaultValueForTemplate, getOperatorForValueType } from "./rule-backend-metadata";
import { useRuleDescriptionSync } from "./useRuleDescriptionSync";

type AddRuleDialogProps = {
  employeeRoles: string[];
  onClose: () => void;
  onSubmit: (input: { approvalRole: ApprovalRoleValue; defaultOperator: Operator; defaultUnit?: string; description: string; name: string; optionsJson?: string; ruleType: RuleType; valueType: RuleValueType; value: string }) => Promise<void>;
  sectionTitle: string;
  submitting?: boolean;
};

export default function AddRuleDialog({
  employeeRoles,
  onClose,
  onSubmit,
  sectionTitle,
  submitting = false,
}: AddRuleDialogProps) {
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const ruleLabel = getRuleTypeLabel(sectionTitle);
  const templates = useMemo(() => getBackendRuleTemplates(sectionTitle, { employeeRoles }), [employeeRoles, sectionTitle]);
  const initialTemplate = templates[0];
  const initialConfigLabel = initialTemplate?.configLabel ?? "";
  const initialValue = initialTemplate ? getDefaultValueForTemplate(initialTemplate) : "0";
  const initialUnit = initialTemplate?.unitOptions[0] ?? "";

  const [name, setName] = useState("");
  const [approvalRole, setApprovalRole] = useState<ApprovalRoleValue>(ApprovalRole.HrAdmin);
  const [configLabel, setConfigLabel] = useState(initialConfigLabel);
  const [value, setValue] = useState(initialValue);
  const [unit, setUnit] = useState(initialUnit);
  const [validationError, setValidationError] = useState<string | null>(null);
  const selectedTemplate =
    templates.find((template) => template.configLabel === configLabel) ?? templates[0];
  const valueType = selectedTemplate?.valueType ?? RuleValueType.Number;
  const ruleType = selectedTemplate?.ruleType;
  const { description, handleDescriptionChange, syncDescriptionIfNeeded } = useRuleDescriptionSync({
    initialConfigLabel,
    initialUnit,
    initialValue,
    initialValueType: initialTemplate?.valueType ?? RuleValueType.Number,
    ruleLabel,
  });

  const enumOptions = selectedTemplate?.enumOptions ?? [];
  const { isGateRule, isLevelRule, previewText, requiredValueOptions, sourceFieldOptions } =
    getAddRuleDialogPresentation({
      configLabel,
      enumOptions,
      ruleLabel,
      ruleType,
      sectionTitle,
      templates,
      unit,
      value,
      valueType,
    });

  function handleConfigLabelChange(nextLabel: string) {
    const nextTemplate = templates.find((template) => template.configLabel === nextLabel) ?? templates[0];

    setConfigLabel(nextLabel);
    if (!nextTemplate) return;

    const nextValue = getDefaultValueForTemplate(nextTemplate);
    const nextUnit = nextTemplate.unitOptions[0] ?? "";
    setValue(nextValue);
    setUnit(nextUnit);
    syncDescriptionIfNeeded({ configLabel: nextLabel, unit: nextUnit, value: nextValue, valueType: nextTemplate.valueType });
  }

  function handleValueChange(nextValue: string) {
    setValue(nextValue);
    syncDescriptionIfNeeded({ configLabel, unit, value: nextValue, valueType });
  }

  function handleGateSourceFieldChange(nextRuleType: RuleType) {
    const matchingTemplate = templates.find((template) => template.ruleType === nextRuleType);
    handleConfigLabelChange(matchingTemplate?.configLabel ?? configLabel);
  }

  function handleUnitChange(nextUnit: string) {
    setUnit(nextUnit);
    syncDescriptionIfNeeded({ configLabel, unit: nextUnit, value, valueType });
  }

  async function handleSubmit() {
    setValidationError(null);
    if (!selectedTemplate || !ruleType) return;

    const validationMessage = validateRuleInput({ description, enumOptions, name, value, valueType });
    if (validationMessage) return setValidationError(validationMessage);

    await onSubmit({
      approvalRole,
      defaultOperator: getOperatorForValueType(valueType) as Operator,
      defaultUnit: selectedTemplate.unitOptions.length > 0 ? unit.trim() || undefined : undefined,
      description: description.trim(),
      name: name.trim(),
      optionsJson: buildRuleOptionsJson({ configLabel, enumOptions, valueType }),
      ruleType,
      value,
      valueType,
    });
  }

  return (
    <AddRuleDialogFrame
      onClose={() => setIsDiscardConfirmOpen(true)}
      onSubmit={() => void handleSubmit()}
      ruleLabel={ruleLabel}
      submitDisabled={submitting || !name.trim() || !description.trim()}
      submitting={submitting}
    >
      <AddRuleDialogFields
        configHelpText={selectedTemplate?.helpText ?? ""}
        configLabelOptions={templates.map((template) => template.businessLabel)}
        selectedConfigOptionLabel={selectedTemplate?.businessLabel ?? ""}
        description={description}
        enumOptions={enumOptions}
        gateRuleEditor={
          isGateRule && ruleType
            ? {
                onSourceFieldChange: handleGateSourceFieldChange,
                onValueChange: handleValueChange,
                previewText,
                requiredValueOptions,
                selectedRuleType: ruleType,
                sourceFieldOptions,
                value,
              }
            : undefined
        }
        levelRuleEditor={
          isLevelRule ? { helperText: "Employees must have at least this responsibility level to qualify.", onValueChange: handleValueChange, previewText, value } : undefined
        }
        previewText={previewText}
        ruleLabel={ruleLabel}
        onConfigLabelChange={(businessLabel) => handleConfigLabelChange(templates.find((template) => template.businessLabel === businessLabel)?.configLabel ?? businessLabel)}
        onDescriptionChange={(nextDescription) => handleDescriptionChange(nextDescription, previewText)}
        onNameChange={setName}
        onUnitChange={handleUnitChange}
        onValueChange={handleValueChange}
        unit={unit}
        unitOptions={selectedTemplate?.unitOptions ?? []}
        validationError={validationError}
        value={value}
        valueType={valueType}
      />
      <RuleApprovalSection approvalRole={approvalRole} onApprovalRoleChange={setApprovalRole} />
      {isDiscardConfirmOpen ? <DiscardChangesDialog description="Your edits to this rule will not be saved." onClose={() => setIsDiscardConfirmOpen(false)} onConfirm={onClose} /> : null}
    </AddRuleDialogFrame>
  );
}
