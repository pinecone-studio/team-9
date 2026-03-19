import type {
  AuditLogsApprovalRequestRecord,
  AuditLogsBenefitRequestRecord,
  AuditLogsEmployeeRecord,
  AuditLogsPageDataQuery,
} from "./audit-logs.graphql";
import type { AuditLogEntry, AuditLogResult } from "./audit-log-types";
import {
  buildPeopleIndex,
  formatApprovalRole,
  formatBenefitRuleLabel,
  formatPersonLabel,
  parseAuditPayload,
  resolvePerson,
} from "./audit-log-people";

const EMPTY_VALUE = "—";

function formatLabel(value: string | null | undefined) {
  if (!value?.trim()) {
    return EMPTY_VALUE;
  }

  return value
    .trim()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseJsonObject(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getRuleCategoryLabel(categoryId: string | null | undefined, ruleType: string | null | undefined) {
  const normalizedRuleType = ruleType?.trim().toLowerCase() ?? "";
  if (normalizedRuleType === "tenure_days") return "Tenure";
  if (normalizedRuleType === "okr_submitted") return "Performance";
  if (normalizedRuleType === "attendance") return "Performance";
  if (normalizedRuleType === "responsibility_level") return "Performance";
  if (normalizedRuleType === "employment_status") return "Status";
  if (normalizedRuleType === "role") return "Role";
  if (categoryId === "cat_gate_rules") return "Gate Rules";
  if (categoryId === "cat_threshold_rules") return "Performance";
  if (categoryId === "cat_tenure_rules") return "Tenure";
  if (categoryId === "cat_level_rules") return "Performance";
  return formatLabel(ruleType);
}

function getRuleSourceFieldLabel(
  optionsJson: string | null | undefined,
  ruleType: string | null | undefined,
  unit: string | null | undefined,
) {
  const options = parseJsonObject(optionsJson);
  if (typeof options?.configLabel === "string" && options.configLabel.trim()) {
    return options.configLabel
      .trim()
      .replace(/\bokr\b/gi, "OKR")
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }

  const normalizedRuleType = ruleType?.trim().toLowerCase() ?? "";
  if (normalizedRuleType === "tenure_days") {
    if (unit?.trim().toLowerCase() === "months") return "Employment Months";
    if (unit?.trim().toLowerCase() === "years") return "Employment Years";
    return "Employment Days";
  }
  if (normalizedRuleType === "okr_submitted") return "OKR Submitted";

  return formatLabel(ruleType);
}

function formatRuleRequirementValue(
  ruleType: string | null | undefined,
  operator: string | null | undefined,
  rawValue: string | null | undefined,
  unit: string | null | undefined,
) {
  const parsedValue = (() => {
    if (!rawValue) return EMPTY_VALUE;
    try {
      const value = JSON.parse(rawValue) as unknown;
      if (typeof value === "string" || typeof value === "number") return String(value);
      if (typeof value === "boolean") return value ? "Yes" : "No";
      if (Array.isArray(value)) return value.join(", ");
      return rawValue;
    } catch {
      return rawValue;
    }
  })();
  const suffix = unit?.trim() ? (unit.trim() === "%" ? "%" : ` ${unit.trim()}`) : "";
  const normalizedOperator = operator?.trim().toLowerCase() ?? "";
  const normalizedRuleType = ruleType?.trim().toLowerCase() ?? "";

  if (normalizedRuleType === "okr_submitted") {
    if (parsedValue === "Yes") return "Required";
    if (parsedValue === "No") return "Not Required";
  }

  if (normalizedRuleType === "tenure_days") {
    if (normalizedOperator === "gte" || normalizedOperator === "gt") {
      return `${parsedValue}${suffix} minimum`;
    }
    if (normalizedOperator === "lte" || normalizedOperator === "lt") {
      return `${parsedValue}${suffix} maximum`;
    }
  }

  if (normalizedOperator === "gte" || normalizedOperator === "gt") {
    return `Above ${parsedValue}${suffix}`;
  }
  if (normalizedOperator === "lte" || normalizedOperator === "lt") {
    return `Below ${parsedValue}${suffix}`;
  }
  if (normalizedOperator === "neq" || normalizedOperator === "not_in") {
    return `Not ${parsedValue}${suffix}`;
  }

  return `${parsedValue}${suffix}`;
}

function parseRuleTargetBenefits(
  snapshotJson: string | null | undefined,
  payloadBenefits: Array<{ name?: string | null }> | undefined,
) {
  if (Array.isArray(payloadBenefits) && payloadBenefits.length > 0) {
    return payloadBenefits
      .map((benefit) => benefit.name?.trim())
      .filter((name): name is string => Boolean(name));
  }

  const snapshot = parseJsonObject(snapshotJson);
  const linkedBenefitsJson = snapshot?.linked_benefits_json;
  if (typeof linkedBenefitsJson !== "string") {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(linkedBenefitsJson) as Array<{ name?: unknown }>;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .map((benefit) => (typeof benefit?.name === "string" ? benefit.name.trim() : ""))
      .filter(Boolean);
  } catch {
    return [];
  }
}

function formatPercentageValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${value}%`;
  }

  if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();
    return trimmed.endsWith("%") ? trimmed : `${trimmed}%`;
  }

  return EMPTY_VALUE;
}

function formatCurrencyValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `$${value}`;
  }

  if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();
    return trimmed.startsWith("$") ? trimmed : `$${trimmed}`;
  }

  return EMPTY_VALUE;
}

function resolveBenefitMonthlyValue(
  benefit: {
    monthlyAmount?: number | string | null;
    monthlyCap?: number | string | null;
    monthly_amount?: number | string | null;
    monthly_cap?: number | string | null;
  } | null | undefined,
) {
  return (
    benefit?.monthlyAmount ??
    benefit?.monthly_amount ??
    benefit?.monthlyCap ??
    benefit?.monthly_cap ??
    null
  );
}

function parseBenefitRuleNames(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .map((rule) => {
      if (typeof rule === "string") return rule.trim();
      if (rule && typeof rule === "object" && "name" in rule && typeof rule.name === "string") {
        return rule.name.trim();
      }
      return "";
    })
    .filter(Boolean);
}

function extractBenefitSnapshot(snapshotJson: string | null | undefined) {
  const snapshot = parseJsonObject(snapshotJson);
  if (!snapshot) {
    return null;
  }

  return {
    approvalRole:
      typeof snapshot.approvalRole === "string"
        ? snapshot.approvalRole
        : typeof snapshot.approval_role === "string"
          ? snapshot.approval_role
          : null,
    attachedRules: parseBenefitRuleNames(
      snapshot.linkedRules ?? snapshot.attachedRules ?? snapshot.rulesApplied ?? snapshot.rules,
    ),
    category: typeof snapshot.category === "string" ? snapshot.category : null,
    description: typeof snapshot.description === "string" ? snapshot.description : null,
    monthlyCap: resolveBenefitMonthlyValue({
      monthlyAmount:
        typeof snapshot.monthlyAmount === "number" || typeof snapshot.monthlyAmount === "string"
          ? snapshot.monthlyAmount
          : null,
      monthlyCap:
        typeof snapshot.monthlyCap === "number" || typeof snapshot.monthlyCap === "string"
          ? snapshot.monthlyCap
          : null,
      monthly_amount:
        typeof snapshot.monthly_amount === "number" || typeof snapshot.monthly_amount === "string"
          ? snapshot.monthly_amount
          : null,
      monthly_cap:
        typeof snapshot.monthly_cap === "number" || typeof snapshot.monthly_cap === "string"
          ? snapshot.monthly_cap
          : null,
    }),
    name: typeof snapshot.name === "string" ? snapshot.name : null,
    requiresContract:
      typeof snapshot.requiresContract === "boolean"
        ? snapshot.requiresContract
        : typeof snapshot.requires_contract === "boolean"
          ? snapshot.requires_contract
          : null,
    subsidyPercentage:
      snapshot.subsidyPercentage ??
      snapshot.subsidyPercent ??
      snapshot.subsidy_percentage ??
      null,
    vendorName:
      typeof snapshot.vendorName === "string"
        ? snapshot.vendorName
        : typeof snapshot.vendor_name === "string"
          ? snapshot.vendor_name
          : null,
  };
}

function extractRuleSnapshot(snapshotJson: string | null | undefined) {
  const snapshot = parseJsonObject(snapshotJson);
  if (!snapshot) {
    return null;
  }

  return {
    description: typeof snapshot.description === "string" ? snapshot.description : null,
    defaultOperator:
      typeof snapshot.defaultOperator === "string" ? snapshot.defaultOperator : null,
    defaultUnit: typeof snapshot.defaultUnit === "string" ? snapshot.defaultUnit : null,
    defaultValue:
      typeof snapshot.defaultValue === "string" ? snapshot.defaultValue : null,
  };
}

function createEntry(entry: AuditLogEntry) {
  return entry;
}

function buildBenefitRequestEntries(
  request: AuditLogsBenefitRequestRecord,
  peopleIndex: Map<string, AuditLogsEmployeeRecord>,
) {
  const employeeName = request.employee.name.trim();
  const benefitRule = formatBenefitRuleLabel(
    request.benefit.title,
    request.benefit.vendorName,
  );
  const requester = resolvePerson(request.employee.id, peopleIndex, request.employee.position);
  const entries = [
    createEntry({
      actor: "user",
      benefitRule,
      benefitRequestDetail: request,
      employee: employeeName,
      event: "Benefit Requested",
      id: `${request.id}-submitted`,
      occurredAt: request.created_at,
      performedBy: { name: requester.name, role: requester.role },
      result: "Submitted",
      reviewedBy: EMPTY_VALUE,
    }),
  ];

  if (request.status === "approved" || request.status === "rejected") {
    const reviewer = request.reviewed_by
      ? resolvePerson(request.reviewed_by.id, peopleIndex, request.reviewed_by.position)
      : resolvePerson(null, peopleIndex, "Admin");
    entries.push(
      createEntry({
        actor: reviewer.actor,
        benefitRule,
        benefitRequestDetail: request,
        employee: employeeName,
        event: `Benefit Request ${request.status === "approved" ? "Approved" : "Rejected"}`,
        id: `${request.id}-${request.status}`,
        occurredAt: request.updated_at,
        performedBy: { name: reviewer.name, role: reviewer.role },
        result: request.status === "approved" ? "Approved" : "Rejected",
        reviewedBy: reviewer.name,
      }),
    );
  }

  if (request.status === "cancelled") {
    entries.push(
      createEntry({
        actor: "user",
        benefitRule,
        benefitRequestDetail: request,
        employee: employeeName,
        event: "Benefit Request Cancelled",
        id: `${request.id}-cancelled`,
        occurredAt: request.updated_at,
        performedBy: { name: requester.name, role: requester.role },
        result: "Cancelled",
        reviewedBy: EMPTY_VALUE,
      }),
    );
  }

  return entries;
}

function buildApprovalEvent(
  request: AuditLogsApprovalRequestRecord,
  result: Exclude<AuditLogResult, "Cancelled">,
  hasEmployeeRequest: boolean,
) {
  if (hasEmployeeRequest) return `Benefit Activation ${result}`;
  const entity = request.entity_type === "benefit" ? "Benefit" : "Rule";
  if (request.action_type === "create") return `New ${entity} ${result}`;
  return `${entity} ${request.action_type === "update" ? "Update" : "Delete"} ${result}`;
}

function buildApprovalBenefitRequestDetail(
  request: AuditLogsApprovalRequestRecord,
  peopleIndex: Map<string, AuditLogsEmployeeRecord>,
) {
  if (
    request.entity_type !== "benefit" ||
    (request.status !== "approved" && request.status !== "rejected")
  ) {
    return null;
  }

  const payload = parseAuditPayload(request.payload_json);
  const employeeRequest = payload?.employeeRequest;
  if (!employeeRequest) {
    return null;
  }

  const employeeKey =
    employeeRequest.employeeId?.trim().toLowerCase() ||
    employeeRequest.employeeEmail?.trim().toLowerCase() ||
    employeeRequest.employeeName?.trim().toLowerCase() ||
    "";
  const employeeRecord = employeeKey ? peopleIndex.get(employeeKey) : null;
  const reviewer = resolvePerson(
    request.reviewed_by,
    peopleIndex,
    formatApprovalRole(request.target_role),
  );

  return {
    approval_role: request.target_role,
    benefit: {
      category: payload?.benefit?.category?.trim() || EMPTY_VALUE,
      id: payload?.benefit?.id?.trim() || request.entity_id || EMPTY_VALUE,
      requiresContract: Boolean(payload?.benefit?.requiresContract),
      subsidyPercentage: formatPercentageValue(
        payload?.benefit?.subsidyPercentage ?? payload?.benefit?.subsidyPercent,
      ),
      title: payload?.benefit?.name?.trim() || "Untitled Benefit",
      vendorName: payload?.benefit?.vendorName?.trim() || null,
    },
    contractAcceptedAt: null,
    created_at: request.created_at,
    employee: {
      department: employeeRecord?.department?.trim() || EMPTY_VALUE,
      email: employeeRecord?.email?.trim() || employeeRequest.employeeEmail?.trim() || EMPTY_VALUE,
      id: employeeRecord?.id?.trim() || employeeRequest.employeeId?.trim() || EMPTY_VALUE,
      name:
        employeeRecord?.name?.trim() ||
        employeeRequest.employeeName?.trim() ||
        formatPersonLabel(employeeRequest.employeeEmail ?? employeeRequest.employeeId),
      position: employeeRecord?.position?.trim() || EMPTY_VALUE,
    },
    id: request.id,
    reviewComment: request.review_comment,
    reviewed_by: {
      email: request.reviewed_by?.trim() || null,
      id: request.reviewed_by?.trim() || null,
      name: reviewer.name,
      position: formatApprovalRole(request.target_role),
    },
    status: request.status,
    updated_at: request.reviewed_at ?? request.created_at,
  };
}

function buildBenefitApprovalDetail(
  request: AuditLogsApprovalRequestRecord,
  peopleIndex: Map<string, AuditLogsEmployeeRecord>,
) {
  if (
    request.entity_type !== "benefit" ||
    (request.status !== "approved" && request.status !== "rejected")
  ) {
    return null;
  }

  const payload = parseAuditPayload(request.payload_json);
  if (payload?.employeeRequest) {
    return null;
  }

  const reviewer = resolvePerson(
    request.reviewed_by,
    peopleIndex,
    formatApprovalRole(request.target_role),
  );
  const requester = resolvePerson(
    request.requested_by,
    peopleIndex,
    formatApprovalRole(request.target_role),
  );
  const snapshot = extractBenefitSnapshot(request.snapshot_json);
  const attachedRules = parseBenefitRuleNames(
    payload?.benefit?.linkedRules ?? snapshot?.attachedRules,
  );
  const currentSubsidyPercentage = formatPercentageValue(
    payload?.benefit?.subsidyPercentage ??
      payload?.benefit?.subsidyPercent ??
      snapshot?.subsidyPercentage,
  );
  const currentMonthlyCap = formatCurrencyValue(
    resolveBenefitMonthlyValue(payload?.benefit) ?? snapshot?.monthlyCap,
  );
  const previousSubsidyPercentage = snapshot
    ? formatPercentageValue(snapshot.subsidyPercentage)
    : null;
  const previousMonthlyCap = snapshot ? formatCurrencyValue(snapshot.monthlyCap) : null;

  return {
    actionType: request.action_type,
    approverRole:
      payload?.benefit?.approvalRole?.trim() ||
      snapshot?.approvalRole?.trim() ||
      reviewer.role,
    attachedRules,
    category:
      payload?.benefit?.category?.trim() ||
      snapshot?.category?.trim() ||
      EMPTY_VALUE,
    decisionAt: request.reviewed_at ?? request.created_at,
    description:
      payload?.benefit?.description?.trim() ||
      snapshot?.description?.trim() ||
      EMPTY_VALUE,
    monthlyCap: currentMonthlyCap,
    name: payload?.benefit?.name?.trim() || snapshot?.name?.trim() || "Untitled Benefit",
    previousMonthlyCap,
    previousSubsidyPercentage,
    requiresContract:
      payload?.benefit?.requiresContract ?? snapshot?.requiresContract ?? false,
    reviewComment: request.review_comment,
    reviewedBy: {
      name: reviewer.name,
      role: reviewer.role,
    },
    subsidyPercentage: currentSubsidyPercentage,
    submittedAt: request.created_at,
    submittedBy: {
      name: requester.name,
      role: requester.role,
    },
    vendorName:
      payload?.benefit?.vendorName?.trim() ||
      snapshot?.vendorName?.trim() ||
      EMPTY_VALUE,
  };
}

function buildRuleApprovalDetail(
  request: AuditLogsApprovalRequestRecord,
  peopleIndex: Map<string, AuditLogsEmployeeRecord>,
) {
  if (
    request.entity_type !== "rule" ||
    (request.status !== "approved" && request.status !== "rejected")
  ) {
    return null;
  }

  const payload = parseAuditPayload(request.payload_json);
  const reviewer = resolvePerson(
    request.reviewed_by,
    peopleIndex,
    formatApprovalRole(request.target_role),
  );
  const requester = resolvePerson(
    request.requested_by,
    peopleIndex,
    formatApprovalRole(request.target_role),
  );
  const snapshot = extractRuleSnapshot(request.snapshot_json);

  return {
    actionType: request.action_type,
    blockingMessage: payload?.rule?.description?.trim() || EMPTY_VALUE,
    category: getRuleCategoryLabel(payload?.rule?.categoryId, payload?.rule?.ruleType),
    decisionAt: request.reviewed_at ?? request.created_at,
    name: payload?.rule?.name?.trim() || "Untitled Rule",
    requirementValue: formatRuleRequirementValue(
      payload?.rule?.ruleType,
      payload?.rule?.defaultOperator,
      payload?.rule?.defaultValue,
      payload?.rule?.defaultUnit,
    ),
    previousRequirementValue: (() => {
      if (!snapshot) {
        return null;
      }

      return formatRuleRequirementValue(
        payload?.rule?.ruleType,
        snapshot.defaultOperator,
        snapshot.defaultValue,
        snapshot.defaultUnit,
      );
    })(),
    previousBlockingMessage: snapshot?.description?.trim() || (snapshot ? EMPTY_VALUE : null),
    reviewComment: request.review_comment,
    reviewedBy: {
      name: reviewer.name,
      role: formatApprovalRole(request.target_role),
    },
    sourceField: getRuleSourceFieldLabel(
      payload?.rule?.optionsJson,
      payload?.rule?.ruleType,
      payload?.rule?.defaultUnit,
    ),
    submittedAt: request.created_at,
    submittedBy: {
      name: requester.name,
      role: requester.role,
    },
    targetBenefits: (() => {
      const benefits = parseRuleTargetBenefits(request.snapshot_json, payload?.rule?.linkedBenefits);
      if (benefits.length > 0) {
        return benefits;
      }

      return request.action_type === "update" ? ["All Benefits"] : [];
    })(),
  };
}

function buildApprovalRequestEntries(
  request: AuditLogsApprovalRequestRecord,
  peopleIndex: Map<string, AuditLogsEmployeeRecord>,
) {
  const payload = parseAuditPayload(request.payload_json);
  const hasEmployeeRequest = Boolean(payload?.employeeRequest);
  const benefitRequestDetail = buildApprovalBenefitRequestDetail(
    request,
    peopleIndex,
  );
  const benefitApprovalDetail = buildBenefitApprovalDetail(request, peopleIndex);
  const ruleApprovalDetail = buildRuleApprovalDetail(request, peopleIndex);
  const benefitRule =
    request.entity_type === "benefit"
      ? payload?.benefit?.name?.trim() || "Untitled Benefit"
      : payload?.rule?.name?.trim() || "Untitled Rule";
  const employee =
    payload?.employeeRequest?.employeeName?.trim() ||
    formatPersonLabel(payload?.employeeRequest?.employeeEmail ?? payload?.employeeRequest?.employeeId);
  const requester = resolvePerson(
    request.requested_by,
    peopleIndex,
    formatApprovalRole(request.target_role),
  );
  const entries = [
    createEntry({
      actor: requester.actor,
      benefitApprovalDetail,
      benefitRule,
      benefitRequestDetail,
      employee,
      event: buildApprovalEvent(request, "Submitted", hasEmployeeRequest),
      id: `${request.id}-submitted`,
      occurredAt: request.created_at,
      performedBy: { name: requester.name, role: requester.role },
      result: "Submitted",
      reviewedBy: EMPTY_VALUE,
      ruleApprovalDetail,
    }),
  ];

  if (request.status !== "pending") {
    const reviewer = resolvePerson(
      request.reviewed_by,
      peopleIndex,
      formatApprovalRole(request.target_role),
    );
    const result = request.status === "approved" ? "Approved" : "Rejected";
    entries.push(
      createEntry({
        actor: "admin",
        benefitApprovalDetail,
        benefitRule,
        benefitRequestDetail,
        employee,
        event: buildApprovalEvent(request, result, hasEmployeeRequest),
        id: `${request.id}-${request.status}`,
        occurredAt: request.reviewed_at ?? request.created_at,
        performedBy: { name: reviewer.name, role: reviewer.role },
        result,
        reviewedBy: reviewer.name,
        ruleApprovalDetail,
      }),
    );
  }

  return entries;
}

export function buildAuditLogEntries(data?: AuditLogsPageDataQuery) {
  const peopleIndex = buildPeopleIndex(data?.employees);
  return [...(data?.benefitRequests ?? []).flatMap((request) => buildBenefitRequestEntries(request, peopleIndex))]
    .concat((data?.approvalRequests ?? []).flatMap((request) => buildApprovalRequestEntries(request, peopleIndex)))
    .sort((left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime());
}
