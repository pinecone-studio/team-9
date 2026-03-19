import { MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { BenefitDraft } from "./benefit-draft";
import AddBenefitCard from "./AddBenefitCard";
import BenefitCard from "./BenefitCard";
import DraftBenefitCard from "./DraftBenefitCard";
import type { BenefitCard as BenefitCardData, BenefitSection } from "../benefit-types";

type WellnessCategorySectionProps = {
  draftBenefit: BenefitDraft | null;
  formatCategoryLabel: (value: string) => string;
  onAddBenefit: (categoryId: string | null) => void;
  onCancelRequest: (requestId: string) => void;
  onContinueDraft: () => void;
  onDeleteCategory: (category: { benefitCount: number; categoryId: string; title: string }) => void;
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
  onCancelRequest,
  onContinueDraft,
  onDeleteCategory,
  onDeleteDraft,
  onEditBenefit,
  onOpenRequest,
  section,
  shouldShowDraftCard,
}: WellnessCategorySectionProps) {
  const { cards, categoryId, count, icon: SectionIcon, title } = section;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleOutsideClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMenuOpen]);

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
        <div className="relative" ref={menuRef}>
          <button
            className="flex h-6 w-6 items-center justify-center"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            type="button"
          >
            <MoreHorizontal className="h-6 w-6 text-black" />
          </button>
          {isMenuOpen ? (
            <div className="absolute top-8 right-0 z-10 min-w-[160px] rounded-[8px] border border-[#E5E5E5] bg-white p-1 shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
              <button
                className="flex w-full items-center rounded-[6px] px-3 py-2 text-left text-[14px] leading-5 text-[#B42318] hover:bg-[#FFF7F7]"
                onClick={() => {
                  setIsMenuOpen(false);
                  onDeleteCategory({
                    benefitCount: cards.length,
                    categoryId,
                    title,
                  });
                }}
                type="button"
              >
                Delete category
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <BenefitCard
            key={`${title}-${card.title}`}
            {...card}
            onCancelRequest={onCancelRequest}
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
