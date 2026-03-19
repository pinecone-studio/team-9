export type AuditLogActor = "admin" | "user";

export type AuditLogResult = "Approved" | "Cancelled" | "Rejected" | "Submitted";

export type AuditLogBenefitRequestDetail = {
  approval_role: "finance_manager" | "hr_admin";
  benefit: {
    category: string;
    id: string;
    requiresContract: boolean;
    subsidyPercentage?: string | null;
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
    email?: string | null;
    id?: string | null;
    name: string;
    position: string;
  } | null;
  status: "approved" | "cancelled" | "pending" | "rejected";
  updated_at: string;
};

export type AuditLogBenefitApprovalDetail = {
  actionType: "create" | "delete" | "update";
  approverRole: string;
  attachedRules: string[];
  category: string;
  decisionAt: string;
  description: string;
  monthlyCap?: string | null;
  name: string;
  previousMonthlyCap?: string | null;
  previousSubsidyPercentage?: string | null;
  requiresContract: boolean;
  reviewComment?: string | null;
  reviewedBy: {
    name: string;
    role: string;
  };
  subsidyPercentage: string;
  submittedAt: string;
  submittedBy: {
    name: string;
    role: string;
  };
  vendorName: string;
};

export type AuditLogRuleApprovalDetail = {
  actionType: "create" | "delete" | "update";
  blockingMessage: string;
  category: string;
  previousBlockingMessage?: string | null;
  previousRequirementValue?: string | null;
  decisionAt: string;
  name: string;
  requirementValue: string;
  reviewComment?: string | null;
  reviewedBy: {
    name: string;
    role: string;
  };
  sourceField: string;
  submittedAt: string;
  submittedBy: {
    name: string;
    role: string;
  };
  targetBenefits: string[];
};

export type AuditLogEntry = {
  actor: AuditLogActor;
  benefitApprovalDetail?: AuditLogBenefitApprovalDetail | null;
  benefitRule: string;
  benefitRequestDetail?: AuditLogBenefitRequestDetail | null;
  employee: string;
  event: string;
  id: string;
  occurredAt: string;
  performedBy: {
    name: string;
    role: string;
  };
  result: AuditLogResult;
  reviewedBy: string;
  ruleApprovalDetail?: AuditLogRuleApprovalDetail | null;
};

export type AuditLogSummary = {
  approved: number;
  rejected: number;
  submitted: number;
  totalActions: number;
};

export type AuditLogFilterOption = {
  label: string;
  value: string;
};

export type AuditLogFilters = {
  actor: string;
  event: string;
  result: string;
  search: string;
};
