import { MoreHorizontal } from "lucide-react";

import type { BenefitDraft } from "./benefit-draft";
import AddBenefitCard from "./AddBenefitCard";
import BenefitCard from "./BenefitCard";
import DraftBenefitCard from "./DraftBenefitCard";
import type { BenefitCard as BenefitCardData, BenefitSection } from "../benefit-types";

type WellnessCategorySectionProps = {
  draftBenefit: BenefitDraft | null;
  formatCategoryLabel: (value: string) => string;
  onAddBenefit: (categoryId: string | null) => void;
  onContinueDraft: () => void;
  onDeleteDraft: () => void;
  onEditBenefit: (benefit: BenefitCardData) => void;
  onOpenRequest: (requestId: string) => void;
  section: BenefitSection;
  shouldShowDraftCard: boolean;
};

export default function WellnessCategorySection({
  draftBenefit,
  formatCategoryLabel,
  onAddBenefit,
  onContinueDraft,
  onDeleteDraft,
  onEditBenefit,
  onOpenRequest,
  section,
  shouldShowDraftCard,
}: WellnessCategorySectionProps) {
  const { cards, categoryId, count, icon: SectionIcon, title } = section;

  return (
    <section className="flex w-full flex-col items-start gap-6">
      <div className="flex h-6 w-full items-center justify-between gap-[10px]">
        <div className="flex h-6 items-center gap-[10px]">
          <div className="flex h-6 items-center gap-2">
            <SectionIcon className="h-6 w-6 text-black" />
            <h2 className="text-[16px] leading-[21px] font-semibold text-[#060B10]">
              {formatCategoryLabel(title)}
            </h2>
          </div>
          <span className="flex h-6 items-center justify-center rounded-[6px] border border-[#DBDEE1] px-[6px] text-[10px] leading-[15px] font-normal text-[#51565B]">
            {count}
          </span>
        </div>
        <button className="flex h-6 w-6 items-center justify-center" type="button">
          <MoreHorizontal className="h-6 w-6 text-black" />
        </button>
      </div>

      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <BenefitCard
            key={`${title}-${card.title}`}
            {...card}
            onEdit={onEditBenefit}
            onOpenRequest={onOpenRequest}
          />
        ))}
        {shouldShowDraftCard && draftBenefit && draftBenefit.categoryId === categoryId ? (
          <DraftBenefitCard
            description={draftBenefit.description.trim() || "No description yet."}
            onContinueEditing={onContinueDraft}
            onDeleteDraft={onDeleteDraft}
            title={draftBenefit.name.trim() || "Untitled Benefit"}
          />
        ) : null}
        <AddBenefitCard onClick={() => onAddBenefit(categoryId)} />
      </div>
    </section>
  );
}
