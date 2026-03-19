export type AuditLogActor = "admin" | "user";

export type AuditLogResult = "Approved" | "Cancelled" | "Rejected" | "Submitted";

export type AuditLogEntry = {
  actor: AuditLogActor;
  benefitRule: string;
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
};
