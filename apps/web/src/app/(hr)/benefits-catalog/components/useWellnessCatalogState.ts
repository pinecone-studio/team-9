import { useQuery } from "@apollo/client/react";
import { useState } from "react";
import { useApprovalRequestsQuery } from "@/shared/apollo/generated";

import {
  BENEFIT_CATALOG_QUERY,
  type BenefitCatalogQuery,
} from "./wellness-section.graphql";
import { buildBenefitSections } from "../benefit-data";
import type { BenefitCard } from "../benefit-types";
import type { BenefitDraft } from "./benefit-draft";
import { useBenefitCategoryManagement } from "./useBenefitCategoryManagement";

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
    notifyOnNetworkStatusChange: true,
  });
  const {
    categoryIconKeys,
    creatingCategory,
    deletedCategoryIds,
    deletingCategory,
    handleCategoryDeleted,
    handleCreateCategory,
  } = useBenefitCategoryManagement({ refetch });
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
    includeEmptyCategories
      ? (data?.benefitCategories ?? []).filter((category) => !deletedCategoryIds.has(category.id))
      : [],
    approvalRequestsData?.approvalRequests ?? [],
    categoryIconKeys,
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

  return {
    benefitSections,
    closeAddDialog,
    creatingCategory,
    deletingCategory,
    draftBenefit,
    error,
    handleBenefitDeleted,
    handleCategoryDeleted,
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
