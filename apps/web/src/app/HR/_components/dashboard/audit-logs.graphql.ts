import { gql } from "@apollo/client";

export type AuditLogsApprovalRequestRecord = {
  action_type: "create" | "delete" | "update";
  created_at: string;
  entity_id?: string | null;
  entity_type: "benefit" | "rule";
  id: string;
  payload_json: string;
  review_comment?: string | null;
  requested_by: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  snapshot_json?: string | null;
  status: "approved" | "pending" | "rejected";
  target_role: "finance_manager" | "hr_admin";
};

export type AuditLogsBenefitRequestRecord = {
  approval_role: "finance_manager" | "hr_admin";
  benefit: {
    category: string;
    id: string;
    requiresContract: boolean;
    title: string;
    vendorName?: string | null;
  };
  contractAcceptedAt?: string | null;
  created_at: string;
  employee: {
    department: string;
    email: string;
    id: string;
    name: string;
    position: string;
  };
  id: string;
  reviewComment?: string | null;
  reviewed_by?: {
    email: string;
    id: string;
    name: string;
    position: string;
  } | null;
  status: "approved" | "cancelled" | "pending" | "rejected";
  updated_at: string;
};

export type AuditLogsEmployeeRecord = {
  department: string;
  email: string;
  id: string;
  name: string;
  position: string;
};

export type AuditLogsDirectEntryRecord = {
  action: string;
  createdAt: string;
  entityId?: string | null;
  entityType: string;
  id: string;
  metadata?: string | null;
};

export type AuditLogsPageDataQuery = {
  approvalRequests: AuditLogsApprovalRequestRecord[];
  benefitRequests: AuditLogsBenefitRequestRecord[];
  employees?: AuditLogsEmployeeRecord[] | null;
  listAuditLogEntries: AuditLogsDirectEntryRecord[];
};

export const AUDIT_LOGS_PAGE_QUERY = gql`
  query AuditLogsPageData {
    approvalRequests {
      id
      entity_id
      entity_type
      action_type
      status
      target_role
      requested_by
      reviewed_by
      review_comment
      payload_json
      snapshot_json
      created_at
      reviewed_at
    }
    benefitRequests {
      id
      status
      approval_role
      contractAcceptedAt
      created_at
      updated_at
      employee {
        id
        name
        email
        position
        department
      }
      benefit {
        id
        title
        category
        requiresContract
        vendorName
      }
      reviewComment
      reviewed_by {
        id
        name
        email
        position
      }
    }
    employees {
      id
      name
      email
      position
      department
    }
    listAuditLogEntries(limit: 50) {
      id
      action
      entityType
      entityId
      metadata
      createdAt
    }
  }
`;
