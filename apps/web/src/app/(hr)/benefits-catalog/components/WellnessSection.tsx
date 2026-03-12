"use client";

import { useState } from "react";

import AddBenefitCard from "./AddBenefitCard";
import AddBenefitDialog from "./AddBenefitDialog";
import BenefitCard from "./BenefitCard";
import EditBenefitDialog from "./EditBenefitDialog";
import { wellnessSection } from "../benefit-data";

export default function WellnessSection() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<(typeof wellnessSection.cards)[number] | null>(null);
  const { cards, count, icon: Icon, stats, title } = wellnessSection;

  return (
    <>
      <section className="mx-auto mt-[30px] flex w-full max-w-[1300px] flex-col items-start gap-6 px-4 sm:px-0">
        <div className="flex h-6 w-full items-center gap-[10px]">
          <div className="flex h-6 items-center gap-2">
            <Icon className="h-6 w-6 text-black" />
            <h2 className="text-[16px] leading-[21px] font-semibold text-[#060B10]">{title}</h2>
          </div>
          <span className="flex h-6 items-center justify-center rounded-[6px] border border-[#DBDEE1] px-[6px] text-[10px] leading-[15px] font-normal text-[#51565B]">
            {count}
          </span>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <BenefitCard key={card.title} {...card} onEdit={setSelectedBenefit} stats={stats} />
          ))}
          <AddBenefitCard onClick={() => setIsAddDialogOpen(true)} />
        </div>
      </section>

      {isAddDialogOpen && <AddBenefitDialog onClose={() => setIsAddDialogOpen(false)} />}
      {selectedBenefit && (
        <EditBenefitDialog
          benefitName={selectedBenefit.title}
          category={title}
          description={`${selectedBenefit.description}. Includes fitness classes and personal training sessions.`}
          onClose={() => setSelectedBenefit(null)}
        />
      )}
    </>
  );
}
