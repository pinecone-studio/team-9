"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { ApprovalRole, RuleValueType } from "@/shared/apollo/generated";

import EditRuleDialogFields from "./EditRuleDialogFields";
import RuleApprovalSection, {
  type ApprovalRoleValue,
} from "./RuleApprovalSection";
import { buildRuleOptionsJson, validateRuleInput } from "./add-rule-dialog.helpers";
import { parseOptionsJson } from "./edit-rule-dialog.utils";
import { formatRulePreview } from "./rule-backend-formatters";
import { getTemplateByRuleType } from "./rule-backend-metadata";
import type { RuleCardModel } from "../types";

type EditRuleDialogProps = {
  onClose: () => void;
  onDelete: (payload: {
    approvalRole: ApprovalRoleValue;
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
  const parsedOptions = parseOptionsJson(rule.optionsJson);
  const template = getTemplateByRuleType(rule.ruleType, { employeeRoles: [] });
  const [name, setName] = useState(rule.name);
  const [description, setDescription] = useState(rule.description);
  const [value, setValue] = useState(rule.metricValue ?? "");
  const [measurement, setMeasurement] = useState(rule.defaultUnit ?? "");
  const [approvalRole, setApprovalRole] = useState<ApprovalRoleValue>(ApprovalRole.HrAdmin);
  const [validationError, setValidationError] = useState<string | null>(null);

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
      <div className="w-full max-w-[531px] rounded-[12px] bg-white p-6 shadow-[0_20px_45px_rgba(0,0,0,0.2)]">
        <div className="flex w-full flex-col gap-8">
          <div className="flex w-full flex-col gap-2">
            <h2 className="text-[18px] leading-7 font-semibold text-[#0F172A]">Edit Rule</h2>
            <p className="text-[14px] leading-5 font-normal text-[#64748B]">Modify the conditions that determine this rule.</p>
          </div>

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

          <RuleApprovalSection
            approvalRole={approvalRole}
            onApprovalRoleChange={setApprovalRole}
          />

          <div className="flex w-full items-center justify-between gap-[9px]">
            <button className="flex h-[38px] items-center gap-[10px] rounded-[6px] border border-[#FFC4C4] bg-[#EF4444] px-[10px] text-white" disabled={submitting} onClick={() => void onDelete({ approvalRole, id: rule.id })} type="button">
              <Trash2 className="h-[18px] w-[18px]" />
              <span className="text-[14px] leading-4 font-medium">Delete</span>
            </button>
            <div className="flex items-center gap-[9px]">
              <button className="flex h-9 items-center justify-center rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] px-[10px] text-[14px] leading-4 font-normal text-black" onClick={onClose} type="button">Cancel</button>
              <button className="flex h-9 items-center justify-center rounded-[6px] bg-black px-[10px] text-[14px] leading-4 font-normal text-white" disabled={submitting || !name.trim() || !description.trim()} onClick={() => void handleSave()} type="button">
                {submitting ? "Submitting..." : "Submit Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
