"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { RuleValueType } from "@/shared/apollo/generated";
import type { Operator, RuleType } from "@/shared/apollo/generated";

import AddRuleDialogFields from "./AddRuleDialogFields";
import {
  getConfigLabelOptions,
  getDefaultEnumOptions,
  getDefaultValueForType,
  getOperatorForValueType,
  getRuleTypeFromSection,
  getRuleTypeLabel,
  getUnitOptions,
} from "./add-rule-dialog.utils";

type AddRuleDialogProps = {
  onClose: () => void;
  onSubmit: (input: {
    defaultOperator: Operator;
    defaultUnit?: string;
    description: string;
    name: string;
    optionsJson?: string;
    ruleType: RuleType;
    valueType: RuleValueType;
    value: string;
  }) => Promise<void>;
  sectionTitle: string;
  submitting?: boolean;
};

export default function AddRuleDialog({
  onClose,
  onSubmit,
  sectionTitle,
  submitting = false,
}: AddRuleDialogProps) {
  const ruleType = getRuleTypeFromSection(sectionTitle);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [valueType, setValueType] = useState<RuleValueType>(RuleValueType.Number);
  const [value, setValue] = useState("0");
  const initialConfigLabel = getConfigLabelOptions(ruleType, RuleValueType.Number)[0] ?? "Minimum Tenure";
  const [configLabel, setConfigLabel] = useState(initialConfigLabel);
  const [unit, setUnit] = useState(getUnitOptions(initialConfigLabel, RuleValueType.Number)[0] ?? "");
  const [enumOptionsInput, setEnumOptionsInput] = useState(() => getDefaultEnumOptions(ruleType).join(", "));
  const [validationError, setValidationError] = useState<string | null>(null);

  const enumOptions = enumOptionsInput.split(",").map((item) => item.trim()).filter(Boolean);
  const configLabelOptions = getConfigLabelOptions(ruleType, valueType);
  const unitOptions = getUnitOptions(configLabel, valueType);

  const onValueTypeChange = (nextType: RuleValueType) => {
    setValueType(nextType);
    setValue(getDefaultValueForType(nextType));
    const nextConfigLabel = getConfigLabelOptions(ruleType, nextType)[0] ?? "";
    setConfigLabel(nextConfigLabel);
    setUnit(getUnitOptions(nextConfigLabel, nextType)[0] ?? "");
    if (nextType === RuleValueType.Enum) {
      const defaults = getDefaultEnumOptions(ruleType);
      setEnumOptionsInput(defaults.join(", "));
      setValue(defaults[0]);
    }
    if (nextType === RuleValueType.Boolean) setValue("true");
    if (nextType === RuleValueType.Number || nextType === RuleValueType.Date) setUnit("");
  };

  const onConfigLabelChange = (nextLabel: string) => {
    setConfigLabel(nextLabel);
    setUnit(getUnitOptions(nextLabel, valueType)[0] ?? "");
  };

  const onEnumOptionsInputChange = (next: string) => {
    setEnumOptionsInput(next);
    const parsed = next.split(",").map((item) => item.trim()).filter(Boolean);
    if (parsed.length > 0 && !parsed.includes(value)) setValue(parsed[0]);
  };

  async function handleSubmit() {
    setValidationError(null);
    if (!name.trim() || !description.trim()) return setValidationError("Rule name and description are required.");
    if ((valueType === RuleValueType.Number || valueType === RuleValueType.Date) && !Number.isFinite(Number(value))) {
      return setValidationError("Default value must be a valid number.");
    }
    if (valueType === RuleValueType.Enum && (enumOptions.length === 0 || !enumOptions.includes(value))) {
      return setValidationError(enumOptions.length === 0 ? "Enum type requires at least one option." : "Default value must match one of enum options.");
    }
    if (valueType === RuleValueType.Boolean && !["true", "false"].includes(value)) {
      return setValidationError("Boolean type default value must be true or false.");
    }

    await onSubmit({
      defaultOperator: getOperatorForValueType(valueType),
      defaultUnit: valueType === RuleValueType.Number || valueType === RuleValueType.Date ? unit.trim() || undefined : undefined,
      description: description.trim(),
      name: name.trim(),
      optionsJson: valueType === RuleValueType.Boolean
        ? JSON.stringify({ configLabel, options: [true, false] })
        : valueType === RuleValueType.Enum
          ? JSON.stringify({ configLabel, options: enumOptions })
          : JSON.stringify({ configLabel }),
      ruleType,
      value,
      valueType,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative flex w-full max-w-[512px] flex-col items-start gap-4 rounded-[8px] border border-[#DBDEE1] bg-white px-6 py-[55px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
        <button aria-label="Close dialog" className="absolute top-[17px] right-[17px] opacity-70" onClick={onClose} type="button">
          <X className="h-5 w-5 text-[#060B10]" />
        </button>

        <div className="flex w-full flex-col items-start gap-2">
          <h2 className="text-[18px] leading-[18px] font-semibold text-[#060B10]">Add New {getRuleTypeLabel(sectionTitle)} Rule</h2>
          <p className="text-[14px] leading-5 font-normal text-[#51565B]">Configure your new rule settings and affected benefits.</p>
        </div>

        <AddRuleDialogFields
          configLabel={configLabel}
          configLabelOptions={configLabelOptions}
          description={description}
          enumOptions={enumOptions}
          enumOptionsInput={enumOptionsInput}
          onConfigLabelChange={onConfigLabelChange}
          onDescriptionChange={setDescription}
          onEnumOptionsInputChange={onEnumOptionsInputChange}
          onNameChange={setName}
          onUnitChange={setUnit}
          onValueChange={setValue}
          onValueTypeChange={onValueTypeChange}
          unit={unit}
          unitOptions={unitOptions}
          validationError={validationError}
          value={value}
          valueType={valueType}
        />

        <div className="flex w-full justify-end gap-2">
          <button className="flex h-9 items-center justify-center rounded-[6px] border border-[#DBDEE1] bg-[#F9FAFB] px-4 text-[14px] leading-5 font-medium text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)]" onClick={onClose} type="button">Cancel</button>
          <button className="flex h-9 items-center justify-center rounded-[6px] bg-[#424242] px-4 text-[14px] leading-5 font-medium text-[#FAFAFA] disabled:opacity-50" disabled={submitting || !name.trim() || !description.trim()} onClick={() => void handleSubmit()} type="button">
            {submitting ? "Adding..." : "Add Rule"}
          </button>
        </div>
      </div>
    </div>
  );
}
