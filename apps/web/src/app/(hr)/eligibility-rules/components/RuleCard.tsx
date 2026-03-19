import { useState } from "react";

import { formatRelativeTimestamp } from "@/app/(hr)/requests/components/approval-request-time-formatters";
import type { RuleCardModel } from "../types";
import { getRuleConditionLabel } from "./rule-card-condition";

type RuleCardProps = RuleCardModel & {
  onEdit?: () => void;
  onOpenRequest?: (requestId: string) => void;
};

export default function RuleCard({
  description,
  linkedBenefits,
  metricLabel,
  metricSuffix,
  metricValue,
  name,
  onEdit,
  onOpenRequest,
  operator,
  pendingRequest,
  usageCount,
}: RuleCardProps) {
  const [showUsage, setShowUsage] = useState(false);
  const isPending = Boolean(pendingRequest);
  const footerStatusClassName = isPending ? "text-[#BB4D00]" : "text-[#007A55]";
  const footerDotClassName = isPending ? "bg-[#FE9A00]" : "bg-[#00BC7D]";
  const usagePopoverClassName = isPending
    ? "border-[#FDE68A] bg-[#FFFDF5]"
    : "border-[#DBDEE1] bg-white";
  const usageItemClassName = isPending
    ? "text-[#92400E] hover:bg-[#FFFBEB]"
    : "text-[#111827] hover:bg-[#F3F4F6]";
  const conditionLabel = getRuleConditionLabel(
    metricLabel,
    metricValue,
    metricSuffix,
    operator,
  );
  const relativeText = pendingRequest
    ? formatRelativeTimestamp(pendingRequest.createdAt)
    : "Current definition";

  function handleCardClick() {
    if (pendingRequest) {
      onOpenRequest?.(pendingRequest.id);
      return;
    }

    onEdit?.();
  }

  return (
    <article className="relative w-full overflow-visible rounded-[8px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] xl:max-w-[420px]">
      <div
        className="flex h-[250px] w-full min-w-0 cursor-pointer flex-col justify-between text-left"
        onClick={handleCardClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleCardClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="flex w-full flex-col gap-4 px-5 pt-5">
          <div className="flex min-h-[42px] w-full items-start">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h3 className="truncate text-[14px] leading-[18px] font-semibold text-[#080C0F]">
                {name}
              </h3>
              <p className="line-clamp-1 text-[12px] leading-5 font-normal text-[#5E6468]">
                {description}
              </p>
            </div>
          </div>

          <div className="flex h-[72px] w-full flex-col items-start rounded-[6px] border border-[rgba(222,226,228,0.6)] bg-[rgba(239,242,245,0.3)] px-4 py-3">
            <div className="flex flex-col gap-1 pt-[5px]">
              <span className="text-[11px] leading-4 font-medium tracking-[0.275px] text-[#5E6468] uppercase">
                Condition
              </span>
              <span className="text-[16px] leading-5 font-semibold text-[#080C0F]">
                {conditionLabel}
              </span>
            </div>
          </div>

          <div className="relative flex w-full items-center">
            <button
              className="flex h-[27px] items-center justify-center rounded-[6px] bg-[#EFF2F5] px-3 text-center text-[11px] leading-4 font-semibold text-[#1D2226]"
              onClick={(event) => {
                event.stopPropagation();
                setShowUsage((prev) => !prev);
              }}
              type="button"
            >
              {`Used in ${usageCount} benefit${usageCount === 1 ? "" : "s"}`}
            </button>

            {showUsage && (
              <div
                className={`absolute top-9 left-0 z-10 max-h-40 min-w-[220px] max-w-full overflow-auto rounded-[8px] border p-2 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] ${usagePopoverClassName}`}
              >
                {linkedBenefits.length === 0 ? (
                  <p
                    className={`text-xs ${
                      isPending ? "text-[#A16207]" : "text-[#6B7280]"
                    }`}
                  >
                    No linked benefits
                  </p>
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
        </div>

        <div className="flex h-[41px] w-full items-center justify-between border-t border-[rgba(222,226,228,0.5)] bg-[rgba(239,242,245,0.2)] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${footerDotClassName}`} />
            <span className={`text-[12px] leading-4 font-medium ${footerStatusClassName}`}>
              {isPending ? "Pending" : "Active"}
            </span>
          </div>
          <span className="text-[12px] leading-4 font-normal text-[#5E6468]">
            {relativeText}
          </span>
        </div>
      </div>
    </article>
  );
}
