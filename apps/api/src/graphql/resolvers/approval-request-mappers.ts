import {
  ApprovalActionType,
  ApprovalEntityType,
  ApprovalRequestStatus,
  ApprovalRole,
  type ApprovalRequest,
} from "../generated/resolvers-types";

type ApprovalRequestRow = {
  id: string;
  entityType: "rule" | "benefit";
  entityId: string | null;
  actionType: "create" | "update";
  status: "pending" | "approved" | "rejected";
  targetRole: "hr_admin" | "finance_manager";
  requestedBy: string;
  reviewedBy: string | null;
  reviewComment: string | null;
  payloadJson: string;
  snapshotJson: string | null;
  createdAt: string;
  reviewedAt: string | null;
  isActive: boolean;
};

export function mapApprovalEntityType(value: ApprovalRequestRow["entityType"]): ApprovalEntityType {
  return value === "rule" ? ApprovalEntityType.Rule : ApprovalEntityType.Benefit;
}

export function mapApprovalActionType(value: ApprovalRequestRow["actionType"]): ApprovalActionType {
  return value === "create" ? ApprovalActionType.Create : ApprovalActionType.Update;
}

export function mapApprovalRequestStatus(value: ApprovalRequestRow["status"]): ApprovalRequestStatus {
  if (value === "approved") return ApprovalRequestStatus.Approved;
  if (value === "rejected") return ApprovalRequestStatus.Rejected;
  return ApprovalRequestStatus.Pending;
}

export function mapApprovalRole(value: ApprovalRequestRow["targetRole"]): ApprovalRole {
  return value === "finance_manager" ? ApprovalRole.FinanceManager : ApprovalRole.HrAdmin;
}

export function mapApprovalRequest(row: ApprovalRequestRow): ApprovalRequest {
  return {
    id: row.id,
    entity_type: mapApprovalEntityType(row.entityType),
    entity_id: row.entityId,
    action_type: mapApprovalActionType(row.actionType),
    status: mapApprovalRequestStatus(row.status),
    target_role: mapApprovalRole(row.targetRole),
    requested_by: row.requestedBy,
    reviewed_by: row.reviewedBy,
    review_comment: row.reviewComment,
    payload_json: row.payloadJson,
    snapshot_json: row.snapshotJson,
    created_at: row.createdAt,
    reviewed_at: row.reviewedAt,
    is_active: row.isActive,
  };
}
