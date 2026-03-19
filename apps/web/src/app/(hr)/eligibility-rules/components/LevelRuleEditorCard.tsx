"use client";

type LevelRuleEditorCardProps = {
  helperText: string;
  onValueChange: (value: string) => void;
  previewText: string;
  value: string;
};

export default function LevelRuleEditorCard(props: LevelRuleEditorCardProps) {
  const { helperText, onValueChange, previewText, value } = props;
  const numericValue = Number(value);
  const maxLevel = Number.isFinite(numericValue) ? Math.max(5, numericValue) : 5;
  const levelOptions = Array.from({ length: maxLevel }, (_, index) => String(index + 1));

  return (
    <div className="flex flex-col gap-4 rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.2)] px-4 pt-[15px] pb-4">
      <label className="flex w-full flex-col gap-2">
        <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
          Minimum Responsibility Level
        </span>
        <div className="relative w-[96px]">
          <select
            className="h-9 w-full appearance-none rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 pr-8 text-[14px] leading-5 text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none"
            onChange={(event) => onValueChange(event.target.value)}
            value={value}
          >
            {levelOptions.map((option) => (
              <option key={option} value={option}>
                {`Level ${option}`}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#737373]">
            <ChevronDownIcon />
          </span>
        </div>
      </label>

      <p className="text-[12px] leading-4 text-[#737373]">{helperText}</p>

      <div className="flex min-h-[66px] w-full items-start gap-2 rounded-[8px] border border-[#E5E5E5] bg-white p-3">
        <span className="mt-px shrink-0 text-[#737373]">
          <InfoIcon />
        </span>
        <p className="max-w-[364px] text-[14px] leading-5 text-[#0A0A0A]">{previewText}</p>
      </div>
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

function InfoIcon() {
  return (
    <svg fill="none" height="18" viewBox="0 0 18 18" width="18" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8V12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <circle cx="9" cy="5.5" fill="currentColor" r="1" />
    </svg>
  );
}
