import { RuleValueType } from "@/shared/apollo/generated";
import type { RuleType } from "@/shared/apollo/generated";

import GateRuleEditorCard from "./GateRuleEditorCard";
import LevelRuleEditorCard from "./LevelRuleEditorCard";

type EditRuleDialogFieldsProps = {
  configHelpText: string;
  description: string;
  enumOptions: string[];
  gateRuleEditor?: {
    onSourceFieldChange: (value: RuleType) => void;
    onValueChange: (value: string) => void;
    previewText: string;
    requiredValueOptions: Array<{ label: string; value: string }>;
    selectedRuleType: RuleType;
    sourceFieldOptions: Array<{ label: string; value: RuleType }>;
    value: string;
  };
  levelRuleEditor?: {
    helperText: string;
    onValueChange: (value: string) => void;
    previewText: string;
    value: string;
  };
  measurement: string;
  name: string;
  onDescriptionChange: (value: string) => void;
  onMeasurementChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onValueChange: (value: string) => void;
  previewText: string;
  unitOptions: string[];
  validationError: string | null;
  value: string;
  valueType: RuleValueType;
};

export default function EditRuleDialogFields(props: EditRuleDialogFieldsProps) {
  const {
    configHelpText,
    description,
    enumOptions,
    gateRuleEditor,
    levelRuleEditor,
    measurement,
    name,
    onDescriptionChange,
    onMeasurementChange,
    onNameChange,
    onValueChange,
    previewText,
    unitOptions,
    validationError,
    value,
    valueType,
  } = props;
  const showMeasurementSelector = unitOptions.length > 1;

  if (gateRuleEditor) {
    return (
      <div className="flex flex-col gap-8 p-0 sm:p-[2px]">
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Rule Name</span>
          <input className="h-9 rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-5 text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onNameChange(event.target.value)} type="text" value={name} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">Description</span>
          <textarea className="min-h-24 rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onDescriptionChange(event.target.value)} value={description} />
        </label>
        <div className="h-px w-full bg-[#DBDEE1]" />
        <GateRuleEditorCard
          onSourceFieldChange={gateRuleEditor.onSourceFieldChange}
          onValueChange={gateRuleEditor.onValueChange}
          previewText={gateRuleEditor.previewText}
          requiredValueOptions={gateRuleEditor.requiredValueOptions}
          selectedRuleType={gateRuleEditor.selectedRuleType}
          sourceFieldOptions={gateRuleEditor.sourceFieldOptions}
          value={gateRuleEditor.value}
        />
        {validationError && <p className="text-sm text-red-600">{validationError}</p>}
      </div>
    );
  }

  if (levelRuleEditor) {
    return (
      <div className="flex flex-col gap-8 p-0 sm:p-[2px]">
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Rule Name</span>
          <input className="h-9 rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-5 text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onNameChange(event.target.value)} type="text" value={name} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">Description</span>
          <textarea className="min-h-24 rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onDescriptionChange(event.target.value)} value={description} />
        </label>
        <div className="h-px w-full bg-[#DBDEE1]" />
        <LevelRuleEditorCard
          helperText={levelRuleEditor.helperText}
          onValueChange={levelRuleEditor.onValueChange}
          previewText={levelRuleEditor.previewText}
          value={levelRuleEditor.value}
        />
        {validationError && <p className="text-sm text-red-600">{validationError}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-0 sm:p-[2px]">
      <label className="flex flex-col gap-2">
        <span className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Rule Name</span>
        <input className="h-9 rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-5 text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onNameChange(event.target.value)} type="text" value={name} />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">Description</span>
        <textarea className="min-h-24 rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onDescriptionChange(event.target.value)} value={description} />
      </label>
      <div className={`grid grid-cols-1 gap-4 ${showMeasurementSelector ? "sm:grid-cols-2" : ""}`}>
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Default Requirement</span>
          {valueType === RuleValueType.Boolean ? (
            <select className="h-9 rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-[18px] text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onValueChange(event.target.value)} value={value.toLowerCase() === "true" ? "true" : "false"}><option value="true">True</option><option value="false">False</option></select>
          ) : valueType === RuleValueType.Enum ? (
            <select className="h-9 rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-[18px] text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onValueChange(event.target.value)} value={enumOptions.includes(value) ? value : ""}>{enumOptions.length === 0 ? <option value="">No options</option> : enumOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>
          ) : (
            <input className="h-9 rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onValueChange(event.target.value)} step="any" type="number" value={value} />
          )}
          <span className="text-[12px] leading-4 text-[#64748B]">
            {configHelpText}
          </span>
        </label>
        {showMeasurementSelector ? (
          <label className="flex flex-col gap-2">
            <span className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Measurement</span>
            <select className="h-9 rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-[18px] text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none disabled:cursor-not-allowed disabled:bg-[#F3F5F8] disabled:text-[#9CA3AF]" disabled={valueType === RuleValueType.Boolean || valueType === RuleValueType.Enum} onChange={(event) => onMeasurementChange(event.target.value)} value={measurement}>
              {unitOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        ) : null}
      </div>
      <div className="w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
        <div className="text-[12px] leading-4 font-semibold uppercase tracking-[0.04em] text-[#64748B]">
          Preview
        </div>
        <p className="mt-1 text-[14px] leading-5 text-[#0F172A]">
          {previewText}
        </p>
      </div>
      {validationError && <p className="text-sm text-red-600">{validationError}</p>}
    </div>
  );
}
