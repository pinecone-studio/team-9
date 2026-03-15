import type { ApprovalRequestRecord } from "./approval-requests.graphql";

type BenefitPayload = {
  benefit?: {
    approvalRole?: string;
    categoryId?: string;
    description?: string;
    id?: string;
    isCore?: boolean;
    name?: string;
    requiresContract?: boolean;
    subsidyPercent?: number;
    vendorName?: string | null;
  };
  ruleAssignments?: Array<{
    errorMessage?: string;
    operator?: string;
    priority?: number;
    ruleId?: string;
    value?: string;
  }>;
};

type RulePayload = {
  rule?: {
    allowedOperators?: string[];
    categoryId?: string;
    defaultOperator?: string;
    defaultUnit?: string | null;
    defaultValue?: string | null;
    description?: string;
    id?: string;
    isActive?: boolean;
    name?: string;
    optionsJson?: string | null;
    ruleType?: string;
    valueType?: string;
  };
};

type ParsedApprovalRequest =
  | {
      entityType: "benefit";
      benefit: NonNullable<BenefitPayload["benefit"]> | null;
      ruleAssignments: NonNullable<BenefitPayload["ruleAssignments"]>;
    }
  | {
      entityType: "rule";
      rule: NonNullable<RulePayload["rule"]> | null;
    };

function parseJson<T>(value?: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function parseApprovalPayload(
  request: ApprovalRequestRecord,
): ParsedApprovalRequest {
  if (request.entity_type === "benefit") {
    const payload = parseJson<BenefitPayload>(request.payload_json);
    return {
      entityType: "benefit",
      benefit: payload?.benefit ?? null,
      ruleAssignments: payload?.ruleAssignments ?? [],
    };
  }

  const payload = parseJson<RulePayload>(request.payload_json);
  return {
    entityType: "rule",
    rule: payload?.rule ?? null,
  };
}

export function parseApprovalSnapshot(request: ApprovalRequestRecord) {
  return parseJson<Record<string, unknown>>(request.snapshot_json);
}

export function formatApprovalRole(role: ApprovalRequestRecord["target_role"]) {
  return role === "finance_manager" ? "Finance Manager" : "HR Admin";
}

export function formatApprovalAction(
  action: ApprovalRequestRecord["action_type"],
) {
  return action === "create" ? "Create" : "Update";
}

export function formatApprovalStatus(
  status: ApprovalRequestRecord["status"],
) {
  if (status === "approved") {
    return "Approved";
  }

  if (status === "rejected") {
    return "Rejected";
  }

  return "Pending";
}

export function formatApprovalRequestTitle(request: ApprovalRequestRecord) {
  const payload = parseApprovalPayload(request);

  if (payload.entityType === "benefit") {
    const name = payload.benefit?.name?.trim() || "Untitled Benefit";
    return `${formatApprovalAction(request.action_type)} Benefit`;
    void name;
  }

  return `${formatApprovalAction(request.action_type)} Rule`;
}

export function formatApprovalRequestName(request: ApprovalRequestRecord) {
  const payload = parseApprovalPayload(request);

  if (payload.entityType === "benefit") {
    return payload.benefit?.name?.trim() || "Untitled Benefit";
  }

  return payload.rule?.name?.trim() || "Untitled Rule";
}

export function formatRelativeTimestamp(value: string) {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return value;
  }

  const diffMs = Date.now() - timestamp;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < hour) {
    const minutes = Math.max(1, Math.round(diffMs / minute));
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (diffMs < day) {
    const hours = Math.max(1, Math.round(diffMs / hour));
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.max(1, Math.round(diffMs / day));
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function formatJsonLikeValue(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (typeof parsed === "string" || typeof parsed === "number") {
      return String(parsed);
    }

    if (Array.isArray(parsed)) {
      return parsed.join(", ");
    }

    return value;
  } catch {
    return value;
  }
}
