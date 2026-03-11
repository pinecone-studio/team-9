import { Pencil } from "lucide-react";

import type { RuleCard as RuleCardData } from "../rule-sections";

export default function RuleCard({
  description,
  enabled,
  metricLabel,
  metricSuffix,
  metricValue,
  title,
}: RuleCardData) {
  return (
    <article className="flex h-[196px] w-full min-w-0 flex-col items-start gap-3 rounded-[8px] border border-[#DBDEE1] bg-white p-4 xl:max-w-[420px]">
      <div className="flex h-6 w-full items-center justify-between p-0">
        <div className="flex h-6 flex-1 items-center p-0">
          <h3 className="max-w-[293px] text-[16px] leading-[18px] font-semibold text-[#060B10]">
            {title}
          </h3>
          <button
            className="ml-2 flex h-6 items-center justify-center gap-1 rounded-[2px] px-[13px] pr-[13px] pl-2 text-[#5D5D5D]"
            type="button"
          >
            <Pencil className="h-4 w-4" />
            <span className="text-[14px] leading-[18px] font-medium">edit</span>
          </button>
        </div>
        <span
          className={`relative inline-flex h-6 w-11 items-center rounded-[50px] ${
            enabled ? "bg-[#060B10]" : "bg-slate-200"
          }`}
        >
          <span
            className={`h-5 w-5 rounded-full bg-white transition-transform ${
              enabled ? "translate-x-[22px]" : "translate-x-[2px]"
            }`}
          />
        </span>
      </div>
      <p className="max-w-[360px] text-[14px] leading-[18px] font-normal text-[#51565B]">
        {description}
      </p>
      <div className="flex h-6 w-full items-start gap-[5px] p-0">
        <span className="flex h-6 items-center justify-center rounded-[6px] bg-[#EFF2F5] px-[6px] text-center text-[10px] leading-[15px] font-normal text-[#1C2229]">
          Gym Membership
        </span>
      </div>

      {metricLabel && metricValue && (
        <div className="mt-auto flex h-[42px] w-full items-center justify-between border-t border-[#EDEFF0] pt-[14px] pr-0 pb-0 pl-0">
          <span className="text-[12px] leading-4 font-normal text-[#51565B]">
            {metricLabel}
          </span>
          <div className="flex items-center gap-[6px]">
            <span className="flex h-7 min-w-[56px] items-center justify-center rounded-[6px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-[14px] leading-[18px] font-normal text-[#060B10]">
              {metricValue}
            </span>
            {metricSuffix && (
              <span className="text-[12px] leading-4 font-normal text-[#51565B]">
                {metricSuffix}
              </span>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
