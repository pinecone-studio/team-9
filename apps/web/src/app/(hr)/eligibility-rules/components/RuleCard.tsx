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
  const isEditDisabled = Boolean(pendingRequest);
  const usageButtonClassName = pendingRequest
    ? "border-[#F3E8A3] bg-[#FFF8DB] text-[#A16207]"
    : "border-[#DBDEE1] bg-[#F5F6F8] text-[#374151]";
  const usagePopoverClassName = pendingRequest
    ? "border-[#FDE68A] bg-[#FFFDF5]"
    : "border-[#DBDEE1] bg-white";
  const usageItemClassName = pendingRequest
    ? "text-[#92400E] hover:bg-[#FFFBEB]"
    : "text-[#111827] hover:bg-[#F3F4F6]";
  const metricRowClassName = pendingRequest
    ? "border-[#F3E8A3]"
    : "border-[#EDEFF0]";
  const metricLabelClassName = pendingRequest
    ? "text-[#A16207]"
    : "text-[#51565B]";
  const metricSelectClassName = pendingRequest
    ? "border-[#F3E8A3] bg-[#FFFBEB] text-[#92400E]"
    : "border-[#D9D9D9] bg-white text-[#262626]";
  const metricValueClassName = pendingRequest
    ? "border-[#F3E8A3] bg-[#FFFBEB] text-[#92400E]"
    : "border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] text-[#060B10]";
  const metricSuffixClassName = pendingRequest
    ? "text-[#A16207]"
    : "text-[#51565B]";

  return (
    <article className={`flex h-[196px] w-full min-w-0 flex-col gap-1.5 overflow-hidden rounded-[8px] border bg-white p-4 xl:max-w-[420px] ${
      pendingRequest ? "border-[#FACC15] bg-[#FFFDF5]" : "border-[#DBDEE1]"
    }`}>
      <div className="flex w-full flex-col gap-1.5">
        <div className="flex min-h-6 w-full items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-start">
            <h3 className="truncate text-[16px] leading-[21px] font-semibold text-[#060B10]">
              {name}
            </h3>
          </div>
          <button
            className={`shrink-0 flex h-6 items-center justify-center gap-1 rounded-[4px] border px-3 pl-2 ${
              isEditDisabled
                ? "cursor-not-allowed border-[#F3E8A3] bg-[#FFF8DB] text-[#A16207]"
                : "border-[#E5E5E5] bg-white text-[#5D5D5D]"
            }`}
            disabled={isEditDisabled}
            onClick={() => {
              if (isEditDisabled) {
                return;
              }
              onEdit?.();
            }}
            type="button"
            title={isEditDisabled ? "Pending requesttei rule-g approval hiitelt dahin uurchluh bolomjgui." : undefined}
          >
            <Pencil className="h-4 w-4" />
            <span className={`text-[14px] leading-[18px] font-medium ${
              isEditDisabled ? "text-[#A16207]" : "text-black"
            }`}>edit</span>
          </button>
        </div>
        {pendingRequest ? (
          <button
            className="inline-flex w-fit max-w-full items-center gap-1.5 rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-2.5 py-0.5 text-left text-[11px] leading-4 font-medium text-[#92400E]"
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
      <p className="max-w-full text-[13px] leading-[17px] font-normal text-[#51565B]">
        {description}
      </p>
      <div className="relative">
        <button
          className={`flex h-5 max-w-full items-center justify-center rounded-[6px] border px-2 text-[11px] leading-[13px] font-medium ${usageButtonClassName}`}
          onClick={() => setShowUsage((prev) => !prev)}
          type="button"
        >
          {usageCount === 0
            ? "Not linked"
            : `Used in ${usageCount} benefit${usageCount > 1 ? "s" : ""}`}
        </button>

        {showUsage && (
          <div className={`absolute top-8 left-0 z-10 max-h-40 min-w-[220px] max-w-full overflow-auto rounded-[8px] border p-2 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] ${usagePopoverClassName}`}>
            {linkedBenefits.length === 0 ? (
              <p className={`text-xs ${pendingRequest ? "text-[#A16207]" : "text-[#6B7280]"}`}>No linked benefits</p>
            ) : (
              linkedBenefits.map((benefit) => (
                <p
                  key={benefit.id}
                  className={`rounded px-2 py-1 text-xs ${usageItemClassName}`}
                >
                  {benefit.name}
                </p>
              ))
            )}
          </div>
        )}
      </div>
      {metricLabel && metricValue && (
        <div className={`mt-auto flex w-full items-center justify-between gap-3 border-t pt-3 ${metricRowClassName}`}>
          <span className={`min-w-0 text-[12px] leading-4 font-normal ${metricLabelClassName}`}>
            {metricLabel}
          </span>
          {metricVariant === "select" ? (
            <div className={`shrink-0 flex h-6 min-w-[90px] items-center rounded-[4px] border px-3 text-[12px] leading-[22px] font-medium ${metricSelectClassName}`}>
              <span>{metricValue}</span>
            </div>
          ) : (
            <div className="shrink-0 flex items-center gap-[6px]">
              <span className={`flex h-6 min-w-[52px] items-center justify-center rounded-[6px] border px-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-[13px] leading-4 font-normal ${metricValueClassName}`}>
                {metricValue}
              </span>
              {metricSuffix && (
                <span className={`text-[12px] leading-4 font-normal ${metricSuffixClassName}`}>
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
