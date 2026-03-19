import type { ApprovalRoleValue } from "./edit-benefit-dialog.graphql";
import type { UseEditBenefitDialogActionsProps } from "./edit-benefit-dialog.types";
import { getBenefitRequestNoticeMessage } from "./benefit-request-notice";

type ArchiveSnapshotParams = Pick<
  UseEditBenefitDialogActionsProps,
  | "benefitId"
  | "benefitName"
  | "category"
  | "categoryId"
  | "initialApprovalRole"
  | "initialAssignedRules"
  | "initialBenefitDescription"
  | "initialIsActive"
  | "initialIsCore"
  | "initialRequiresContract"
  | "initialSubsidyPercent"
  | "initialVendorName"
> & {
  archiveComment: string;
};

export function buildArchiveApprovalSnapshot({
  archiveComment,
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
}: ArchiveSnapshotParams) {
  return {
    archiveComment,
    benefit: {
      approvalRole: initialApprovalRole,
      category,
      categoryId,
      description: initialBenefitDescription,
      id: benefitId,
      isActive: initialIsActive,
      isCore: initialIsCore,
      name: benefitName,
      requiresContract: initialRequiresContract,
      subsidyPercent: initialSubsidyPercent,
      vendorName: initialVendorName || null,
    },
    ruleAssignments: initialAssignedRules.map((rule) => ({
      errorMessage: rule.errorMessage,
      name: rule.name,
      operator: rule.operator,
      ruleId: rule.ruleId,
      value: rule.value,
    })),
  };
}

type SubmissionCallbacksParams = {
  approvalRole: ApprovalRoleValue;
  onClose: () => void;
  onSaved?: () => void | Promise<unknown>;
  onSubmitted?: (message: string) => void;
};

export async function finalizeBenefitSubmission({
  approvalRole,
  onClose,
  onSaved,
  onSubmitted,
}: SubmissionCallbacksParams) {
  onSubmitted?.(getBenefitRequestNoticeMessage(approvalRole));

  try {
    await onSaved?.();
  } catch {
    // The request already succeeded; ignore refresh callback failures.
  }

  onClose();
}
