import { useMutation } from "@apollo/client/react";
import { buildContractUploadInput } from "./contract-upload-client";
import { finalizeBenefitUpdateRequestSubmission } from "./useEditBenefitDialogActions.archive";
import { buildBenefitInput, buildRuleAssignments, isMissingIsActiveFieldError, validateBenefitSaveInput } from "./useEditBenefitDialogActions.helpers";
import {
  DELETE_BENEFIT_MUTATION,
  type DeleteBenefitMutation,
  type DeleteBenefitVariables,
  SUBMIT_BENEFIT_UPDATE_REQUEST_MUTATION,
  type SubmitBenefitUpdateRequestMutation,
  type SubmitBenefitUpdateRequestVariables,
} from "./edit-benefit-dialog.graphql";
import type { UseEditBenefitDialogActionsProps } from "./edit-benefit-dialog.types";

export function useEditBenefitDialogActions({
  approvalRole,
  assignedRules,
  benefitDescription,
  benefitId,
  categoryId,
  contractFile,
  initialIsActive,
  currentUserIdentifier,
  initialRequiresContract,
  isActive,
  isCore,
  name,
  onClose,
  onDeleted,
  onSaved,
  onSubmitted,
  requiresContract,
  subsidyPercentValue,
  vendorNameValue,
}: UseEditBenefitDialogActionsProps) {
  const [deleteBenefit, { loading: deleting }] = useMutation<
    DeleteBenefitMutation,
    DeleteBenefitVariables
  >(DELETE_BENEFIT_MUTATION);
  const [submitBenefitUpdateRequest, { loading: updating }] = useMutation<
    SubmitBenefitUpdateRequestMutation,
    SubmitBenefitUpdateRequestVariables
  >(SUBMIT_BENEFIT_UPDATE_REQUEST_MUTATION);

  async function handleDelete(
    archiveComment: string,
    setErrorMessage: (value: string | null) => void,
  ) {
    setErrorMessage(null);
    const trimmedArchiveComment = archiveComment.trim();
    if (!trimmedArchiveComment) {
      setErrorMessage("Please add an archive comment before submitting.");
      return false;
    }

    try {
      const result = await deleteBenefit({ variables: { id: benefitId } });
      if (!result.data?.deleteBenefit) {
        setErrorMessage("Benefit could not be archived.");
        return false;
      }

      try {
        await onDeleted?.(benefitId);
        await onSaved?.();
      } catch {
        // The archive already succeeded; ignore refresh callback failures.
      }

      onClose();
      return true;
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Benefit could not be archived.",
      );
      return false;
    }
  }

  async function handleSave(setErrorMessage: (value: string | null) => void) {
    const validation = validateBenefitSaveInput({
      name,
      benefitDescription,
      vendorNameValue,
      subsidyPercentValue,
      requiresContract,
      initialRequiresContract,
      contractFile,
      isCore,
      assignedRules,
    });

    if ("errorMessage" in validation) {
      setErrorMessage(validation.errorMessage);
      return;
    }
    setErrorMessage(null);
    try {
      const contractUpload = contractFile ? await buildContractUploadInput(contractFile) : null;
      const benefitInput = buildBenefitInput({
        approvalRole,
        benefitId,
        categoryId,
        initialIsActive,
        isActive,
        isCore,
        parsedSubsidy: validation.parsedSubsidy,
        requiresContract,
        trimmedDescription: validation.trimmedDescription,
        trimmedName: validation.trimmedName,
        trimmedVendorName: validation.trimmedVendorName,
      });
      await submitBenefitUpdateRequest({
        variables: {
          input: {
            requestedBy: currentUserIdentifier,
            benefit: benefitInput,
            contractUpload,
            ruleAssignments: buildRuleAssignments(assignedRules, isCore),
          },
        },
      });
      await finalizeBenefitUpdateRequestSubmission({ approvalRole, onClose, onSaved, onSubmitted });
    } catch (error) {
      if (isMissingIsActiveFieldError(error)) {
        setErrorMessage(
          "Status request ilgeehiin tuld backend schema deploy hiih shaardlagatai (UpdateBenefitInput.isActive).",
        );
        return;
      }

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Benefit update request could not be submitted.",
      );
    }
  }

  return { deleting, handleDelete, handleSave, updating };
}
