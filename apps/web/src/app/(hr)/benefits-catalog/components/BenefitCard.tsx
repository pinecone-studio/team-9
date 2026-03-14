import { Pencil } from "lucide-react";

import type { BenefitCard as BenefitCardData, BenefitStat } from "../benefit-data";

type BenefitCardProps = BenefitCardData & {
  onEdit?: (benefit: BenefitCardData) => void;
  onToggle?: (benefitId: string, isActive: boolean) => void | Promise<void>;
  stats: readonly BenefitStat[];
};

export default function BenefitCard({
  badges,
  category,
  categoryId,
  description,
  enabled,
  id,
  icon: Icon,
  onEdit,
  onToggle,
  stats,
  subsidyPercent,
  title,
  vendorName,
}: BenefitCardProps) {
  return (
    <article className="flex h-[184px] w-full min-w-0 flex-col justify-between rounded-[8px] border border-[#DBDEE1] bg-white p-4 xl:max-w-[420px]">
      <div className="flex flex-col gap-3">
        <div className="flex h-6 items-center justify-between gap-[22px]">
          <div className="flex h-6 flex-1 items-center">
            <div className="flex items-center gap-1">
              <h3 className="text-[16px] leading-[18px] font-semibold text-[#060B10]">
                {title}
              </h3>
            </div>
            <button
              className="ml-2 flex h-6 items-center justify-center gap-1 rounded-[2px] px-[13px] pr-[13px] pl-2 text-[#5D5D5D]"
              onClick={() =>
                onEdit?.({
                  badges,
                  category,
                  categoryId,
                  description,
                  enabled,
                  icon: Icon,
                  id,
                  subsidyPercent,
                  title,
                  vendorName,
                })
              }
              type="button"
            >
              <Pencil className="h-4 w-4" />
              <span className="text-[14px] leading-[18px] font-medium">edit</span>
            </button>
          </div>
          <button
            aria-pressed={enabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-[50px] ${
              enabled ? "bg-[#060B10]" : "bg-slate-200"
            }`}
            onClick={() => onToggle?.(id, !enabled)}
            type="button"
          >
            <span
              className={`h-5 w-5 rounded-full bg-white transition-transform ${
                enabled ? "translate-x-[22px]" : "translate-x-[2px]"
              }`}
            />
          </button>
        </div>

        <div className="flex flex-wrap items-start gap-2">
          {badges.map(({ label, weight = "medium" }) => (
            <span
              key={label}
              className="inline-flex h-6 items-center justify-center gap-1 rounded-[6px] bg-[#EFF2F5] px-[6px]"
            >
              <span
                className={`text-[10px] leading-[15px] text-[#1C2229] ${
                  weight === "semibold" ? "font-semibold" : "font-medium"
                }`}
              >
                {label}
              </span>
            </span>
          ))}
        </div>

        <p className="max-w-[360px] text-[14px] leading-[18px] font-normal text-[#51565B]">
          {description}
        </p>
      </div>

      <div className="flex h-[30px] items-end border-t border-[#EDEFF0] pt-[14px]">
        <div className="flex items-center gap-5">
          {stats.map(({ label }) => (
            <span key={label} className="flex items-center gap-1">
              <span className="text-[12px] leading-4 font-medium text-[#51565B]">
                {label}
              </span>
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
