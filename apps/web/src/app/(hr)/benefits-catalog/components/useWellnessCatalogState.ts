import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";

import {
  BENEFIT_CATALOG_QUERY,
  SET_BENEFIT_STATUS_MUTATION,
  type BenefitCatalogQuery,
  type SetBenefitStatusMutation,
  type SetBenefitStatusVariables,
} from "./wellness-section.graphql";
import { buildBenefitSections } from "../benefit-data";
import type { BenefitCard, BenefitCatalogRecord } from "../benefit-types";
import type { UpdatedBenefitPayload } from "./edit-benefit-dialog.graphql";
import type { BenefitDraft } from "./benefit-draft";

type UseWellnessCatalogStateProps = {
  searchQuery: string;
};

export function useWellnessCatalogState({
  searchQuery,
}: UseWellnessCatalogStateProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [draftBenefit, setDraftBenefit] = useState<BenefitDraft | null>(null);
  const [dialogCategoryId, setDialogCategoryId] = useState<string | null>(null);
  const [dialogDraft, setDialogDraft] = useState<BenefitDraft | null>(null);
  const [benefitOverrides, setBenefitOverrides] = useState<
    Record<string, Partial<BenefitCatalogRecord>>
  >({});
  const [deletedBenefitIds, setDeletedBenefitIds] = useState<Set<string>>(new Set());
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitCard | null>(null);
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

    return [{ ...benefit, ...benefitOverrides[benefit.id] }];
  });
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const shouldShowDraftCard =
    !!draftBenefit &&
    (normalizedSearchQuery.length === 0 ||
      [draftBenefit.name, draftBenefit.description, draftBenefit.vendorName, `${draftBenefit.subsidyPercent}`]
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

  function closeAddDialog() {
    setDialogCategoryId(null);
    setDialogDraft(null);
    setIsAddDialogOpen(false);
  }

  async function handleBenefitToggle(benefitId: string, isActive: boolean) {
    const previousIsActive =
      benefitCatalogRecords.find((record) => record.id === benefitId)?.isActive ?? isActive;

    setBenefitOverrides((prev) => ({
      ...prev,
      [benefitId]: { ...prev[benefitId], isActive },
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
          isActive: result.data?.setBenefitStatus.isActive ?? isActive,
        },
      }));
    } catch {
      setBenefitOverrides((prev) => ({
        ...prev,
        [benefitId]: { ...prev[benefitId], isActive: previousIsActive },
      }));
    }
  }

  function handleBenefitUpdated(benefit: UpdatedBenefitPayload) {
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
    }));
  }

  function handleBenefitDeleted(benefitId: string) {
    setDeletedBenefitIds((prev) => {
      const next = new Set(prev);
      next.add(benefitId);
      return next;
    });
  }

  return {
    benefitSections,
    closeAddDialog,
    draftBenefit,
    error,
    handleBenefitDeleted,
    handleBenefitToggle,
    handleBenefitUpdated,
    isAddDialogOpen,
    loading,
    openDraftBenefitDialog,
    openNewBenefitDialog,
    refetch,
    selectedBenefit,
    setDraftBenefit,
    setSelectedBenefit,
    shouldShowDraftCard,
    dialogCategoryId,
    dialogDraft,
  };
}
