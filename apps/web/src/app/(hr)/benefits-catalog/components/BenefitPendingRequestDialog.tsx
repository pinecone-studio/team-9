import ApprovalRequestReviewDialog from "@/app/(hr)/requests/components/ApprovalRequestReviewDialog";

type BenefitPendingRequestDialogProps = {
  currentUserIdentifier: string;
  onClose: () => void;
  onReviewed: () => Promise<unknown>;
  requestId: string | null;
};

export default function BenefitPendingRequestDialog({
  currentUserIdentifier,
  onClose,
  onReviewed,
  requestId,
}: BenefitPendingRequestDialogProps) {
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
