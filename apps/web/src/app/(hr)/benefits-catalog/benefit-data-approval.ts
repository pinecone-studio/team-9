import {
  ApprovalActionType,
  ApprovalEntityType,
  ApprovalRequestStatus,
  type ApprovalRequestsQuery,
} from "@/shared/apollo/generated";
import type {
  BenefitCatalogRecord,
  BenefitCategory,
  PendingBenefitRequest,
} from "./benefit-types";

type PendingCreateBenefitPayload = {
  benefit?: {
    approvalRole?: "finance_manager" | "hr_admin";
    categoryId?: string;
    description?: string;
    isCore?: boolean;
    name?: string;
    requiresContract?: boolean;
    subsidyPercent?: number;
    vendorName?: string | null;
  };
};

export function isArchivedBenefit(
  benefitId: string,
  approvalRequests: ApprovalRequestsQuery["approvalRequests"],
) {
  return approvalRequests.some(
    (request) =>
      request.entity_type === ApprovalEntityType.Benefit &&
      request.entity_id === benefitId &&
      request.action_type === ApprovalActionType.Delete &&
      request.status === ApprovalRequestStatus.Approved,
  );
}

export function getPendingBenefitRequest(
  benefitId: string,
  approvalRequests: ApprovalRequestsQuery["approvalRequests"],
) {
  return approvalRequests
    .filter(
      (request) =>
        request.entity_type === ApprovalEntityType.Benefit &&
        request.entity_id === benefitId &&
        request.status === ApprovalRequestStatus.Pending &&
        (request.action_type === ApprovalActionType.Update ||
          request.action_type === ApprovalActionType.Delete),
    )
    .sort((left, right) => right.created_at.localeCompare(left.created_at))[0];
}

function parsePendingCreateBenefitPayload(payloadJson: string) {
  try {
    return JSON.parse(payloadJson) as PendingCreateBenefitPayload;
  } catch {
    return null;
  }
}

function toPendingBenefitRequest(
  request: ApprovalRequestsQuery["approvalRequests"][number],
): PendingBenefitRequest {
  return {
    actionType: request.action_type,
    createdAt: request.created_at,
    id: request.id,
    requestedBy: request.requested_by,
    status: request.status,
    targetRole: request.target_role,
  };
}

export function getPendingBenefitCreateRecords(
  categories: BenefitCategory[],
  approvalRequests: ApprovalRequestsQuery["approvalRequests"],
): BenefitCatalogRecord[] {
  const categoryNameById = new Map(
    categories
      .map((category) => [category.id.trim(), category.name.trim()] as const)
      .filter(([categoryId, categoryName]) => categoryId && categoryName),
  );

  return approvalRequests
    .filter(
      (request) =>
        request.entity_type === ApprovalEntityType.Benefit &&
        request.action_type === ApprovalActionType.Create &&
        request.status === ApprovalRequestStatus.Pending,
    )
    .flatMap((request) => {
      const payload = parsePendingCreateBenefitPayload(request.payload_json);
      const benefit = payload?.benefit;
      const categoryId = benefit?.categoryId?.trim() ?? "";
      const title = benefit?.name?.trim() ?? "";
      const description = benefit?.description?.trim() ?? "";

      if (!categoryId || !title || !description) {
        return [];
      }

      return [{
        activeEmployees: 0,
        approvalRole: benefit?.approvalRole ?? request.target_role,
        category: categoryNameById.get(categoryId) ?? categoryId,
        categoryId,
        description,
        eligibleEmployees: 0,
        id: `pending-create-${request.id}`,
        isActive: true,
        isCore: Boolean(benefit?.isCore),
        pendingRequest: toPendingBenefitRequest(request),
        requiresContract: Boolean(benefit?.requiresContract),
        subsidyPercent:
          typeof benefit?.subsidyPercent === "number" ? benefit.subsidyPercent : null,
        title,
        vendorName: benefit?.vendorName?.trim() || null,
      } satisfies BenefitCatalogRecord];
    });
}
