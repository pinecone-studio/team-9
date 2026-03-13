"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useState } from "react";

import AddBenefitCard from "./AddBenefitCard";
import AddBenefitDialog from "./AddBenefitDialog";
import BenefitCard from "./BenefitCard";
import EditBenefitDialog from "./EditBenefitDialog";
import {
  buildBenefitSections,
  type BenefitCard as BenefitCardData,
} from "../benefit-data";

const BENEFIT_CATALOG_QUERY = gql`
  query BenefitCatalogPage {
    allBenefits {
      id
      title
      description
      category
    }
  }
`;

type BenefitCatalogQuery = {
  allBenefits?: Array<{
    category: string;
    description: string;
    id: string;
    title: string;
  } | null> | null;
};

export default function WellnessSection() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<{
    benefit: BenefitCardData;
    category: string;
  } | null>(null);
  const { data, error, loading } = useQuery<BenefitCatalogQuery>(
    BENEFIT_CATALOG_QUERY,
  );

  const benefitSections = buildBenefitSections(
    (data?.allBenefits ?? []).flatMap((benefit) =>
      benefit
        ? [
            {
              id: benefit.id,
              title: benefit.title,
              description: benefit.description,
              category: benefit.category,
            },
          ]
        : [],
    ),
  );

  return (
    <>
      {loading ? (
        <section className="mx-auto mt-[30px] w-full max-w-[1300px] px-4 sm:px-0">
          <div className="rounded-[8px] border border-[#DBDEE1] bg-white p-6 text-[14px] text-[#51565B]">
            Loading benefits catalog...
          </div>
        </section>
      ) : null}

      {!loading && error ? (
        <section className="mx-auto mt-[30px] w-full max-w-[1300px] px-4 sm:px-0">
          <div className="rounded-[8px] border border-[#F3C7C7] bg-[#FFF7F7] p-6 text-[14px] text-[#B42318]">
            Benefits data could not be loaded.
          </div>
        </section>
      ) : null}

      {!loading && !error && benefitSections.length === 0 ? (
        <section className="mx-auto mt-[30px] w-full max-w-[1300px] px-4 sm:px-0">
          <div className="rounded-[8px] border border-dashed border-[#DBDEE1] bg-white p-6 text-[14px] text-[#51565B]">
            No active benefits found in the catalog.
          </div>
        </section>
      ) : null}

      {!loading &&
        !error &&
        benefitSections.map(({ cards, count, icon: Icon, stats, title }) => (
          <section
            className="mx-auto mt-[30px] flex w-full max-w-[1300px] flex-col items-start gap-6 px-4 sm:px-0"
            key={title}
          >
            <div className="flex h-6 w-full items-center gap-[10px]">
              <div className="flex h-6 items-center gap-2">
                <Icon className="h-6 w-6 text-black" />
                <h2 className="text-[16px] leading-[21px] font-semibold text-[#060B10]">
                  {title}
                </h2>
              </div>
              <span className="flex h-6 items-center justify-center rounded-[6px] border border-[#DBDEE1] px-[6px] text-[10px] leading-[15px] font-normal text-[#51565B]">
                {count}
              </span>
            </div>

            <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {cards.map((card) => (
                <BenefitCard
                  key={`${title}-${card.title}`}
                  {...card}
                  onEdit={(benefit) => setSelectedBenefit({ benefit, category: title })}
                  stats={stats}
                />
              ))}
              <AddBenefitCard onClick={() => setIsAddDialogOpen(true)} />
            </div>
          </section>
        ))}

      {isAddDialogOpen && <AddBenefitDialog onClose={() => setIsAddDialogOpen(false)} />}
      {selectedBenefit && (
        <EditBenefitDialog
          benefitName={selectedBenefit.benefit.title}
          category={selectedBenefit.category}
          description={selectedBenefit.benefit.description}
          onClose={() => setSelectedBenefit(null)}
        />
      )}
    </>
  );
}
