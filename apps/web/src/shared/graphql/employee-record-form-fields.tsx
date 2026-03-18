"use client";

import { CalendarDays, ChevronDown } from "lucide-react";
import type { MutableRefObject, ReactNode } from "react";

const labelClassName = "text-[14px] leading-[14px] font-medium text-[#0A0A0A]";
const fieldClassName =
  "h-9 w-full rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[14px] leading-5 text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none";

export function EmployeeFieldGroup({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className={labelClassName}>{label}</span>
      {children}
    </label>
  );
}

export function EmployeeTextField({
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "email" | "number" | "text";
  value: string;
}) {
  return (
    <EmployeeFieldGroup label={label}>
      <input
        className={fieldClassName}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </EmployeeFieldGroup>
  );
}

export function EmployeeSelectField({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  value: string;
}) {
  return (
    <EmployeeFieldGroup label={label}>
      <div className="relative">
        <select
          className={`${fieldClassName} appearance-none pr-9`}
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          <option value="">Select</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#737373]" />
      </div>
    </EmployeeFieldGroup>
  );
}

export function EmployeeDateField({
  label,
  onChange,
  onPickerChange,
  pickerRef,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  onPickerChange: (value: string) => void;
  pickerRef: MutableRefObject<HTMLInputElement | null>;
  value: string;
}) {
  return (
    <EmployeeFieldGroup label={label}>
      <div className="flex h-9 items-center rounded-[8px] border border-[#E5E5E5] bg-white px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <input
          className="w-full border-0 bg-transparent text-[14px] leading-5 text-[#0A0A0A] outline-none"
          onChange={(event) => onChange(event.target.value)}
          placeholder="yyyy.mm.dd"
          type="text"
          value={value}
        />
        <button
          className="ml-2 text-[#0A0A0A]"
          onClick={() => pickerRef.current?.showPicker?.()}
          type="button"
        >
          <CalendarDays className="h-[18px] w-[18px]" />
        </button>
        <input
          className="hidden"
          onChange={(event) => onPickerChange(event.target.value)}
          ref={pickerRef}
          type="date"
        />
      </div>
    </EmployeeFieldGroup>
  );
}

export function EmployeeSwitchField({
  checked,
  description,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[8px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] px-3 py-3">
      <div className="space-y-[2px]">
        <p className="text-[14px] leading-5 text-[#0A0A0A]">{label}</p>
        <p className="text-[12px] leading-4 text-[#737373]">{description}</p>
      </div>
      <button
        aria-pressed={checked}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-[#060B10]" : "bg-[#D4D4D8]"
        }`}
        onClick={() => onChange(!checked)}
        type="button"
      >
        <span
          className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white transition-transform ${
            checked ? "right-[2px]" : "left-[2px]"
          }`}
        />
      </button>
    </div>
  );
}
