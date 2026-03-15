import { useMutation } from "@apollo/client/react";

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
  isCore: boolean;
  name: string;
  onClose: () => void;
  onDeleted?: (benefitId: string) => void | Promise<unknown>;
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
  isCore,
  name,
  onClose,
  onDeleted,
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
    const trimmedName = name.trim();
    const trimmedDescription = benefitDescription.trim();
    const trimmedVendorName = vendorNameValue.trim();
    const parsedSubsidy = Number.parseInt(subsidyPercentValue, 10);

    if (!trimmedName) {
      setErrorMessage("Benefit name is required.");
      return;
    }

    if (!trimmedDescription) {
      setErrorMessage("Description is required.");
      return;
    }

    if (!Number.isInteger(parsedSubsidy) || parsedSubsidy < 0 || parsedSubsidy > 100) {
      setErrorMessage("Subsidy percent must be a whole number between 0 and 100.");
      return;
    }

    if (!isCore && assignedRules.length === 0) {
      setErrorMessage("Please attach at least one eligibility rule or enable Core Benefit.");
      return;
    }

    setErrorMessage(null);

    try {
      await submitBenefitUpdateRequest({
        variables: {
          input: {
            requestedBy: FALLBACK_REQUESTED_BY,
            benefit: {
              id: benefitId,
              name: trimmedName,
              description: trimmedDescription,
              categoryId,
              subsidyPercent: parsedSubsidy,
              vendorName: trimmedVendorName || null,
              requiresContract,
              isCore,
              approvalRole,
            },
            ruleAssignments: isCore
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

      onClose();
    } catch (error) {
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
