import AddRuleCard from "./AddRuleCard";
import EligibilityRulesSkeleton from "./EligibilityRulesSkeleton";
import RuleCard from "./RuleCard";
import { sectionMeta } from "../rule-sections";
import type { RuleCardModel, RuleSectionView } from "../types";

type RuleSectionsViewProps = {
  loading: boolean;
  onAddRule: (sectionTitle: string) => void;
  onEditRule: (rule: RuleCardModel) => void;
  onOpenRequest: (requestId: string) => void;
  searchTerm: string;
  sections: RuleSectionView[];
};

export default function RuleSectionsView({
  loading,
  onAddRule,
  onEditRule,
  onOpenRequest,
  searchTerm,
  sections,
}: RuleSectionsViewProps) {
  if (loading) return <EligibilityRulesSkeleton />;

  return (
    <section className="mx-auto mt-[43px] flex w-full max-w-[1300px] flex-col items-start gap-[34px] px-4 sm:px-0">
      {sections.length === 0 && searchTerm.trim() && (
        <div className="w-full rounded-[8px] border border-[#DBDEE1] bg-white p-6 text-sm text-[#6B7280]">
          No rules found for &quot;{searchTerm.trim()}&quot;.
        </div>
      )}
      {sections.map(({ cards, count, title }, index) => {
        const meta = sectionMeta.find((section) => section.title === title);
        const Icon = meta?.icon;
        return (
          <div key={title} className="flex w-full flex-col items-start gap-6">
            {index > 0 && <div className="h-px w-full bg-[rgba(219,222,225,0.87)]" />}
            <div className="flex w-full flex-col gap-2">
              <div className="flex h-6 w-full items-center gap-[10px]">
                <div className="flex h-6 items-center gap-2 p-0">
                  {Icon ? <Icon className="h-6 w-6 text-black" /> : null}
                  <h2 className="flex items-center text-[16px] leading-[21px] font-semibold text-[#060b10]">{title}</h2>
                </div>
                <span className="flex h-6 items-center justify-center rounded-[6px] border border-[#DBDEE1] px-[6px] text-center text-[10px] leading-[15px] font-normal text-[#51565B]">
                  {loading ? "..." : count}
                </span>
              </div>
              {meta ? (
                <p className="max-w-[760px] text-[14px] leading-5 text-[#64748B]">
                  {meta.description}
                </p>
              ) : null}
            </div>
            <div className="flex w-full flex-wrap items-center gap-5">
              {cards.map((card) => (
                <div key={card.id} className="w-full lg:w-[calc(50%-10px)] xl:w-[420px]">
                  <RuleCard {...card} onEdit={() => onEditRule(card)} onOpenRequest={onOpenRequest} />
                </div>
              ))}
              {!searchTerm.trim() && (
                <div className="w-full lg:w-[calc(50%-10px)] xl:w-[420px]">
                  <AddRuleCard onClick={() => onAddRule(title)} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
