"use client";

import { useEffect, useRef, useState } from "react";
import type { RuleType } from "@/shared/apollo/generated";

type GateRuleEditorCardProps = {
  onSourceFieldChange: (value: RuleType) => void;
  onValueChange: (value: string) => void;
  previewText: string;
  requiredValueOptions: Array<{ label: string; value: string }>;
  selectedRuleType: RuleType;
  sourceFieldOptions: Array<{ label: string; value: RuleType }>;
  value: string;
};

export default function GateRuleEditorCard(props: GateRuleEditorCardProps) {
  const {
    onSourceFieldChange,
    onValueChange,
    previewText,
    requiredValueOptions,
    selectedRuleType,
    sourceFieldOptions,
    value,
  } = props;

  return (
    <div className="flex flex-col gap-4 rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.2)] px-4 pt-[15px] pb-4">
      <GatePicker
        label="Source Field"
        onChange={(nextValue) => onSourceFieldChange(nextValue as RuleType)}
        options={sourceFieldOptions}
        panelWidthClassName="w-[244px]"
        value={selectedRuleType}
        widthClassName="w-[196px]"
      />
      <GatePicker
        label="Required Value"
        onChange={onValueChange}
        options={requiredValueOptions}
        panelWidthClassName="w-[176px]"
        value={value}
        widthClassName="w-[140px]"
      />
      <div className="flex min-h-[66px] w-full items-start gap-2 rounded-[8px] border border-[#E5E5E5] bg-white p-3">
        <span className="mt-px shrink-0 text-[#737373]">
          <InfoIcon />
        </span>
        <p className="max-w-[362px] text-[14px] leading-5 text-[#0A0A0A]">
          {previewText}
        </p>
      </div>
    </div>
  );
}

function GatePicker(props: {
  label: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  panelWidthClassName: string;
  value: string;
  widthClassName: string;
}) {
  const { label, onChange, options, panelWidthClassName, value, widthClassName } = props;
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0] ?? null;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open]);

  return (
    <div className="relative flex w-full flex-col gap-2" ref={containerRef}>
      <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{label}</span>
      <button
        className={`flex h-9 items-center justify-between rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 text-left text-[14px] leading-5 font-normal text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${widthClassName}`}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span className="truncate whitespace-nowrap">{selectedOption?.label ?? ""}</span>
        <span className={`shrink-0 text-[#B0B0B0] transition-transform ${open ? "rotate-180" : ""}`}>
          <ChevronDownIcon />
        </span>
      </button>
      {open ? (
        <div className={`absolute top-[calc(100%+10px)] left-0 z-30 rounded-[16px] border border-[#E5E5E5] bg-white p-2 shadow-[0_10px_25px_rgba(15,23,42,0.12)] ${panelWidthClassName}`}>
          <div className="flex flex-col gap-0.5">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  className={`flex min-h-[36px] items-center justify-between rounded-[10px] px-3 py-1.5 text-left text-[14px] leading-5 ${isSelected ? "bg-[#F5F5F5] text-[#171717]" : "bg-white text-[#171717]"}`}
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  type="button"
                >
                  <span className="truncate whitespace-nowrap">{option.label}</span>
                  <span className={isSelected ? "shrink-0 text-[#737373]" : "invisible shrink-0 text-transparent"}>
                    <CheckIcon />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 10.5L8 14L15.5 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg fill="none" height="18" viewBox="0 0 18 18" width="18" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8V12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <circle cx="9" cy="5.5" fill="currentColor" r="1" />
    </svg>
  );
}
