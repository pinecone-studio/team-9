import { useMutation } from "@apollo/client/react";
import { useState } from "react";

import type { CategoryIconKey } from "../benefit-data-icons";
import {
  CREATE_BENEFIT_CATEGORY_MUTATION,
  DELETE_BENEFIT_CATEGORY_MUTATION,
  type CreateBenefitCategoryMutation,
  type CreateBenefitCategoryVariables,
  type DeleteBenefitCategoryMutation,
  type DeleteBenefitCategoryVariables,
} from "./wellness-section.graphql";

type UseBenefitCategoryManagementParams = {
  refetch: () => Promise<unknown>;
};

export function useBenefitCategoryManagement({
  refetch,
}: UseBenefitCategoryManagementParams) {
  const [categoryIconKeys, setCategoryIconKeys] = useState<
    Partial<Record<string, CategoryIconKey>>
  >({});
  const [deletedCategoryIds, setDeletedCategoryIds] = useState<Set<string>>(new Set());
  const [createBenefitCategory, { loading: creatingCategory }] = useMutation<
    CreateBenefitCategoryMutation,
    CreateBenefitCategoryVariables
  >(CREATE_BENEFIT_CATEGORY_MUTATION);
  const [deleteBenefitCategory, { loading: deletingCategory }] = useMutation<
    DeleteBenefitCategoryMutation,
    DeleteBenefitCategoryVariables
  >(DELETE_BENEFIT_CATEGORY_MUTATION);

  async function handleCreateCategory(name: string, iconKey: CategoryIconKey) {
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

    setCategoryIconKeys((prev) => ({
      ...prev,
      [createdCategory.id]: iconKey,
    }));
    await refetch();
    return createdCategory;
  }

  async function handleCategoryDeleted(categoryId: string) {
    const result = await deleteBenefitCategory({
      variables: { id: categoryId },
    });

    if (!result.data?.deleteBenefitCategory) {
      throw new Error("Category could not be deleted.");
    }

    setDeletedCategoryIds((prev) => {
      const next = new Set(prev);
      next.add(categoryId);
      return next;
    });
    setCategoryIconKeys((prev) => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
    await refetch();
  }

  return {
    categoryIconKeys,
    creatingCategory,
    deletedCategoryIds,
    deletingCategory,
    handleCategoryDeleted,
    handleCreateCategory,
  };
}
