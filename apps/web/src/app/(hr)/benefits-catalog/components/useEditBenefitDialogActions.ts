import { useMutation } from "@apollo/client/react";

import { buildContractUploadInput } from "./contract-upload-client";
import {
  buildBenefitInput,
  buildRuleAssignments,
  isMissingIsActiveFieldError,
  validateBenefitSaveInput,
} from "./useEditBenefitDialogActions.helpers";
import type { AssignedBenefitRule } from "./edit-benefit-dialog.types";
import {
  DELETE_BENEFIT_MUTATION,
  SUBMIT_BENEFIT_UPDATE_REQUEST_MUTATION,
  type ApprovalRoleValue,
  type DeleteBenefitMutation,
  type DeleteBenefitVariables,
  type SubmitBenefitUpdateRequestMutation,
  type SubmitBenefitUpdateRequestVariables,
} from "./edit-benefit-dialog.graphql";

const FALLBACK_REQUESTED_BY = "current_hr_admin";

type UseEditBenefitDialogActionsProps = {
  approvalRole: ApprovalRoleValue;
  assignedRules: AssignedBenefitRule[];
  benefitDescription: string;
  benefitId: string;
  categoryId: string;
  contractFile: File | null;
  initialIsActive: boolean;
  initialRequiresContract: boolean;
  isActive: boolean;
  isCore: boolean;
  name: string;
  onClose: () => void;
  onDeleted?: (benefitId: string) => void | Promise<unknown>;
  onSaved?: () => void | Promise<unknown>;
  requiresContract: boolean;
  subsidyPercentValue: string;
  vendorNameValue: string;
};

export function useEditBenefitDialogActions({
  approvalRole,
  assignedRules,
  benefitDescription,
  benefitId,
  categoryId,
  contractFile,
  initialIsActive,
  initialRequiresContract,
  isActive,
  isCore,
  name,
  onClose,
  onDeleted,
  onSaved,
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

  async function handleDelete(setErrorMessage: (value: string | null) => void) {
    setErrorMessage(null);

    try {
      const result = await deleteBenefit({ variables: { id: benefitId } });

      if (!result.data?.deleteBenefit) {
        setErrorMessage("Benefit not found or already deleted.");
        return;
      }

      await onDeleted?.(benefitId);
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Benefit could not be archived.",
      );
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
            requestedBy: FALLBACK_REQUESTED_BY,
            benefit: benefitInput,
            contractUpload,
            ruleAssignments: buildRuleAssignments(assignedRules, isCore),
          },
        },
      });

      try {
        await onSaved?.();
      } catch {
        // Save already succeeded; ignore refresh callback failures.
      }
      onClose();
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

  return {
    deleting,
    handleDelete,
    handleSave,
    updating,
  };
}
