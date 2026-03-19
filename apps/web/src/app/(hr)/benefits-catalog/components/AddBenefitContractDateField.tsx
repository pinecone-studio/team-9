import { CalendarDays } from "lucide-react";
import type { MutableRefObject } from "react";

import {
  formatNativeDate,
  normalizeContractDateInput,
} from "./add-benefit-contract-upload.utils";

type AddBenefitContractDateFieldProps = {
  disabled: boolean;
  label: string;
  onChange: (value: string) => void;
  pickerRef: MutableRefObject<HTMLInputElement | null>;
  value: string;
};

export default function AddBenefitContractDateField({
  disabled,
  label,
  onChange,
  pickerRef,
  value,
}: AddBenefitContractDateFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[14px] leading-4 font-medium text-black">{label}</span>
      <div className={`flex h-9 items-center rounded-[8px] border border-[#CBD5E1] bg-white px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${disabled ? "opacity-60" : ""}`}>
        <input
          className="w-full border-0 bg-transparent text-[14px] leading-5 text-[#0F172A] outline-none placeholder:text-[#94A3B8] disabled:cursor-not-allowed"
          disabled={disabled}
          onChange={(event) => onChange(normalizeContractDateInput(event.target.value))}
          placeholder="yyyy.mm.dd"
          type="text"
          value={value}
        />
        <button
          className="ml-2 text-black disabled:cursor-not-allowed disabled:text-[#94A3B8]"
          disabled={disabled}
          onClick={() => pickerRef.current?.showPicker?.()}
          type="button"
        >
          <CalendarDays className="h-[18px] w-[18px]" />
        </button>
        <input
          className="hidden"
          onChange={(event) => onChange(formatNativeDate(event.target.value))}
          ref={pickerRef}
          type="date"
        />
      </div>
    </label>
  );
}
