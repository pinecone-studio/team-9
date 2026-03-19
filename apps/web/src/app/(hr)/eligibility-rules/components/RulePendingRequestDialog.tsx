import RuleApprovalRequestReviewDialog from "@/app/(hr)/requests/components/RuleApprovalRequestReviewDialog";

type RulePendingRequestDialogProps = {
  currentUserIdentifier: string;
  currentUserRole: string;
  onClose: () => void;
  onReviewed: () => Promise<unknown>;
  requestId: string | null;
};

export default function RulePendingRequestDialog({
  currentUserIdentifier,
  currentUserRole,
  onClose,
  onReviewed,
  requestId,
}: RulePendingRequestDialogProps) {
  if (!requestId) {
    return null;
  }

  return (
    <RuleApprovalRequestReviewDialog
      currentUserIdentifier={currentUserIdentifier}
      currentUserRole={currentUserRole}
      onClose={onClose}
      onReviewed={onReviewed}
      onReviewSuccess={() => undefined}
      requestId={requestId}
    />
  );
}
