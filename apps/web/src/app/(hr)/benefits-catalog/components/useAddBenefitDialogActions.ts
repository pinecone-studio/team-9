import { useMutation } from "@apollo/client/react";

import type { ApprovalRoleValue } from "./add-benefit-dialog.graphql";
import {
  CREATE_BENEFIT_MUTATION,
  type CreateBenefitMutation,
  type CreateBenefitVariables,
} from "./add-benefit-dialog.graphql";
import { buildBenefitDraft, hasBenefitDraftContent, type BenefitDraft } from "./benefit-draft";
import type { AssignedBenefitRule } from "./edit-benefit-dialog.types";

const FALLBACK_REQUESTED_BY = "current_hr_admin";

type UseAddBenefitDialogActionsProps = {
  approvalRole: ApprovalRoleValue;
  assignedRules: AssignedBenefitRule[];
  categoryId: string;
  coreBenefitEnabled: boolean;
  description: string;
  initialDraft?: BenefitDraft | null;
  name: string;
  onClose: () => void;
  onCreated?: () => void | Promise<unknown>;
  onDraftChange?: (draft: BenefitDraft | null) => void;
  requiresContract: boolean;
  subsidyPercent: string;
  vendorName: string;
};

export function useAddBenefitDialogActions({
  approvalRole,
  assignedRules,
  categoryId,
  coreBenefitEnabled,
  description,
  initialDraft,
  name,
  onClose,
  onCreated,
  onDraftChange,
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

    if (hasBenefitDraftContent(draft)) {
      onDraftChange?.(draft);
    } else if (initialDraft) {
      onDraftChange?.(null);
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

    if (!Number.isInteger(parsedSubsidy) || parsedSubsidy < 0 || parsedSubsidy > 100) {
      setErrorMessage("Subsidy percent must be a whole number between 0 and 100.");
      return;
    }

    if (!coreBenefitEnabled && assignedRules.length === 0) {
      setErrorMessage("Please attach at least one eligibility rule or enable Core Benefit.");
      return;
    }

    setErrorMessage(null);

    try {
      await createBenefit({
        variables: {
          input: {
            requestedBy: FALLBACK_REQUESTED_BY,
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

  return {
    handleCloseWithDraft,
    handleSave,
    saving,
  };
}
