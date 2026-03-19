import { useMutation } from "@apollo/client/react";
import { ApprovalActionType, ApprovalEntityType } from "@/shared/apollo/generated";
import { buildContractUploadInput } from "./contract-upload-client";
import { buildArchiveApprovalSnapshot, finalizeBenefitUpdateRequestSubmission } from "./useEditBenefitDialogActions.archive";
import { buildBenefitInput, buildRuleAssignments, isMissingIsActiveFieldError, validateBenefitSaveInput } from "./useEditBenefitDialogActions.helpers";
import {
  CREATE_BENEFIT_DELETE_APPROVAL_REQUEST_MUTATION,
  type CreateBenefitDeleteApprovalRequestMutation,
  type CreateBenefitDeleteApprovalRequestVariables,
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
  benefitName,
  category,
  categoryId,
  contractFile,
  initialIsActive,
  currentUserIdentifier,
  initialApprovalRole,
  initialAssignedRules,
  initialBenefitDescription,
  initialIsCore,
  initialRequiresContract,
  initialSubsidyPercent,
  initialVendorName,
  isActive,
  isCore,
  name,
  onClose,
  onSaved,
  onSubmitted,
  requiresContract,
  subsidyPercentValue,
  vendorNameValue,
}: UseEditBenefitDialogActionsProps) {
  const [createBenefitDeleteApprovalRequest, { loading: deleting }] = useMutation<
    CreateBenefitDeleteApprovalRequestMutation,
    CreateBenefitDeleteApprovalRequestVariables
  >(CREATE_BENEFIT_DELETE_APPROVAL_REQUEST_MUTATION);
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
      const archiveSnapshot = buildArchiveApprovalSnapshot({
        archiveComment: trimmedArchiveComment,
        benefitId,
        benefitName,
        category,
        categoryId,
        initialApprovalRole,
        initialAssignedRules,
        initialBenefitDescription,
        initialIsActive,
        initialIsCore,
        initialRequiresContract,
        initialSubsidyPercent,
        initialVendorName,
      });
      const result = await createBenefitDeleteApprovalRequest({
        variables: {
          input: {
            actionType: ApprovalActionType.Delete,
            entityId: benefitId,
            entityType: ApprovalEntityType.Benefit,
            payloadJson: JSON.stringify(archiveSnapshot),
            requestedBy: currentUserIdentifier,
            snapshotJson: JSON.stringify(archiveSnapshot),
            targetRole: approvalRole,
          },
        },
      });
      if (!result.data?.createApprovalRequest.id) {
        setErrorMessage("Benefit archive request could not be submitted.");
        return false;
      }

      await finalizeBenefitUpdateRequestSubmission({
        actionLabel: "archive huselt",
        approvalRole,
        onClose,
        onSaved,
        onSubmitted,
      });
      return true;
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Benefit archive request could not be submitted.",
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
