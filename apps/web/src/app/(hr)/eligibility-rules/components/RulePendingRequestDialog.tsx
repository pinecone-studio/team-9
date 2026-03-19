import RuleApprovalRequestReviewDialog from "@/app/(hr)/requests/components/RuleApprovalRequestReviewDialog";

type RulePendingRequestDialogProps = {
  currentUserIdentifier: string;
  onClose: () => void;
  onReviewed: () => Promise<unknown>;
  requestId: string | null;
};

export default function RulePendingRequestDialog({
  currentUserIdentifier,
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
      onClose={onClose}
      onReviewed={onReviewed}
      onReviewSuccess={() => undefined}
      requestId={requestId}
    />
  );
}
