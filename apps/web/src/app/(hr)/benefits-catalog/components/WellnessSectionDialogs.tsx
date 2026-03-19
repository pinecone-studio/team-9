import AddBenefitDialog from "./AddBenefitDialog";
import BenefitCancelRequestDialog from "./BenefitCancelRequestDialog";
import BenefitPendingRequestDialog from "./BenefitPendingRequestDialog";
import CreateCategoryDialog from "./CreateCategoryDialog";
import type { BenefitCategoryRecord } from "./wellness-section.graphql";
import EditBenefitDialog from "./EditBenefitDialog";
import type { CategoryIconKey } from "../benefit-data-icons";
import type { BenefitCard } from "../benefit-data";
import type { BenefitDraft } from "./benefit-draft";

type WellnessSectionDialogsProps = {
  creatingCategory: boolean;
  currentUserIdentifier: string;
  dialogCategoryId: string | null;
  dialogDraft: BenefitDraft | null;
  isAddDialogOpen: boolean;
  isCreateCategoryDialogOpen: boolean;
  onCategoryClose: () => void;
  onCategoryCreated: (categoryId: string) => void;
  onCategorySubmit: (name: string, iconKey: CategoryIconKey) => Promise<BenefitCategoryRecord>;
  onCloseAddDialog: () => void;
  onDraftChange: (draft: BenefitDraft | null) => void;
  onEditDeleted: (benefitId: string) => void;
  onEditClose: () => void;
  onEditSaved: () => Promise<void>;
  onRequestCancelled: () => Promise<void>;
  onRequestClose: () => void;
  onRequestCancelClose: () => void;
  onRequestReviewed: () => Promise<void>;
  pendingCancelRequestId: string | null;
  onSubmitted: (message: string | null) => void;
  pendingRequestId: string | null;
  selectedBenefit: BenefitCard | null;
};

export default function WellnessSectionDialogs({
  creatingCategory,
  currentUserIdentifier,
  dialogCategoryId,
  dialogDraft,
  isAddDialogOpen,
  isCreateCategoryDialogOpen,
  onCategoryClose,
  onCategoryCreated,
  onCategorySubmit,
  onCloseAddDialog,
  onDraftChange,
  onEditDeleted,
  onEditClose,
  onEditSaved,
  onRequestCancelled,
  onRequestClose,
  onRequestCancelClose,
  onRequestReviewed,
  pendingCancelRequestId,
  onSubmitted,
  pendingRequestId,
  selectedBenefit,
}: WellnessSectionDialogsProps) {
  return (
    <>
      {isAddDialogOpen ? (
        <AddBenefitDialog
          currentUserIdentifier={currentUserIdentifier}
          defaultCategoryId={dialogCategoryId}
          initialDraft={dialogDraft}
          onClose={onCloseAddDialog}
          onCreated={onEditSaved}
          onDraftChange={onDraftChange}
          onSubmitted={onSubmitted}
        />
      ) : null}

      {selectedBenefit ? (
        <EditBenefitDialog
          activeEmployees={selectedBenefit.activeEmployees}
          approvalRole={selectedBenefit.approvalRole}
          benefitId={selectedBenefit.id}
          benefitName={selectedBenefit.title}
          category={selectedBenefit.category}
          categoryId={selectedBenefit.categoryId}
          currentUserIdentifier={currentUserIdentifier}
          description={selectedBenefit.description}
          enabled={selectedBenefit.enabled}
          eligibleEmployees={selectedBenefit.eligibleEmployees}
          isCore={selectedBenefit.isCore}
          onClose={onEditClose}
          onDeleted={onEditDeleted}
          onSaved={onEditSaved}
          onSubmitted={onSubmitted}
          requiresContract={selectedBenefit.requiresContract}
          subsidyPercent={selectedBenefit.subsidyPercent ?? 0}
          vendorName={selectedBenefit.vendorName ?? ""}
        />
      ) : null}

      {isCreateCategoryDialogOpen ? (
        <CreateCategoryDialog
          creating={creatingCategory}
          onClose={onCategoryClose}
          onCreated={onCategoryCreated}
          onSubmit={onCategorySubmit}
        />
      ) : null}

      <BenefitPendingRequestDialog
        currentUserIdentifier={currentUserIdentifier}
        onClose={onRequestClose}
        onReviewed={onRequestReviewed}
        requestId={pendingRequestId}
      />

      <BenefitCancelRequestDialog
        currentUserIdentifier={currentUserIdentifier}
        onCancelled={onRequestCancelled}
        onClose={onRequestCancelClose}
        requestId={pendingCancelRequestId}
      />
    </>
  );
}
