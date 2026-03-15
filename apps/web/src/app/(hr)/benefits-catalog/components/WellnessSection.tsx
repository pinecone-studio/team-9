"use client";

import AddBenefitCard from "./AddBenefitCard";
import AddBenefitDialog from "./AddBenefitDialog";
import DraftBenefitCard from "./DraftBenefitCard";
import EditBenefitDialog from "./EditBenefitDialog";
import WellnessCategorySection from "./WellnessCategorySection";
import WellnessSectionNotice from "./WellnessSectionNotice";
import { useWellnessCatalogState } from "./useWellnessCatalogState";

type WellnessSectionProps = {
  searchQuery?: string;
};

function formatCategoryLabel(value: string) {
  return value
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export default function WellnessSection({
  searchQuery = "",
}: WellnessSectionProps) {
  const {
    benefitSections,
    closeAddDialog,
    dialogCategoryId,
    dialogDraft,
    draftBenefit,
    error,
    handleBenefitDeleted,
    handleBenefitToggle,
    isAddDialogOpen,
    loading,
    openDraftBenefitDialog,
    openNewBenefitDialog,
    refetch,
    selectedBenefit,
    setDraftBenefit,
    setSelectedBenefit,
    shouldShowDraftCard,
  } = useWellnessCatalogState({ searchQuery });

  return (
    <>
      {loading ? (
        <WellnessSectionNotice
          accentClassName="text-[#51565B]"
          borderClassName="border-[#DBDEE1]"
          message="Loading benefits catalog..."
        />
      ) : null}

      {!loading && error ? (
        <WellnessSectionNotice
          accentClassName="text-[#B42318]"
          borderClassName="border-[#F3C7C7] bg-[#FFF7F7]"
          message="Benefits data could not be loaded."
        />
      ) : null}

      {!loading && !error && benefitSections.length === 0 && !shouldShowDraftCard ? (
        <section className="mx-auto mt-[30px] w-full max-w-[1300px] px-4 sm:px-0">
          <div className="rounded-[8px] border border-dashed border-[#DBDEE1] bg-white p-6 text-[14px] text-[#51565B]">
            No benefits found in the catalog.
          </div>
        </section>
      ) : null}

      {!loading && !error && benefitSections.length === 0 && shouldShowDraftCard && draftBenefit ? (
        <section className="mx-auto mt-[30px] flex w-full max-w-[1300px] flex-col items-start gap-6 px-4 sm:px-0">
          <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <DraftBenefitCard
              description={draftBenefit.description.trim() || "No description yet."}
              onContinueEditing={openDraftBenefitDialog}
              onDeleteDraft={() => setDraftBenefit(null)}
              title={draftBenefit.name.trim() || "Untitled Benefit"}
            />
            <AddBenefitCard onClick={() => openNewBenefitDialog(draftBenefit.categoryId)} />
          </div>
        </section>
      ) : null}

      {!loading &&
        !error &&
        benefitSections.map((section) => (
          <WellnessCategorySection
            draftBenefit={draftBenefit}
            formatCategoryLabel={formatCategoryLabel}
            key={section.title}
            onAddBenefit={openNewBenefitDialog}
            onContinueDraft={openDraftBenefitDialog}
            onDeleteDraft={() => setDraftBenefit(null)}
            onEditBenefit={setSelectedBenefit}
            onToggleBenefit={handleBenefitToggle}
            section={section}
            shouldShowDraftCard={shouldShowDraftCard}
          />
        ))}

      {isAddDialogOpen ? (
        <AddBenefitDialog
          defaultCategoryId={dialogCategoryId}
          initialDraft={dialogDraft}
          onClose={closeAddDialog}
          onCreated={() => refetch()}
          onDraftChange={setDraftBenefit}
        />
      ) : null}

      {selectedBenefit ? (
        <EditBenefitDialog
          approvalRole={selectedBenefit.approvalRole}
          benefitId={selectedBenefit.id}
          benefitName={selectedBenefit.title}
          category={selectedBenefit.category}
          categoryId={selectedBenefit.categoryId}
          description={selectedBenefit.description}
          isCore={selectedBenefit.isCore}
          onClose={() => setSelectedBenefit(null)}
          onDeleted={handleBenefitDeleted}
          requiresContract={selectedBenefit.requiresContract}
          subsidyPercent={selectedBenefit.subsidyPercent ?? 0}
          vendorName={selectedBenefit.vendorName ?? ""}
        />
      ) : null}
    </>
  );
}
