"use client";

import { useState } from "react";

import AddBenefitCard from "./AddBenefitCard";
import BenefitRequestNotice from "./BenefitRequestNotice";
import BenefitsCatalogSkeleton from "./BenefitsCatalogSkeleton";
import DraftBenefitCard from "./DraftBenefitCard";
import WellnessCategorySection from "./WellnessCategorySection";
import WellnessSectionDialogs from "./WellnessSectionDialogs";
import WellnessSectionNotice from "./WellnessSectionNotice";
import { useWellnessCatalogState } from "./useWellnessCatalogState";

type WellnessSectionProps = {
  currentUserIdentifier: string;
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
  currentUserIdentifier,
  searchQuery = "",
}: WellnessSectionProps) {
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const {
    benefitSections,
    closeAddDialog,
    creatingCategory,
    dialogCategoryId,
    dialogDraft,
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
  } = useWellnessCatalogState({ searchQuery });
  const showSkeleton =
    loading && !error && benefitSections.length === 0 && !shouldShowDraftCard;
  const showEmptyState =
    !loading && !error && benefitSections.length === 0 && !shouldShowDraftCard;
  const showDraftOnlyState =
    !loading && !error && benefitSections.length === 0 && shouldShowDraftCard && !!draftBenefit;
  const showMainContent = !error && !showSkeleton && !showEmptyState && !showDraftOnlyState;

  return (
    <>
      <BenefitRequestNotice message={noticeMessage} onClose={() => setNoticeMessage(null)} />
      {showSkeleton ? <BenefitsCatalogSkeleton /> : null}
      {!loading && error ? (
        <WellnessSectionNotice
          accentClassName="text-[#B42318]"
          borderClassName="border-[#F3C7C7] bg-[#FFF7F7]"
          message="Benefits data could not be loaded."
        />
      ) : null}
      {showEmptyState ? (
        <section className="mx-auto mt-[30px] w-full max-w-[1300px] px-4 sm:px-0">
          <div className="rounded-[8px] border border-dashed border-[#DBDEE1] bg-white p-6 text-[14px] text-[#51565B]">
            No benefits found in the catalog.
          </div>
        </section>
      ) : null}
      {showDraftOnlyState && draftBenefit ? (
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

      {showMainContent ? (
        <section className="mx-auto mt-[30px] flex w-full max-w-[1300px] flex-col gap-[34px] px-4 sm:px-0">
          {benefitSections.map((section, index) => (
            <div
              className="flex flex-col gap-[34px]"
              key={section.categoryId || section.title}
            >
              <WellnessCategorySection
                draftBenefit={draftBenefit}
                formatCategoryLabel={formatCategoryLabel}
                onAddBenefit={openNewBenefitDialog}
                onContinueDraft={openDraftBenefitDialog}
                onDeleteDraft={() => setDraftBenefit(null)}
                onEditBenefit={setSelectedBenefit}
                onOpenRequest={setSelectedRequestId}
                section={section}
                shouldShowDraftCard={shouldShowDraftCard}
              />
              {index < benefitSections.length - 1 ? (
                <div className="h-px w-full bg-[#DBDEE1]" />
              ) : null}
            </div>
          ))}

          <div className="h-px w-full bg-[#DBDEE1]" />

          <div className="flex w-full flex-col items-start gap-6">
            <h2 className="text-[16px] leading-[21px] font-semibold text-[#060B10]">
              Create a new category
            </h2>
            <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              <AddBenefitCard
                label="Create new category"
                onClick={() => setIsCreateCategoryDialogOpen(true)}
              />
            </div>
          </div>
        </section>
      ) : null}

      <WellnessSectionDialogs
        creatingCategory={creatingCategory}
        currentUserIdentifier={currentUserIdentifier}
        dialogCategoryId={dialogCategoryId}
        dialogDraft={dialogDraft}
        isAddDialogOpen={isAddDialogOpen}
        isCreateCategoryDialogOpen={isCreateCategoryDialogOpen}
        onCategoryClose={() => setIsCreateCategoryDialogOpen(false)}
        onCategoryCreated={(categoryId) => {
          setIsCreateCategoryDialogOpen(false);
          openNewBenefitDialog(categoryId);
        }}
        onCategorySubmit={handleCreateCategory}
        onCloseAddDialog={closeAddDialog}
        onDraftChange={setDraftBenefit}
        onEditDeleted={handleBenefitDeleted}
        onEditClose={() => setSelectedBenefit(null)}
        onEditSaved={async () => {
          await refetchApprovalRequests();
          await refetch();
        }}
        onRequestClose={() => setSelectedRequestId(null)}
        onRequestReviewed={async () => {
          await refetchApprovalRequests();
          await refetch();
        }}
        onSubmitted={setNoticeMessage}
        pendingRequestId={selectedRequestId}
        selectedBenefit={selectedBenefit}
      />
    </>
  );
}
