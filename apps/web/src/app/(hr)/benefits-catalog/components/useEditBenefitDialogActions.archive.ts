import { getBenefitRequestNoticeMessage } from "./benefit-request-notice";
import type { ApprovalRoleValue } from "./edit-benefit-dialog.graphql";

type SubmissionCallbacksParams = {
  approvalRole: ApprovalRoleValue;
  onClose: () => void;
  onSaved?: () => void | Promise<unknown>;
  onSubmitted?: (message: string) => void;
};

export async function finalizeBenefitUpdateRequestSubmission({
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
