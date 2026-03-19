"use client";

import { useState } from "react";
import DiscardChangesDialog from "@/app/(hr)/components/DiscardChangesDialog";
import { ApprovalRole, RuleValueType } from "@/shared/apollo/generated";
import {
  HR_DIALOG_MAX_HEIGHT_CLASS,
  HR_DIALOG_OVERLAY_BASE_CLASS,
} from "@/shared/ui/dialog-styles";

import EditRuleDialogFooter from "./EditRuleDialogFooter";
import EditRuleDialogFields from "./EditRuleDialogFields";
import RuleDeleteConfirmDialog from "./RuleDeleteConfirmDialog";
import RuleApprovalSection, {
  type ApprovalRoleValue,
} from "./RuleApprovalSection";
import { useEditRuleDeleteFlow } from "./useEditRuleDeleteFlow";
import { buildRuleOptionsJson, validateRuleInput } from "./add-rule-dialog.helpers";
import { parseOptionsJson } from "./edit-rule-dialog.utils";
import { formatRulePreview } from "./rule-backend-formatters";
import { getTemplateByRuleType } from "./rule-backend-metadata";
import type { RuleCardModel } from "../types";

type EditRuleDialogProps = {
  onClose: () => void;
  onDelete: (payload: {
    approvalRole: ApprovalRoleValue;
    deleteComment: string;
    id: string;
  }) => Promise<void>;
  onSave: (payload: {
    approvalRole: ApprovalRoleValue;
    description: string;
    id: string;
    measurement?: string;
    name: string;
    optionsJson?: string;
    value?: string;
  }) => Promise<void>;
  rule: RuleCardModel;
  submitting?: boolean;
};

export default function EditRuleDialog({
  onClose,
  onDelete,
  onSave,
  rule,
  submitting = false,
}: EditRuleDialogProps) {
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const parsedOptions = parseOptionsJson(rule.optionsJson);
  const template = getTemplateByRuleType(rule.ruleType, { employeeRoles: [] });
  const [name, setName] = useState(rule.name);
  const [description, setDescription] = useState(rule.description);
  const [value, setValue] = useState(rule.metricValue ?? "");
  const [measurement, setMeasurement] = useState(rule.defaultUnit ?? "");
  const [approvalRole, setApprovalRole] = useState<ApprovalRoleValue>(ApprovalRole.HrAdmin);
  const [validationError, setValidationError] = useState<string | null>(null);
  const {
    deleteComment,
    deleteMode,
    handleDeleteCancel,
    handleDeleteClick,
    handleDeleteConfirmClick,
    handleDeleteSubmit,
    isDeleteConfirmOpen,
    setDeleteComment,
  } = useEditRuleDeleteFlow({
    onDelete,
    ruleId: rule.id,
    setErrorMessage: setValidationError,
  });

  const enumOptions = parsedOptions.options;
  const configLabel = parsedOptions.configLabel ?? template.configLabel;
  const unitOptions = template.unitOptions;
  const helpText = template.helpText;
  const previewText = formatRulePreview({
    configLabel,
    ruleLabel: rule.categoryName.replace(/ Rules$/, ""),
    unit: measurement,
    value,
    valueType: rule.valueType,
  });

  async function handleSave() {
    setValidationError(null);
    const validationMessage = validateRuleInput({
      description,
      enumOptions,
      name,
      value,
      valueType: rule.valueType,
    });
    if (validationMessage) return setValidationError(validationMessage);

    await onSave({
      approvalRole,
      description: description.trim(),
      id: rule.id,
      measurement:
        rule.valueType === RuleValueType.Number || rule.valueType === RuleValueType.Date
          ? measurement.trim() || undefined
          : undefined,
      name: name.trim(),
      optionsJson: buildRuleOptionsJson({
        configLabel,
        enumOptions,
        valueType: rule.valueType,
      }),
      value:
        rule.valueType === RuleValueType.Number || rule.valueType === RuleValueType.Date
          ? JSON.stringify(Number(value))
          : rule.valueType === RuleValueType.Boolean
            ? JSON.stringify(value.toLowerCase() === "true")
            : JSON.stringify(value),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="flex h-[760px] w-full max-w-[531px] flex-col overflow-hidden rounded-[12px] bg-white p-6 shadow-[0_20px_45px_rgba(0,0,0,0.2)]">
        <div className="flex w-full flex-1 min-h-0 flex-col gap-8">
          <div className="flex w-full flex-col gap-2">
            <h2 className="text-[18px] leading-7 font-semibold text-[#0F172A]">Edit Rule</h2>
            <p className="text-[14px] leading-5 font-normal text-[#64748B]">Modify the conditions that determine this rule.</p>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex flex-col gap-8">
              <EditRuleDialogFields
                configHelpText={helpText}
                description={description}
                enumOptions={enumOptions}
                measurement={measurement}
                name={name}
                onDescriptionChange={setDescription}
                onMeasurementChange={setMeasurement}
                onNameChange={setName}
                onValueChange={setValue}
                previewText={previewText}
                unitOptions={unitOptions}
                validationError={validationError}
                value={value}
                valueType={rule.valueType}
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
        <RuleDeleteConfirmDialog
          benefitUsageCount={rule.usageCount}
          loading={submitting}
          onClose={handleDeleteCancel}
          onConfirm={() => void handleDeleteSubmit(approvalRole)}
        />
      ) : null}
    </div>
  );
}
