import { ChevronDown } from "lucide-react";
import { RuleValueType } from "@/shared/apollo/generated";

type AddRuleDialogFieldsProps = {
  configLabel: string;
  configLabelOptions: string[];
  description: string;
  enumOptions: string[];
  enumOptionsInput: string;
  onConfigLabelChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onEnumOptionsInputChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  onValueChange: (value: string) => void;
  onValueTypeChange: (value: RuleValueType) => void;
  unit: string;
  unitOptions: string[];
  validationError: string | null;
  value: string;
  valueType: RuleValueType;
};

export default function AddRuleDialogFields(props: AddRuleDialogFieldsProps) {
  const {
    configLabel,
    configLabelOptions,
    description,
    enumOptions,
    enumOptionsInput,
    onConfigLabelChange,
    onDescriptionChange,
    onEnumOptionsInputChange,
    onNameChange,
    onUnitChange,
    onValueChange,
    onValueTypeChange,
    unit,
    unitOptions,
    validationError,
    value,
    valueType,
  } = props;

  return (
    <div className="flex w-full flex-col items-start gap-4 py-4">
      <label className="flex w-full flex-col gap-2">
        <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">Rule Name</span>
        <input className="h-9 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#51565B]" onChange={(event) => onNameChange(event.target.value)} placeholder="e.g., Probation Gate" type="text" />
      </label>
      <label className="flex w-full flex-col gap-2">
        <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">Description</span>
        <textarea className="min-h-16 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 py-[9px] text-[14px] leading-5 text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#51565B]" onChange={(event) => onDescriptionChange(event.target.value)} placeholder="Describe what this rule does..." value={description} />
      </label>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">Config Type</span>
          <div className="relative w-[140px]">
            <select className="h-9 w-full appearance-none rounded-[6px] border border-[#E2E5E8] bg-white px-3 pr-9 text-[14px] leading-5 font-normal text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onValueTypeChange(event.target.value as RuleValueType)} value={valueType}>
              <option value={RuleValueType.Number}>Number</option>
              <option value={RuleValueType.Boolean}>Boolean</option>
              <option value={RuleValueType.Enum}>Enum</option>
              <option value={RuleValueType.Date}>Date</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 text-[#51565B]" />
          </div>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">Config Label</span>
          <select className="h-9 rounded-[6px] border border-[#E2E5E8] bg-white px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onConfigLabelChange(event.target.value)} value={configLabel}>
            {configLabelOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">Default Value</span>
          {valueType === RuleValueType.Boolean ? (
            <select className="h-9 rounded-[6px] border border-[#E2E5E8] bg-white px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onValueChange(event.target.value)} value={value}><option value="true">True</option><option value="false">False</option></select>
          ) : valueType === RuleValueType.Enum ? (
            <select className="h-9 rounded-[6px] border border-[#E2E5E8] bg-white px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onValueChange(event.target.value)} value={value}>{enumOptions.length === 0 ? <option value="">No options</option> : enumOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>
          ) : (
            <input className="h-9 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#060B10]" onChange={(event) => onValueChange(event.target.value)} step="any" type="number" value={value} />
          )}
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">Unit</span>
          <select className="h-9 rounded-[6px] border border-[#E2E5E8] bg-white px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none disabled:cursor-not-allowed disabled:bg-[#F3F5F8] disabled:text-[#9CA3AF]" disabled={valueType === RuleValueType.Boolean || valueType === RuleValueType.Enum} onChange={(event) => onUnitChange(event.target.value)} value={unit}>{unitOptions.length === 0 ? <option value="">N/A</option> : unitOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>
        </label>
      </div>

      {valueType === RuleValueType.Enum && (
        <label className="flex w-full flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#060B10]">Options (comma separated)</span>
          <input className="h-9 rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#060B10] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#51565B]" onChange={(event) => onEnumOptionsInputChange(event.target.value)} placeholder="e.g., Level 1, Level 2, Level 3" type="text" value={enumOptionsInput} />
        </label>
      )}

      {validationError && <p className="text-sm text-red-600">{validationError}</p>}
    </div>
  );
}
