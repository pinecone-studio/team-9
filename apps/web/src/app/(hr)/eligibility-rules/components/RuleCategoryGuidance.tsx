import type { RuleSectionMeta } from "../rule-sections";

type RuleCategoryGuidanceProps = {
  section: RuleSectionMeta;
};

export default function RuleCategoryGuidance({
  section,
}: RuleCategoryGuidanceProps) {
  return (
    <div className="w-full rounded-[10px] border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
      <div className="text-[12px] leading-4 font-semibold uppercase tracking-[0.04em] text-[#64748B]">
        When to use {section.title}
      </div>
      <p className="mt-1 text-[14px] leading-5 text-[#0F172A]">
        {section.whenToUse}
      </p>
      <p className="mt-2 text-[13px] leading-5 text-[#64748B]">
        Backend examples: {section.examples.join(" • ")}
      </p>
    </div>
  );
}
