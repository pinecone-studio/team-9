import { useState } from "react";

type CategoryDeleteTarget = {
  benefitCount: number;
  categoryId: string;
  title: string;
};

type UseCategoryDeleteDialogParams = {
  handleCategoryDeleted: (categoryId: string) => Promise<void>;
};

export function useCategoryDeleteDialog({
  handleCategoryDeleted,
}: UseCategoryDeleteDialogParams) {
  const [categoryDeleteError, setCategoryDeleteError] = useState<string | null>(null);
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] =
    useState<CategoryDeleteTarget | null>(null);

  function openCategoryDeleteDialog(target: CategoryDeleteTarget) {
    setCategoryDeleteError(null);
    setSelectedCategoryForDelete(target);
  }

  function closeCategoryDeleteDialog() {
    setCategoryDeleteError(null);
    setSelectedCategoryForDelete(null);
  }

  async function confirmCategoryDelete() {
    if (!selectedCategoryForDelete) {
      return;
    }

    if (selectedCategoryForDelete.benefitCount > 0) {
      closeCategoryDeleteDialog();
      return;
    }

    try {
      await handleCategoryDeleted(selectedCategoryForDelete.categoryId);
      closeCategoryDeleteDialog();
    } catch (caughtError) {
      setCategoryDeleteError(
        caughtError instanceof Error
          ? caughtError.message
          : "Category could not be deleted.",
      );
    }
  }

  return {
    categoryDeleteError,
    closeCategoryDeleteDialog,
    confirmCategoryDelete,
    openCategoryDeleteDialog,
    selectedCategoryForDelete,
  };
}
