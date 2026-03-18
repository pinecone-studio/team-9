import { useMutation } from "@apollo/client/react";
import type { ApprovalRoleValue } from "./add-benefit-dialog.graphql";
import {
  CREATE_BENEFIT_MUTATION,
  type CreateBenefitMutation,
  type CreateBenefitVariables,
} from "./add-benefit-dialog.graphql";
import {
  areBenefitDraftsEqual,
  buildBenefitDraft,
  hasBenefitDraftContent,
  type BenefitDraft,
} from "./benefit-draft";
import { getBenefitRequestNoticeMessage } from "./benefit-request-notice";
import { buildContractUploadInput } from "./contract-upload-client";
import type { AssignedBenefitRule } from "./edit-benefit-dialog.types";
type UseAddBenefitDialogActionsProps = {
  approvalRole: ApprovalRoleValue;
  assignedRules: AssignedBenefitRule[];
  categoryId: string;
  contractFile: File | null;
  coreBenefitEnabled: boolean;
  currentUserIdentifier: string;
  description: string;
  initialDraft?: BenefitDraft | null;
  name: string;
  onClose: () => void;
  onCreated?: () => void | Promise<unknown>;
  onDraftChange?: (draft: BenefitDraft | null) => void;
  onSubmitted?: (message: string) => void;
  requiresContract: boolean;
  subsidyPercent: string;
  vendorName: string;
};

export function useAddBenefitDialogActions({
  approvalRole,
  assignedRules,
  categoryId,
  contractFile,
  coreBenefitEnabled,
  currentUserIdentifier,
  description,
  initialDraft,
  name,
  onClose,
  onCreated,
  onDraftChange,
  onSubmitted,
  requiresContract,
  subsidyPercent,
  vendorName,
}: UseAddBenefitDialogActionsProps) {
  const [createBenefit, { loading: saving }] = useMutation<
    CreateBenefitMutation,
    CreateBenefitVariables
  >(CREATE_BENEFIT_MUTATION);

  function handleCloseWithDraft() {
    const draft = buildBenefitDraft({
      approvalRole,
      name,
      description,
      categoryId,
      subsidyPercent,
      vendorName,
      coreBenefitEnabled,
      requiresContract,
    });

    const baselineDraft = initialDraft ?? buildBenefitDraft({
        approvalRole: "hr_admin",
        name: "",
        description: "",
        categoryId,
        subsidyPercent: "50",
        vendorName: "",
        coreBenefitEnabled: false,
        requiresContract: false,
      });
    const hasChanges = !areBenefitDraftsEqual(draft, baselineDraft);

    if (hasChanges) {
      if (hasBenefitDraftContent(draft)) {
        onDraftChange?.(draft);
      } else {
        onDraftChange?.(null);
      }
    }

    onClose();
  }

  async function handleSave(setErrorMessage: (value: string | null) => void) {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const trimmedVendorName = vendorName.trim();
    const parsedSubsidy = Number.parseInt(subsidyPercent, 10);

    if (!trimmedName) {
      setErrorMessage("Benefit name is required.");
      return;
    }

    if (!categoryId) {
      setErrorMessage("Category is missing. Please add from a category section.");
      return;
    }

    if (!trimmedDescription) {
      setErrorMessage("Description is required.");
      return;
    }

    if (requiresContract && !trimmedVendorName) {
      setErrorMessage("Vendor name is required when contract is enabled.");
      return;
    }

    if (!Number.isInteger(parsedSubsidy) || parsedSubsidy < 0 || parsedSubsidy > 100) {
      setErrorMessage("Subsidy percent must be a whole number between 0 and 100.");
      return;
    }

    if (requiresContract && !contractFile) {
      setErrorMessage("Please upload a contract file.");
      return;
    }

    setErrorMessage(null);

    try {
      const contractUpload = requiresContract && contractFile
        ? await buildContractUploadInput(contractFile)
        : null;

      await createBenefit({
        variables: {
          input: {
            requestedBy: currentUserIdentifier,
            benefit: {
              name: trimmedName,
              description: trimmedDescription,
              categoryId,
              subsidyPercent: parsedSubsidy,
              vendorName: trimmedVendorName || null,
              requiresContract,
              isCore: coreBenefitEnabled,
              approvalRole,
            },
            contractUpload,
            ruleAssignments: coreBenefitEnabled
              ? []
              : assignedRules.map((rule, index) => ({
                  ruleId: rule.ruleId,
                  operator: rule.operator,
                  value: rule.value,
                  errorMessage: rule.errorMessage,
                  priority: index + 1,
                  isActive: true,
                })),
          },
        },
      });

      onDraftChange?.(null);
      onSubmitted?.(getBenefitRequestNoticeMessage(approvalRole));
      await onCreated?.();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Benefit request could not be submitted.",
      );
    }
  }

  return { handleCloseWithDraft, handleSave, saving };
}
