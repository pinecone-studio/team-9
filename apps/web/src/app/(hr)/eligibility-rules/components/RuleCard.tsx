import { useState } from "react";
import { Pencil } from "lucide-react";

import type { RuleCardModel } from "../types";
import { formatRelativeTimestamp } from "@/app/(hr)/requests/components/approval-request-time-formatters";

type RuleCardProps = RuleCardModel & {
  onEdit?: () => void;
  onOpenRequest?: (requestId: string) => void;
};

export default function RuleCard({
  description,
  linkedBenefits,
  metricLabel,
  metricSuffix,
  metricVariant,
  metricValue,
  name,
  onEdit,
  onOpenRequest,
  pendingRequest,
  usageCount,
}: RuleCardProps) {
  const [showUsage, setShowUsage] = useState(false);

  return (
    <article className={`flex h-[196px] w-full min-w-0 flex-col items-start justify-center gap-[14px] rounded-[8px] border bg-white p-4 xl:max-w-[420px] ${
      pendingRequest ? "border-[#FACC15] bg-[#FFFDF5]" : "border-[#DBDEE1]"
    }`}>
      <div className="flex w-full flex-col gap-2">
        <div className="flex h-6 w-full items-center justify-between">
          <div className="flex h-6 min-w-0 flex-1 items-center">
            <h3 className="truncate text-[16px] leading-[21px] font-semibold text-[#060B10]">
              {name}
            </h3>
            <button
              className="ml-2 flex h-6 shrink-0 items-center justify-center gap-1 rounded-[2px] px-[13px] pr-[13px] pl-2 text-[#5D5D5D]"
              onClick={onEdit}
              type="button"
            >
              <Pencil className="h-4 w-4" />
              <span className="text-[14px] leading-[18px] font-medium">edit</span>
            </button>
          </div>
        </div>
        {pendingRequest ? (
          <button
            className="inline-flex items-center gap-2 rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-3 py-1 text-left text-[12px] leading-4 font-medium text-[#92400E]"
            onClick={() => onOpenRequest?.(pendingRequest.id)}
            type="button"
          >
            <span>Pending {pendingRequest.actionType} approval</span>
            <span className="text-[#A16207]">
              {formatRelativeTimestamp(pendingRequest.createdAt)}
            </span>
          </button>
        ) : null}
      </div>
      <p className="max-w-[360px] text-[14px] leading-[18px] font-normal text-[#51565B]">
        {description}
      </p>
      <div className="relative">
        <button
          className="flex h-6 items-center justify-center rounded-[6px] border border-[#DBDEE1] bg-[#F5F6F8] px-[8px] text-[11px] leading-[13px] font-medium text-[#374151]"
          onClick={() => setShowUsage((prev) => !prev)}
          type="button"
        >
          {usageCount === 0
            ? "Not linked"
            : `Used in ${usageCount} benefit${usageCount > 1 ? "s" : ""}`}
        </button>

        {showUsage && (
          <div className="absolute top-8 left-0 z-10 max-h-40 min-w-[220px] overflow-auto rounded-[8px] border border-[#DBDEE1] bg-white p-2 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
            {linkedBenefits.length === 0 ? (
              <p className="text-xs text-[#6B7280]">No linked benefits</p>
            ) : (
              linkedBenefits.map((benefit) => (
                <p
                  key={benefit.id}
                  className="rounded px-2 py-1 text-xs text-[#111827] hover:bg-[#F3F4F6]"
                >
                  {benefit.name}
                </p>
              ))
            )}
          </div>
        )}
      </div>
      {metricLabel && metricValue && (
        <div className="mt-auto flex h-[42px] w-full items-center justify-between border-t border-[#EDEFF0] pt-[14px]">
          <span className="text-[12px] leading-4 font-normal text-[#51565B]">
            {metricLabel}
          </span>
          {metricVariant === "select" ? (
            <div className="flex h-7 min-w-[90px] items-center rounded-[4px] border border-[#D9D9D9] bg-white px-3 text-[12px] leading-[22px] font-medium text-[#262626]">
              <span>{metricValue}</span>
            </div>
          ) : (
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
          )}
        </div>
      )}
    </article>
  );
}
