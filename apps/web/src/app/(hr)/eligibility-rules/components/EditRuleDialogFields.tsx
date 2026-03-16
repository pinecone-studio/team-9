import { ChevronDown } from "lucide-react";
import { RuleValueType } from "@/shared/apollo/generated";

type EditRuleDialogFieldsProps = {
  description: string;
  enumOptions: string[];
  enumOptionsInput: string;
  measurement: string;
  name: string;
  onDescriptionChange: (value: string) => void;
  onEnumOptionsInputChange: (value: string) => void;
  onMeasurementChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onValueChange: (value: string) => void;
  ruleMetricLabel?: string;
  ruleTypeLabel: string;
  unitOptions: string[];
  validationError: string | null;
  value: string;
  valueType: RuleValueType;
};

export default function EditRuleDialogFields(props: EditRuleDialogFieldsProps) {
  const {
    description,
    enumOptions,
    enumOptionsInput,
    measurement,
    name,
    onDescriptionChange,
    onEnumOptionsInputChange,
    onMeasurementChange,
    onNameChange,
    onValueChange,
    ruleMetricLabel,
    ruleTypeLabel,
    unitOptions,
    validationError,
    value,
    valueType,
  } = props;

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Rule Type</span>
          <button className="flex h-9 w-[106px] items-center justify-between rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]" type="button">
            <span className="text-[14px] leading-5 font-normal text-[#0A0A0A]">{ruleTypeLabel}</span>
            <ChevronDown className="h-5 w-5 text-[#737373]" />
          </button>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">What should HR check?</span>
          <input className="h-9 rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]" defaultValue={ruleMetricLabel} placeholder="e.g., Max arrivals" readOnly type="text" />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Default Requirement</span>
          {valueType === RuleValueType.Boolean ? (
            <select className="h-9 rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-[18px] text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onValueChange(event.target.value)} value={value.toLowerCase() === "true" ? "true" : "false"}><option value="true">True</option><option value="false">False</option></select>
          ) : valueType === RuleValueType.Enum ? (
            <select className="h-9 rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-[18px] text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onValueChange(event.target.value)} value={enumOptions.includes(value) ? value : ""}>{enumOptions.length === 0 ? <option value="">No options</option> : enumOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>
          ) : (
            <input className="h-9 rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none" onChange={(event) => onValueChange(event.target.value)} step="any" type="number" value={value} />
          )}
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Measurement (optional)</span>
          <select className="h-9 rounded-[8px] border border-[#CBD5E1] bg-white px-3 text-[14px] leading-[18px] text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none disabled:cursor-not-allowed disabled:bg-[#F3F5F8] disabled:text-[#9CA3AF]" disabled={valueType === RuleValueType.Boolean || valueType === RuleValueType.Enum} onChange={(event) => onMeasurementChange(event.target.value)} value={unitOptions.includes(measurement) || measurement === "" ? measurement : ""}>
            {unitOptions.length === 0 ? <option value="">N/A</option> : <><option value="">Select unit</option>{unitOptions.map((option) => <option key={option} value={option}>{option}</option>)}</>}
          </select>
        </label>
      </div>

      {valueType === RuleValueType.Enum && (
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Options (comma separated)</span>
          <input className="h-9 rounded-[8px] border border-[#CBD5E1] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]" onChange={(event) => onEnumOptionsInputChange(event.target.value)} placeholder="e.g., Level 1, Level 2, Level 3" type="text" value={enumOptionsInput} />
        </label>
      )}
      {validationError && <p className="text-sm text-red-600">{validationError}</p>}
    </div>
  );
}
