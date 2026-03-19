import type {
  AuditLogsApprovalRequestRecord,
  AuditLogsEmployeeRecord,
} from "./audit-logs.graphql";

const EMPTY_VALUE = "—";

export type AuditPayload = {
  benefit?: {
    approvalRole?: string;
    category?: string;
    description?: string | null;
    id?: string;
    linkedRules?: Array<{ name?: string | null } | string>;
    monthlyAmount?: number | string | null;
    monthlyCap?: number | string | null;
    monthly_amount?: number | string | null;
    monthly_cap?: number | string | null;
    name?: string | null;
    requiresContract?: boolean;
    subsidyPercent?: number | string | null;
    subsidyPercentage?: number | string | null;
    vendorName?: string | null;
  };
  employeeRequest?: { employeeEmail?: string | null; employeeId?: string; employeeName?: string };
  rule?: {
    categoryId?: string;
    defaultOperator?: string;
    defaultUnit?: string | null;
    defaultValue?: string | null;
    description?: string | null;
    linkedBenefits?: Array<{ name?: string | null }>;
    name?: string | null;
    optionsJson?: string | null;
    ruleType?: string | null;
  };
};

export function formatPersonLabel(value: string | null | undefined) {
  if (!value?.trim()) return EMPTY_VALUE;
  const base = value.includes("@") ? (value.split("@")[0] ?? value) : value;
  return base
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatApprovalRole(role: AuditLogsApprovalRequestRecord["target_role"]) {
  return role === "finance_manager" ? "Finance Manager" : "HR Admin";
}

export function parseAuditPayload(value: string | null | undefined) {
  if (!value) return null;
  try {
    return JSON.parse(value) as AuditPayload;
  } catch {
    return null;
  }
}

export function buildPeopleIndex(records: AuditLogsEmployeeRecord[] | null | undefined) {
  const entries = (records ?? []).flatMap((record) => {
    const keys = [record.id, record.email, record.name]
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    return keys.map((key) => [key, record] as const);
  });
  return new Map(entries);
}

export function resolvePerson(
  identifier: string | null | undefined,
  peopleIndex: Map<string, AuditLogsEmployeeRecord>,
  fallbackRole: string,
) {
  const normalized = identifier?.trim().toLowerCase() ?? "";
  const record = normalized ? peopleIndex.get(normalized) : null;
  const role = record?.position?.trim() || fallbackRole;
  return {
    actor: isAdminRole(role) ? "admin" : "user",
    name: record?.name?.trim() || formatPersonLabel(identifier),
    role,
  } as const;
}

export function formatBenefitRuleLabel(title: string, vendorName?: string | null) {
  return vendorName?.trim() ? `${title} - ${vendorName.trim()}` : title;
}

function isAdminRole(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase() ?? "";
  return ["admin", "finance", "director", "manager"].some((keyword) =>
    normalized.includes(keyword),
  );
}
