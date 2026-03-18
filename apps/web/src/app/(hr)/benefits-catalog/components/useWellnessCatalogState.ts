import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { useApprovalRequestsQuery } from "@/shared/apollo/generated";

import {
  BENEFIT_CATALOG_QUERY,
  CREATE_BENEFIT_CATEGORY_MUTATION,
  type BenefitCatalogQuery,
  type CreateBenefitCategoryMutation,
  type CreateBenefitCategoryVariables,
} from "./wellness-section.graphql";
import { buildBenefitSections } from "../benefit-data";
import type { BenefitCard } from "../benefit-types";
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
  const [deletedBenefitIds, setDeletedBenefitIds] = useState<Set<string>>(new Set());
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitCard | null>(null);
  const [createBenefitCategory, { loading: creatingCategory }] = useMutation<
    CreateBenefitCategoryMutation,
    CreateBenefitCategoryVariables
  >(CREATE_BENEFIT_CATEGORY_MUTATION);
  const { data, error, loading, refetch } = useQuery<BenefitCatalogQuery>(
    BENEFIT_CATALOG_QUERY,
    {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    },
  );
  const { data: approvalRequestsData, refetch: refetchApprovalRequests } = useApprovalRequestsQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const eligibilitySummaryByBenefitId = new Map(
    (data?.listBenefitEligibilitySummary ?? []).map((summary) => [
      summary.benefitId,
      summary,
    ]),
  );

  const benefitCatalogRecords = (data?.allBenefits ?? []).flatMap((benefit) => {
    if (!benefit || deletedBenefitIds.has(benefit.id)) {
      return [];
    }

    const summary = eligibilitySummaryByBenefitId.get(benefit.id);

    return [
      {
        ...benefit,
        activeEmployees: summary?.activeEmployees ?? 0,
        eligibleEmployees: summary?.eligibleEmployees ?? 0,
      },
    ];
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
  const includeEmptyCategories = normalizedSearchQuery.length === 0;
  const benefitSections = buildBenefitSections(
    filteredBenefitRecords,
    includeEmptyCategories ? data?.benefitCategories ?? [] : [],
    approvalRequestsData?.approvalRequests ?? [],
  );

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

  function handleBenefitDeleted(benefitId: string) {
    setDeletedBenefitIds((prev) => {
      const next = new Set(prev);
      next.add(benefitId);
      return next;
    });
  }

  async function handleCreateCategory(name: string) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new Error("Category name is required.");
    }

    const result = await createBenefitCategory({
      variables: {
        name: trimmedName,
      },
    });

    const createdCategory = result.data?.createBenefitCategory;

    if (!createdCategory) {
      throw new Error("Category could not be created.");
    }

    await refetch();
    return createdCategory;
  }

  return {
    benefitSections,
    closeAddDialog,
    creatingCategory,
    draftBenefit,
    error,
    handleBenefitDeleted,
    handleCreateCategory,
    isAddDialogOpen,
    loading,
    openDraftBenefitDialog,
    openNewBenefitDialog,
    refetch,
    refetchApprovalRequests,
    selectedBenefit,
    setDraftBenefit,
    setSelectedBenefit,
    shouldShowDraftCard,
    dialogCategoryId,
    dialogDraft,
  };
}
