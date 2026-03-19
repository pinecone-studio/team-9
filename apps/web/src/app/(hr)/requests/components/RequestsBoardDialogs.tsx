"use client";

import ApprovalRequestReviewDialog from "./ApprovalRequestReviewDialog";
import BenefitRequestReviewDialog from "./BenefitRequestReviewDialog";
import DataUpdateRequestReviewDialog from "./DataUpdateRequestReviewDialog";
import OverrideRequestReviewDialog from "./OverrideRequestReviewDialog";
import RuleApprovalRequestReviewDialog from "./RuleApprovalRequestReviewDialog";
import type { ApprovalRequestRecord } from "./approval-requests.graphql";
import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import { isOverrideApprovalRequest } from "./requests-board.utils";

type RequestsBoardDialogsProps = {
  currentUserIdentifier: string;
  currentUserRole: string;
  onBenefitClose: () => void;
  onConfigurationClose: () => void;
  onReviewSuccess: (message: string | null) => void;
  onReviewedApproval: () => Promise<unknown> | void;
  onReviewedBenefit: () => Promise<unknown> | void;
  selectedApprovalRequest: ApprovalRequestRecord | null;
  selectedBenefitRequest: BenefitRequestRecord | null;
};

export default function RequestsBoardDialogs({
  currentUserIdentifier,
  currentUserRole,
  onBenefitClose,
  onConfigurationClose,
  onReviewSuccess,
  onReviewedApproval,
  onReviewedBenefit,
  selectedApprovalRequest,
  selectedBenefitRequest,
}: RequestsBoardDialogsProps) {
  return (
    <>
      {renderApprovalDialog({
        currentUserIdentifier,
        currentUserRole,
        onClose: onConfigurationClose,
        onReviewSuccess,
        onReviewed: onReviewedApproval,
        request: selectedApprovalRequest,
      })}
      {selectedBenefitRequest ? (
        <BenefitRequestReviewDialog
          currentUserIdentifier={currentUserIdentifier}
          currentUserRole={currentUserRole}
          onClose={onBenefitClose}
          onReviewed={onReviewedBenefit}
          request={selectedBenefitRequest}
        />
      ) : null}
    </>
  );
}

function renderApprovalDialog({
  currentUserIdentifier,
  currentUserRole,
  onClose,
  onReviewSuccess,
  onReviewed,
  request,
}: {
  currentUserIdentifier: string;
  currentUserRole: string;
  onClose: () => void;
  onReviewSuccess: (message: string | null) => void;
  onReviewed: () => Promise<unknown> | void;
  request: ApprovalRequestRecord | null;
}) {
  if (!request) {
    return null;
  }

  if (isOverrideApprovalRequest(request) && request.action_type === "update") {
    return (
      <DataUpdateRequestReviewDialog
        currentUserIdentifier={currentUserIdentifier}
        currentUserRole={currentUserRole}
        onClose={onClose}
        onReviewed={onReviewed}
        requestId={request.id}
      />
    );
  }

  if (isOverrideApprovalRequest(request)) {
    return (
      <OverrideRequestReviewDialog
        currentUserIdentifier={currentUserIdentifier}
        currentUserRole={currentUserRole}
        onClose={onClose}
        onReviewed={onReviewed}
        requestId={request.id}
      />
    );
  }

  if (request.entity_type === "rule" && request.action_type === "update") {
    return (
      <RuleApprovalRequestReviewDialog
        currentUserIdentifier={currentUserIdentifier}
        currentUserRole={currentUserRole}
        onClose={onClose}
        onReviewed={onReviewed}
        onReviewSuccess={onReviewSuccess}
        requestId={request.id}
      />
    );
  }

  return (
    <ApprovalRequestReviewDialog
      currentUserIdentifier={currentUserIdentifier}
      onClose={onClose}
      onReviewed={onReviewed}
      requestId={request.id}
    />
  );
}
