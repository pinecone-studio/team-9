"use client";

import { useState } from "react";
import DiscardChangesDialog from "@/app/(hr)/components/DiscardChangesDialog";
import { ApprovalRole, RuleType as RuleTypeEnum, RuleValueType } from "@/shared/apollo/generated";
import type { RuleType } from "@/shared/apollo/generated";

import EditRuleDialogFooter from "./EditRuleDialogFooter";
import EditRuleDialogFields from "./EditRuleDialogFields";
import RuleDeleteConfirmDialog from "./RuleDeleteConfirmDialog";
import RuleApprovalSection, { type ApprovalRoleValue } from "./RuleApprovalSection";
import { useEditRuleDeleteFlow } from "./useEditRuleDeleteFlow";
import { buildRuleOptionsJson, validateRuleInput } from "./add-rule-dialog.helpers";
import { getEditRuleGateConfig, getNextGateRuleValue } from "./edit-rule-dialog.gate";
import { parseOptionsJson } from "./edit-rule-dialog.utils";
import type { RuleCardModel } from "../types";

type EditRuleDialogProps = {
  employeeRoles: string[];
  onClose: () => void;
  onDelete: (payload: { approvalRole: ApprovalRoleValue; deleteComment: string; id: string }) => Promise<void>;
  onSave: (payload: { approvalRole: ApprovalRoleValue; description: string; id: string; measurement?: string; name: string; optionsJson?: string; ruleType?: RuleType; value?: string; valueType?: RuleValueType }) => Promise<void>;
  rule: RuleCardModel;
  submitting?: boolean;
};

export default function EditRuleDialog({
  employeeRoles,
  onClose,
  onDelete,
  onSave,
  rule,
  submitting = false,
}: EditRuleDialogProps) {
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const parsedOptions = parseOptionsJson(rule.optionsJson);
  const [selectedRuleType, setSelectedRuleType] = useState<RuleType>(rule.ruleType);
  const [name, setName] = useState(rule.name);
  const [description, setDescription] = useState(rule.description);
  const [value, setValue] = useState(rule.metricValue ?? "");
  const [measurement, setMeasurement] = useState(rule.defaultUnit ?? "");
  const [approvalRole, setApprovalRole] = useState<ApprovalRoleValue>(ApprovalRole.HrAdmin);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { deleteComment, deleteMode, handleDeleteCancel, handleDeleteClick, handleDeleteConfirmClick, handleDeleteSubmit, isDeleteConfirmOpen, setDeleteComment } = useEditRuleDeleteFlow({
    onDelete,
    ruleId: rule.id,
    setErrorMessage: setValidationError,
  });

  const { configLabel, enumOptions, gateTemplates, helpText, isGateRule, previewText, requiredValueOptions, selectedTemplate, sourceFieldOptions, valueType } = getEditRuleGateConfig({ employeeRoles, measurement, parsedOptions, rule, selectedRuleType, value });
  const isLevelRule = rule.ruleType === RuleTypeEnum.ResponsibilityLevel;
  const unitOptions = selectedTemplate.unitOptions;
  const effectivePreviewText = isLevelRule
    ? `This level rule checks whether "Responsibility Level" is at least Level ${value || "1"}.`
    : previewText;

  function handleSourceFieldChange(nextRuleType: RuleType) {
    setSelectedRuleType(nextRuleType);
    setValue(getNextGateRuleValue({ currentValue: value, gateTemplates, nextRuleType }));
  }

  async function handleSave() {
    setValidationError(null);
    const validationMessage = validateRuleInput({
      description,
      enumOptions,
      name,
      value,
      valueType,
    });
    if (validationMessage) return setValidationError(validationMessage);

    await onSave({
      approvalRole,
      description: description.trim(),
      id: rule.id,
      measurement:
        valueType === RuleValueType.Number || valueType === RuleValueType.Date
          ? measurement.trim() || undefined
          : undefined,
      name: name.trim(),
      ruleType: selectedRuleType,
      optionsJson: buildRuleOptionsJson({
        configLabel,
        enumOptions,
        valueType,
      }),
      valueType,
      value:
        valueType === RuleValueType.Number || valueType === RuleValueType.Date
          ? JSON.stringify(Number(value))
          : valueType === RuleValueType.Boolean
            ? JSON.stringify(value.toLowerCase() === "true")
            : JSON.stringify(value),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="flex h-[760px] w-full max-w-[531px] flex-col overflow-hidden rounded-[12px] bg-white p-6 shadow-[0_20px_45px_rgba(0,0,0,0.2)]">
        <div className="flex w-full flex-1 min-h-0 flex-col gap-8">
          <div className="flex w-full items-start justify-between gap-4">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <h2 className="text-[18px] leading-7 font-semibold text-[#0F172A]">
                {`Edit ${rule.name} Rule`}
              </h2>
              <p className="text-[14px] leading-5 font-normal text-[#64748B]">
                Configure your new rule settings and affected benefits.
              </p>
            </div>
            <button
              aria-label="Close dialog"
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#0F172A] transition hover:bg-[#F5F5F5]"
              onClick={onClose}
              type="button"
            >
              <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 5L15 15" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                <path d="M15 5L5 15" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-8">
              <EditRuleDialogFields
                configHelpText={helpText}
                description={description}
                enumOptions={enumOptions}
                gateRuleEditor={isGateRule ? { onSourceFieldChange: handleSourceFieldChange, onValueChange: setValue, previewText, requiredValueOptions, selectedRuleType, sourceFieldOptions, value } : undefined}
                levelRuleEditor={
                  isLevelRule
                    ? {
                        helperText: "Employees must have at least this responsibility level to qualify.",
                        onValueChange: setValue,
                        previewText: effectivePreviewText,
                        value,
                      }
                    : undefined
                }
                measurement={measurement}
                name={name}
                onDescriptionChange={setDescription}
                onMeasurementChange={setMeasurement}
                onNameChange={setName}
                onValueChange={setValue}
                previewText={effectivePreviewText}
                unitOptions={unitOptions}
                validationError={validationError}
                value={value}
                valueType={valueType}
              />
              <RuleApprovalSection approvalRole={approvalRole} onApprovalRoleChange={setApprovalRole} />
            </div>
          </div>
          <EditRuleDialogFooter
            deleteComment={deleteComment}
            deleteMode={deleteMode}
            onCancel={() => setIsDiscardConfirmOpen(true)}
            onDeleteCommentChange={setDeleteComment}
            onDeleteCancel={handleDeleteCancel}
            onDeleteClick={handleDeleteClick}
            onDeleteConfirm={handleDeleteConfirmClick}
            onSave={() => void handleSave()}
            saveDisabled={submitting || !name.trim() || !description.trim()}
            submitting={submitting}
          />
        </div>
      </div>
      {isDiscardConfirmOpen ? <DiscardChangesDialog description="Your edits to this rule will not be saved." onClose={() => setIsDiscardConfirmOpen(false)} onConfirm={onClose} /> : null}
      {isDeleteConfirmOpen ? (
        <RuleDeleteConfirmDialog benefitUsageCount={rule.usageCount} loading={submitting} onClose={handleDeleteCancel} onConfirm={() => void handleDeleteSubmit(approvalRole)} />
      ) : null}
    </div>
  );
}
