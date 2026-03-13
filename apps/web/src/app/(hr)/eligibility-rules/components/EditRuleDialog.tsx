"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { RuleValueType } from "@/shared/apollo/generated";

import EditRuleDialogFields from "./EditRuleDialogFields";
import { getUnitOptions, parseOptionsJson } from "./edit-rule-dialog.utils";
import type { RuleCardModel } from "../types";

type EditRuleDialogProps = {
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  onSave: (payload: {
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
  const [name, setName] = useState(rule.name);
  const [description, setDescription] = useState(rule.description);
  const [value, setValue] = useState(rule.metricValue ?? "");
  const [measurement, setMeasurement] = useState(rule.defaultUnit ?? "");
  const [enumOptionsInput, setEnumOptionsInput] = useState(parsedOptions.options.join(", "));
  const [validationError, setValidationError] = useState<string | null>(null);

  const enumOptions = enumOptionsInput.split(",").map((item) => item.trim()).filter(Boolean);
  const configLabel = parsedOptions.configLabel ?? rule.metricLabel ?? "";
  const unitOptions = getUnitOptions(configLabel, rule.valueType);
  const ruleTypeLabel = rule.valueType === RuleValueType.Boolean ? "Boolean" : rule.valueType === RuleValueType.Enum ? "Enum" : rule.valueType === RuleValueType.Date ? "Date" : "Number";

  const onEnumOptionsInputChange = (next: string) => {
    setEnumOptionsInput(next);
    const parsed = next.split(",").map((item) => item.trim()).filter(Boolean);
    if (parsed.length > 0 && !parsed.includes(value)) setValue(parsed[0]);
  };

  async function handleSave() {
    setValidationError(null);
    if ((rule.valueType === RuleValueType.Number || rule.valueType === RuleValueType.Date) && !Number.isFinite(Number(value))) {
      return setValidationError("Default requirement must be a valid number.");
    }
    if (rule.valueType === RuleValueType.Enum && (enumOptions.length === 0 || !enumOptions.includes(value))) {
      return setValidationError(enumOptions.length === 0 ? "Enum type requires at least one option." : "Default requirement must match one of enum options.");
    }

    await onSave({
      description: description.trim(),
      id: rule.id,
      measurement: rule.valueType === RuleValueType.Number || rule.valueType === RuleValueType.Date ? measurement.trim() || undefined : undefined,
      name: name.trim(),
      optionsJson: rule.valueType === RuleValueType.Boolean
        ? JSON.stringify({ configLabel, options: [true, false] })
        : rule.valueType === RuleValueType.Enum
          ? JSON.stringify({ configLabel, options: enumOptions })
          : JSON.stringify({ configLabel }),
      value: rule.valueType === RuleValueType.Number || rule.valueType === RuleValueType.Date
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
            description={description}
            enumOptions={enumOptions}
            enumOptionsInput={enumOptionsInput}
            measurement={measurement}
            name={name}
            onDescriptionChange={setDescription}
            onEnumOptionsInputChange={onEnumOptionsInputChange}
            onMeasurementChange={setMeasurement}
            onNameChange={setName}
            onValueChange={setValue}
            ruleMetricLabel={rule.metricLabel}
            ruleTypeLabel={ruleTypeLabel}
            unitOptions={unitOptions}
            validationError={validationError}
            value={value}
            valueType={rule.valueType}
          />

          <div className="flex w-full items-center justify-between gap-[9px]">
            <button className="flex h-[38px] items-center gap-[10px] rounded-[6px] border border-[#FFC4C4] bg-[#EF4444] px-[10px] text-white" disabled={submitting} onClick={() => void onDelete(rule.id)} type="button">
              <Trash2 className="h-[18px] w-[18px]" />
              <span className="text-[14px] leading-4 font-medium">Delete</span>
            </button>
            <div className="flex items-center gap-[9px]">
              <button className="flex h-9 items-center justify-center rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] px-[10px] text-[14px] leading-4 font-normal text-black" onClick={onClose} type="button">Cancel</button>
              <button className="flex h-9 items-center justify-center rounded-[6px] bg-black px-[10px] text-[14px] leading-4 font-normal text-white" disabled={submitting || !name.trim() || !description.trim()} onClick={() => void handleSave()} type="button">
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
