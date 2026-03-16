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
  employeeRequest?: {
    benefitId?: string;
    employeeEmail?: string | null;
    employeeId?: string;
    employeeName?: string;
    previousStatus?: string;
    requestedStatus?: string;
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

export type ParsedApprovalRequest =
  | {
      entityType: "benefit";
      benefit: NonNullable<BenefitPayload["benefit"]> | null;
      employeeRequest: NonNullable<BenefitPayload["employeeRequest"]> | null;
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
      employeeRequest: payload?.employeeRequest ?? null,
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
