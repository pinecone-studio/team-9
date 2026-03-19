import { RuleValueType } from "@/shared/apollo/generated";
import type { RuleType } from "@/shared/apollo/generated";

import GateRuleEditorCard from "./GateRuleEditorCard";
import LevelRuleEditorCard from "./LevelRuleEditorCard";

type AddRuleDialogFieldsProps = {
  configHelpText: string;
  configLabelOptions: string[];
  selectedConfigOptionLabel: string;
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
  previewText: string;
  ruleLabel: string;
  onConfigLabelChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  onValueChange: (value: string) => void;
  unit: string;
  unitOptions: string[];
  validationError: string | null;
  value: string;
  valueType: RuleValueType;
};

export default function AddRuleDialogFields(props: AddRuleDialogFieldsProps) {
  const {
    configHelpText,
    configLabelOptions,
    selectedConfigOptionLabel,
    description,
    enumOptions,
    gateRuleEditor,
    levelRuleEditor,
    previewText,
    ruleLabel,
    onConfigLabelChange,
    onDescriptionChange,
    onNameChange,
    onUnitChange,
    onValueChange,
    unit,
    unitOptions,
    validationError,
    value,
    valueType,
  } = props;
  const showConfigSelector = configLabelOptions.length > 1;
  const showMeasurementSelector = unitOptions.length > 1;

  if (gateRuleEditor) {
    return (
      <div className="flex w-full flex-col items-start gap-4 py-4">
      <label className="flex w-full flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">Rule name</span>
          <input className="h-9 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]" onChange={(event) => onNameChange(event.target.value)} placeholder={`e.g., ${ruleLabel} approval gate`} type="text" />
        </label>
        <label className="flex w-full flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">What does this rule do?</span>
          <textarea className="min-h-16 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]" onChange={(event) => onDescriptionChange(event.target.value)} placeholder="Explain the condition in plain language..." value={description} />
        </label>
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
      <div className="flex w-full flex-col items-start gap-4 py-4">
        <label className="flex w-full flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">
            Rule name
          </span>
          <input className="h-9 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]" onChange={(event) => onNameChange(event.target.value)} placeholder={`e.g., ${ruleLabel} approval gate`} type="text" />
        </label>
        <label className="flex w-full flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">
            What does this rule do?
          </span>
          <textarea className="min-h-16 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]" onChange={(event) => onDescriptionChange(event.target.value)} placeholder="Explain the condition in plain language..." value={description} />
        </label>
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
    <div className="flex w-full flex-col items-start gap-4 py-4">
      <label className="flex w-full flex-col gap-2">
        <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">Rule name</span>
        <input className="h-9 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]" onChange={(event) => onNameChange(event.target.value)} placeholder={`e.g., ${ruleLabel} approval gate`} type="text" />
      </label>
      <label className="flex w-full flex-col gap-2">
        <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">What does this rule do?</span>
        <textarea className="min-h-16 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]" onChange={(event) => onDescriptionChange(event.target.value)} placeholder="Explain the condition in plain language..." value={description} />
      </label>
      {showConfigSelector ? (
        <label className="flex w-full flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">
            What should HR check?
          </span>
          <select className="h-9 rounded-[6px] border border-[#E2E5E8] bg-white px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onConfigLabelChange(event.target.value)} value={selectedConfigOptionLabel}>
            {configLabelOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <span className="text-[12px] leading-4 text-[#64748B]">
            {configHelpText}
          </span>
        </label>
      ) : null}

      <div className={`grid w-full grid-cols-1 gap-4 ${showMeasurementSelector ? "sm:grid-cols-2" : ""}`}>
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">
            Required value
          </span>
          {valueType === RuleValueType.Boolean ? (
            <select className="h-9 rounded-[6px] border border-[#E2E5E8] bg-white px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onValueChange(event.target.value)} value={value}><option value="true">True</option><option value="false">False</option></select>
          ) : valueType === RuleValueType.Enum ? (
            <select className="h-9 rounded-[6px] border border-[#E2E5E8] bg-white px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onValueChange(event.target.value)} value={value}>{enumOptions.length === 0 ? <option value="">No options</option> : enumOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>
          ) : (
            <input className="h-9 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#060B10]" onChange={(event) => onValueChange(event.target.value)} step="any" type="number" value={value} />
          )}
        </label>
        {showMeasurementSelector ? (
          <label className="flex flex-col gap-2">
            <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">
              Measurement
            </span>
            <select className="h-9 rounded-[6px] border border-[#E2E5E8] bg-white px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none disabled:cursor-not-allowed disabled:bg-[#F3F5F8] disabled:text-[#9CA3AF]" disabled={valueType === RuleValueType.Boolean || valueType === RuleValueType.Enum} onChange={(event) => onUnitChange(event.target.value)} value={unit}>{unitOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>
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
