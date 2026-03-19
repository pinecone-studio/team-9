import { useMutation } from "@apollo/client/react";
import {
  CREATE_BENEFIT_MUTATION,
  type CreateBenefitMutation,
  type CreateBenefitVariables,
} from "./add-benefit-dialog.graphql";
import {
  areBenefitDraftsEqual,
  buildBenefitDraft,
  hasBenefitDraftContent,
} from "./benefit-draft";
import { getBenefitRequestNoticeMessage } from "./benefit-request-notice";
import { buildContractUploadInput } from "./contract-upload-client";
import {
  type UseAddBenefitDialogActionsProps,
  validateAddBenefitSaveInput,
} from "./useAddBenefitDialogActions.helpers";

export function useAddBenefitDialogActions({
  approvalRole,
  assignedRules,
  categoryId,
  contractFile,
  contractEffectiveDate,
  contractExpiryDate,
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
    const validation = validateAddBenefitSaveInput({
      categoryId,
      contractEffectiveDate,
      contractExpiryDate,
      contractFile,
      description,
      name,
      requiresContract,
      subsidyPercent,
      vendorName,
    });

    if ("errorMessage" in validation) {
      setErrorMessage(validation.errorMessage);
      return;
    }

    setErrorMessage(null);

    try {
      const contractUpload = requiresContract && contractFile
        ? await buildContractUploadInput({
            effectiveDate: contractEffectiveDate,
            expiryDate: contractExpiryDate,
            file: contractFile,
          })
        : null;

      await createBenefit({
        variables: {
          input: {
            requestedBy: currentUserIdentifier,
            benefit: {
              name: validation.trimmedName,
              description: validation.trimmedDescription,
              categoryId,
              subsidyPercent: validation.parsedSubsidy,
              vendorName: validation.trimmedVendorName || null,
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
