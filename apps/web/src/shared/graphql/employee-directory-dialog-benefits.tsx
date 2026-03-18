"use client";

import { Info, Lock, type LucideIcon } from "lucide-react";
import type { EmployeeDirectoryBenefit } from "@/shared/graphql/employee-directory-dialog-utils";
import {
  BENEFIT_STATUS_ORDER,
  formatStatusLabel,
  getBenefitMessage,
  getBenefitStatusClass,
  groupBenefitsByStatus,
} from "@/shared/graphql/employee-directory-dialog-utils";

type EmployeeDirectoryDialogBenefitsProps = {
  benefits: EmployeeDirectoryBenefit[];
  onBulkOverride: () => void;
  onOverrideBenefit: (benefitId: string) => void;
  overrideDisabled: boolean;
  overridingAll: boolean;
  overridingBenefitId: string | null;
};

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[#0A0A0A]">
      <Icon className="h-[18px] w-[18px]" />
      <h3 className="text-[16px] leading-5 font-medium">{title}</h3>
    </div>
  );
}

function BenefitCard({
  benefit,
  onOverrideBenefit,
  overrideDisabled,
  overriding,
  showOverride,
}: {
  benefit: EmployeeDirectoryBenefit;
  onOverrideBenefit: (benefitId: string) => void;
  overrideDisabled: boolean;
  overriding: boolean;
  showOverride: boolean;
}) {
  return (
    <article className="rounded-[8px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{benefit.benefit.title}</p>
            <span className={`rounded-[4px] px-2 py-1 text-[12px] leading-4 font-medium ${getBenefitStatusClass(benefit.status)}`}>{formatStatusLabel(benefit.status)}</span>
          </div>
          <div className="mt-2 flex items-start gap-2 text-[12px] leading-4 text-[#737373]">
            {showOverride ? (
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#C10007]" />
            ) : (
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#737373]" />
            )}
            <p className={showOverride ? "text-[#C10007]" : "text-[#737373]"}>
              {getBenefitMessage(benefit)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showOverride ? (
            <button
              className="rounded-[8px] border border-[#E5E5E5] bg-white px-3 py-1.5 text-[12px] leading-4 font-medium text-[#0A0A0A] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={overrideDisabled}
              onClick={() => onOverrideBenefit(benefit.benefit.id)}
              type="button"
            >
              {overriding ? "Overriding..." : "Override"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function EmployeeDirectoryDialogBenefits({
  benefits,
  onBulkOverride,
  onOverrideBenefit,
  overrideDisabled,
  overridingAll,
  overridingBenefitId,
}: EmployeeDirectoryDialogBenefitsProps) {
  const groupedBenefits = groupBenefitsByStatus(benefits);

  return (
    <section className="space-y-4 border-t border-[#E5E5E5] pt-6">
      <SectionTitle icon={Info} title="All Benefits" />
      {benefits.length === 0 ? (
        <div className="rounded-[8px] border border-dashed border-[#E5E5E5] px-4 py-6 text-center text-[14px] leading-5 text-[#737373]">
          No benefit eligibility records are available for this employee yet.
        </div>
      ) : (
        <div className="space-y-4">
          {BENEFIT_STATUS_ORDER.map((status) => {
            const items = groupedBenefits[status];

            if (items.length === 0) {
              return null;
            }

            return (
              <div className="space-y-3" key={status}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[12px] leading-4 font-medium tracking-[0.3px] text-[#737373] uppercase">
                    {formatStatusLabel(status)} ({items.length})
                  </p>
                  {status === "locked" ? (
                    <button
                      className="rounded-[8px] border border-[#E5E5E5] bg-white px-3 py-1.5 text-[12px] leading-4 font-medium text-[#0A0A0A] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={overrideDisabled}
                      onClick={onBulkOverride}
                      type="button"
                    >
                      {overridingAll ? "Overriding..." : "Override Eligibility"}
                    </button>
                  ) : null}
                </div>
                <div className="space-y-3">
                  {items.map((benefit) => (
                    <BenefitCard
                      benefit={benefit}
                      key={benefit.benefit.id}
                      onOverrideBenefit={onOverrideBenefit}
                      overrideDisabled={overrideDisabled}
                      overriding={overridingBenefitId === benefit.benefit.id}
                      showOverride={status === "locked"}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
