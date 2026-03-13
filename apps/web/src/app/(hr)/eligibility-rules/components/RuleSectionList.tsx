"use client";

import { useState } from "react";

import AddRuleCard from "./AddRuleCard";
import AddRuleDialog from "./AddRuleDialog";
import RuleCard from "./RuleCard";
import { sections } from "../rule-sections";

export default function RuleSectionList() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <>
      <section className="mx-auto mt-[43px] flex w-full max-w-[1300px] flex-col items-start gap-[34px] px-4 sm:px-0">
        {sections.map(({ cards, count, icon: Icon, title }) => (
          <div key={title} className="flex w-full flex-col items-start gap-6 p-0">
            <div className="flex h-6 w-full items-center gap-[10px] p-0">
              <div className="flex h-6 items-center gap-2 p-0">
                <Icon className="h-6 w-6 text-black" />
                <h2 className="flex items-center text-[16px] leading-[21px] font-semibold text-[#060b10]">
                  {title}
                </h2>
              </div>
              <span className="flex h-6 items-center justify-center rounded-[6px] border border-[#DBDEE1] px-[6px] text-center text-[10px] leading-[15px] font-normal text-[#51565B]">
                {count}
              </span>
            </div>

            <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {cards.map((card) => (
                <RuleCard key={card.title} {...card} />
              ))}
              <AddRuleCard onClick={() => setActiveSection(title)} />
            </div>
          </div>
        ))}
      </section>

      {activeSection && (
        <AddRuleDialog
          onClose={() => setActiveSection(null)}
          sectionTitle={activeSection}
        />
      )}
    </>
  );
}
