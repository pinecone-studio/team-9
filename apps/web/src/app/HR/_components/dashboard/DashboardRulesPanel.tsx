import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import {
  formatRuleDefaultValue,
  formatRuleValueType,
  type DashboardRuleDefinition,
} from "./dashboard-helpers";

type DashboardRulesPanelProps = {
  rules: DashboardRuleDefinition[];
};

function usageLabel(value: number): string {
  return `Used by ${value} benefit${value === 1 ? "" : "s"}`;
}

export default function DashboardRulesPanel({ rules }: DashboardRulesPanelProps) {
  const sortedRules = [...rules].sort(
    (a, b) => b.usage_count - a.usage_count || a.name.localeCompare(b.name),
  );

  return (
    <section className="box-border flex h-[490px] w-full flex-col overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-white py-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex w-full shrink-0 flex-col gap-4 px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-[16px] leading-4 font-semibold text-[#0A0A0A]">
            Eligibility Rules
          </h2>
          <p className="text-[14px] leading-5 text-[#737373]">
            Reusable rules that determine benefit eligibility.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
            href={{
              pathname: "/eligibility-rules",
              query: {
                dialog: "create-rule",
                section: "Gate Rules",
              },
            }}
          >
            <Plus className="h-4 w-4" />
            Create Rule
          </Link>
          <Link
            className="inline-flex h-8 items-center gap-1.5 rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
            href="/eligibility-rules"
          >
            <ArrowRight className="h-4 w-4" />
            See More
          </Link>
        </div>
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto px-6 pt-6">
        {sortedRules.map((rule) => (
          <article
            className="box-border flex h-[86px] w-full flex-col rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] p-3"
            key={rule.id}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{rule.name}</h3>
              <span className="inline-flex h-[22px] items-center rounded-[8px] border border-[#E5E5E5] px-2 text-[12px] leading-4 font-medium text-[#0A0A0A]">
                {formatRuleValueType(rule.value_type)}
              </span>
            </div>
            <p className="mt-2 text-[12px] leading-4 text-[#737373]">
              Default: {formatRuleDefaultValue(rule.default_value)}
            </p>
            <p className="mt-1 text-[12px] leading-4 text-[#737373]">
              {usageLabel(rule.usage_count)}
            </p>
          </article>
        ))}
        {sortedRules.length === 0 ? (
          <p className="rounded-[10px] border border-dashed border-[#E5E5E5] px-4 py-5 text-sm text-[#737373]">
            No eligibility rules found.
          </p>
        ) : null}
      </div>
    </section>
  );
}
