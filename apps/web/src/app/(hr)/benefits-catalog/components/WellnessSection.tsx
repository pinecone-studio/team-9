"use client";
/* eslint-disable max-lines */

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import AddBenefitCard from "./AddBenefitCard";
import AddBenefitDialog, { type BenefitDraft } from "./AddBenefitDialog";
import BenefitCard from "./BenefitCard";
import DraftBenefitCard from "./DraftBenefitCard";
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
      categoryId
      isActive
      subsidyPercent
      vendorName
    }
  }
`;

const SET_BENEFIT_STATUS_MUTATION = gql`
  mutation SetBenefitStatus($input: SetBenefitStatusInput!) {
    setBenefitStatus(input: $input) {
      id
      isActive
    }
  }
`;

type BenefitCatalogRecord = {
  category: string;
  categoryId: string;
  description: string;
  id: string;
  isActive: boolean;
  subsidyPercent?: number | null;
  title: string;
  vendorName?: string | null;
};

type BenefitCatalogQuery = {
  allBenefits?: Array<BenefitCatalogRecord | null> | null;
};

type SetBenefitStatusMutation = {
  setBenefitStatus: {
    id: string;
    isActive: boolean;
  };
};

type SetBenefitStatusVariables = {
  input: {
    id: string;
    isActive: boolean;
  };
};

type WellnessSectionProps = {
  searchQuery?: string;
};

export default function WellnessSection({
  searchQuery = "",
}: WellnessSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [draftBenefit, setDraftBenefit] = useState<BenefitDraft | null>(null);
  const [dialogCategoryId, setDialogCategoryId] = useState<string | null>(null);
  const [dialogDraft, setDialogDraft] = useState<BenefitDraft | null>(null);
  const [benefitOverrides, setBenefitOverrides] = useState<
    Record<string, Partial<BenefitCatalogRecord>>
  >({});
  const [deletedBenefitIds, setDeletedBenefitIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitCardData | null>(
    null,
  );
  const [setBenefitStatus] = useMutation<
    SetBenefitStatusMutation,
    SetBenefitStatusVariables
  >(SET_BENEFIT_STATUS_MUTATION);
  const { data, error, loading, refetch } = useQuery<BenefitCatalogQuery>(
    BENEFIT_CATALOG_QUERY,
  );

  const benefitCatalogRecords = (data?.allBenefits ?? []).flatMap((benefit) => {
    if (!benefit || deletedBenefitIds.has(benefit.id)) {
      return [];
    }

    return [
      {
        ...benefit,
        ...benefitOverrides[benefit.id],
      },
    ];
  });

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const shouldShowDraftCard =
    !!draftBenefit &&
    (normalizedSearchQuery.length === 0 ||
      [
        draftBenefit.name,
        draftBenefit.description,
        draftBenefit.vendorName,
        `${draftBenefit.subsidyPercent}`,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearchQuery));
  const filteredBenefitRecords =
    normalizedSearchQuery.length === 0
      ? benefitCatalogRecords
      : benefitCatalogRecords.filter((benefit) => {
          const haystack = [
            benefit.title,
            benefit.description,
            benefit.category,
            benefit.vendorName ?? "",
            `${benefit.subsidyPercent ?? ""}`,
          ]
            .join(" ")
            .toLowerCase();

          return haystack.includes(normalizedSearchQuery);
        });

  const benefitSections = buildBenefitSections(filteredBenefitRecords);

  function formatCategoryLabel(value: string) {
    return value
      .split(" ")
      .filter((part) => part.length > 0)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(" ");
  }

  function openNewBenefitDialog(defaultCategoryId?: string | null) {
    setDialogCategoryId(defaultCategoryId ?? benefitSections[0]?.categoryId ?? null);
    setDialogDraft(null);
    setIsAddDialogOpen(true);
  }

  function openDraftBenefitDialog() {
    if (!draftBenefit) {
      return;
    }

    setDialogCategoryId(draftBenefit.categoryId);
    setDialogDraft(draftBenefit);
    setIsAddDialogOpen(true);
  }

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

      {!loading && !error && benefitSections.length === 0 && !shouldShowDraftCard ? (
        <section className="mx-auto mt-[30px] w-full max-w-[1300px] px-4 sm:px-0">
          <div className="rounded-[8px] border border-dashed border-[#DBDEE1] bg-white p-6 text-[14px] text-[#51565B]">
            No benefits found in the catalog.
          </div>
        </section>
      ) : null}

      {!loading && !error && benefitSections.length === 0 && shouldShowDraftCard ? (
        <section className="mx-auto mt-[30px] flex w-full max-w-[1300px] flex-col items-start gap-6 px-4 sm:px-0">
          <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <DraftBenefitCard
              description={draftBenefit.description.trim() || "No description yet."}
              onContinueEditing={openDraftBenefitDialog}
              onDeleteDraft={() => setDraftBenefit(null)}
              title={draftBenefit.name.trim() || "Untitled Benefit"}
            />
            <AddBenefitCard
              onClick={() => openNewBenefitDialog(draftBenefit.categoryId)}
            />
          </div>
        </section>
      ) : null}

      {!loading &&
        !error &&
        benefitSections.map(({ cards, categoryId, count, icon: SectionIcon, stats, title }) => (
          <section
            className="mx-auto mt-[30px] flex w-full max-w-[1300px] flex-col items-start gap-6 px-4 sm:px-0"
            key={title}
          >
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
                  onEdit={setSelectedBenefit}
                  onToggle={async (benefitId, isActive) => {
                    const previousIsActive =
                      benefitCatalogRecords.find((record) => record.id === benefitId)
                        ?.isActive ?? isActive;

                    setBenefitOverrides((prev) => ({
                      ...prev,
                      [benefitId]: {
                        ...prev[benefitId],
                        isActive,
                      },
                    }));

                    try {
                      const result = await setBenefitStatus({
                        variables: {
                          input: {
                            id: benefitId,
                            isActive,
                          },
                        },
                      });

                      setBenefitOverrides((prev) => ({
                        ...prev,
                        [benefitId]: {
                          ...prev[benefitId],
                          isActive:
                            result.data?.setBenefitStatus.isActive ?? isActive,
                        },
                      }));
                    } catch {
                      setBenefitOverrides((prev) => ({
                        ...prev,
                        [benefitId]: {
                          ...prev[benefitId],
                          isActive: previousIsActive,
                        },
                      }));
                    }
                  }}
                  stats={stats}
                />
              ))}
              {shouldShowDraftCard &&
              draftBenefit &&
              draftBenefit.categoryId === categoryId ? (
                <DraftBenefitCard
                  description={draftBenefit.description.trim() || "No description yet."}
                  onContinueEditing={openDraftBenefitDialog}
                  onDeleteDraft={() => setDraftBenefit(null)}
                  title={draftBenefit.name.trim() || "Untitled Benefit"}
                />
              ) : null}
              <AddBenefitCard onClick={() => openNewBenefitDialog(categoryId)} />
            </div>
          </section>
        ))}

      {isAddDialogOpen && (
        <AddBenefitDialog
          defaultCategoryId={dialogCategoryId}
          initialDraft={dialogDraft}
          onClose={() => {
            setDialogCategoryId(null);
            setDialogDraft(null);
            setIsAddDialogOpen(false);
          }}
          onCreated={() => refetch()}
          onDraftChange={setDraftBenefit}
        />
      )}
      {selectedBenefit && (
        <EditBenefitDialog
          benefitId={selectedBenefit.id}
          benefitName={selectedBenefit.title}
          category={selectedBenefit.category}
          categoryId={selectedBenefit.categoryId}
          description={selectedBenefit.description}
          subsidyPercent={selectedBenefit.subsidyPercent ?? 0}
          vendorName={selectedBenefit.vendorName ?? ""}
          onDeleted={(benefitId) =>
            setDeletedBenefitIds((prev) => {
              const next = new Set(prev);
              next.add(benefitId);
              return next;
            })
          }
          onUpdated={(benefit) =>
            setBenefitOverrides((prev) => ({
              ...prev,
              [benefit.id]: {
                category: benefit.category,
                categoryId: benefit.categoryId,
                description: benefit.description,
                subsidyPercent: benefit.subsidyPercent,
                title: benefit.title,
                vendorName: benefit.vendorName,
              },
            }))
          }
          onClose={() => setSelectedBenefit(null)}
        />
      )}
    </>
  );
}
