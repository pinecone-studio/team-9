import ApprovalRequestReviewDialog from "@/app/(hr)/requests/components/ApprovalRequestReviewDialog";

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
    <ApprovalRequestReviewDialog
      currentUserIdentifier={currentUserIdentifier}
      onClose={onClose}
      onReviewed={onReviewed}
      requestId={requestId}
    />
  );
}
