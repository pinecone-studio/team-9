import { and, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { approvalRequests } from "../../../db/schema/approval-requests";
import { benefitEligibility } from "../../../db/schema/benefit-eligibility";
import { benefits } from "../../../db/schema/benefits";
import {
  ApprovalActionType,
  ApprovalEntityType,
  ApprovalRole,
  ApprovalRequestStatus,
  type ApprovalRequest,
  type MutationCreateApprovalRequestArgs,
} from "../../generated/resolvers-types";
import { mapApprovalRequest } from "../approval-request-mappers";

type EmployeeBenefitRequestPayload = {
  benefitId?: unknown;
  employeeEmail?: unknown;
  employeeId?: unknown;
  employeeName?: unknown;
  requestedStatus?: unknown;
};

const EMPLOYEE_BENEFIT_REQUEST_STATUS = "active";
const EMPLOYEE_BENEFIT_RESTORE_STATUS = "eligible";

function parseEmployeeBenefitRequestPayload(
  payload: unknown,
): EmployeeBenefitRequestPayload | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;
  const employeeRequest = candidate.employeeRequest;

  if (!employeeRequest || typeof employeeRequest !== "object") {
    return null;
  }

  return employeeRequest as EmployeeBenefitRequestPayload;
}

function readTrimmedString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function createApprovalRequest(
  DB: D1Database,
  args: MutationCreateApprovalRequestArgs,
): Promise<ApprovalRequest> {
  const db = getDb({ DB });
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const input = args.input;

  const parsedPayload = JSON.parse(input.payloadJson) as unknown;
  if (input.snapshotJson) JSON.parse(input.snapshotJson);
  const status = ApprovalRequestStatus.Pending;
  const requestedBy = input.requestedBy.trim();
  let entityId = input.entityId?.trim() || null;
  let targetRole = input.targetRole;

  if (!requestedBy) {
    throw new Error("requestedBy is required");
  }

  const employeeRequest = parseEmployeeBenefitRequestPayload(parsedPayload);
  if (employeeRequest) {
    if (
      input.entityType !== ApprovalEntityType.Benefit ||
      input.actionType !== ApprovalActionType.Update
    ) {
      throw new Error(
        "Employee benefit activation requests must use benefit/update approval flow",
      );
    }

    const employeeId = readTrimmedString(employeeRequest.employeeId);
    const payloadBenefitId = readTrimmedString(employeeRequest.benefitId);
    const requestedStatus = readTrimmedString(employeeRequest.requestedStatus);
    const benefitId = payloadBenefitId ?? entityId;

    if (!employeeId) {
      throw new Error("employeeRequest.employeeId is required");
    }

    if (!benefitId) {
      throw new Error("employeeRequest.benefitId is required");
    }

    if (
      requestedStatus &&
      requestedStatus.toLowerCase() !== EMPLOYEE_BENEFIT_REQUEST_STATUS
    ) {
      throw new Error("Employee requests can only request active status");
    }

    if (entityId && entityId !== benefitId) {
      throw new Error("entityId and employeeRequest.benefitId must match");
    }

    const [benefit] = await db
      .select({
        approvalRole: benefits.approvalRole,
        id: benefits.id,
        isActive: benefits.isActive,
      })
      .from(benefits)
      .where(eq(benefits.id, benefitId))
      .limit(1);

    if (!benefit) {
      throw new Error(`Benefit not found: ${benefitId}`);
    }

    if (!benefit.isActive) {
      throw new Error("This benefit is inactive and cannot be requested");
    }

    const [eligibility] = await db
      .select({
        status: benefitEligibility.status,
      })
      .from(benefitEligibility)
      .where(
        and(
          eq(benefitEligibility.employeeId, employeeId),
          eq(benefitEligibility.benefitId, benefitId),
        ),
      )
      .limit(1);

    if (!eligibility) {
      throw new Error(
        "Employee eligibility record not found for the selected benefit",
      );
    }

    if (eligibility.status === "pending") {
      throw new Error(
        "You already have a pending activation request for this benefit",
      );
    }

    if (eligibility.status === "active") {
      throw new Error("This benefit is already active for the employee");
    }

    if (eligibility.status !== EMPLOYEE_BENEFIT_RESTORE_STATUS) {
      throw new Error("Only eligible benefits can be requested");
    }

    entityId = benefitId;
    targetRole =
      benefit.approvalRole === "finance_manager"
        ? ApprovalRole.FinanceManager
        : ApprovalRole.HrAdmin;
  }

  await db.insert(approvalRequests).values({
    id,
    entityType: input.entityType,
    entityId,
    actionType: input.actionType,
    status,
    targetRole,
    requestedBy,
    payloadJson: input.payloadJson,
    snapshotJson: input.snapshotJson ?? null,
    createdAt: now,
    isActive: true,
  });

  if (employeeRequest && entityId) {
    const employeeId = readTrimmedString(employeeRequest.employeeId);

    if (!employeeId) {
      throw new Error("employeeRequest.employeeId is required");
    }

    try {
      await db
        .update(benefitEligibility)
        .set({
          computedAt: now,
          overrideBy: null,
          overrideExpiresAt: null,
          overrideReason: "Pending employee benefit activation request",
          status: "pending",
        })
        .where(
          and(
            eq(benefitEligibility.employeeId, employeeId),
            eq(benefitEligibility.benefitId, entityId),
          ),
        );
    } catch (error) {
      await db
        .delete(approvalRequests)
        .where(eq(approvalRequests.id, id));
      throw error;
    }
  }

  return mapApprovalRequest({
    id,
    entityType: input.entityType,
    entityId,
    actionType: input.actionType,
    status,
    targetRole,
    requestedBy,
    reviewedBy: null,
    reviewComment: null,
    payloadJson: input.payloadJson,
    snapshotJson: input.snapshotJson ?? null,
    createdAt: now,
    reviewedAt: null,
    isActive: true,
  });
}
