import { and, eq, or } from "drizzle-orm";

import { getDb } from "../../../db";
import { benefitEligibility } from "../../../db/schema/benefit-eligibility";
import { benefitRequests } from "../../../db/schema/benefit-requests";
import { benefits } from "../../../db/schema/benefits";
import { contracts } from "../../../db/schema/contracts";
import { employees } from "../../../db/schema/employees";
import type {
  BenefitRequest,
  MutationSubmitEmployeeBenefitRequestArgs,
} from "../../generated/resolvers-types";
import {
  scheduleNotification,
  sendEmployeeBenefitRequestSubmittedNotification,
  type NotificationRuntime,
} from "../../../notifications";
import { listBenefitRequests } from "../queries/list-benefit-requests";

const ACTIVE_STATUS = "active";
const ELIGIBLE_STATUS = "eligible";
const PENDING_STATUS = "pending";

export async function submitEmployeeBenefitRequest(
  env: NotificationRuntime,
  args: MutationSubmitEmployeeBenefitRequestArgs,
): Promise<BenefitRequest> {
  const db = getDb({ DB: env.DB });
  const input = args.input;
  const benefitId = input.benefitId.trim();
  const employeeId = input.employeeId.trim();
  const requestedBy = input.requestedBy.trim();

  if (!benefitId) {
    throw new Error("benefitId is required");
  }
  if (!employeeId) {
    throw new Error("employeeId is required");
  }
  if (!requestedBy) {
    throw new Error("requestedBy is required");
  }

  try {
    const [requester] = await db
      .select({ id: employees.id })
      .from(employees)
      .where(
        or(
          eq(employees.id, requestedBy),
          eq(employees.email, requestedBy),
          eq(employees.name, requestedBy),
        ),
      )
      .limit(1);

    if (!requester) {
      throw new Error("Requester employee record not found");
    }
    if (requester.id !== employeeId) {
      throw new Error("Employees can only submit requests for themselves");
    }

    const [benefit] = await db
      .select({
        activeContractId: benefits.activeContractId,
        id: benefits.id,
        isActive: benefits.isActive,
        requiresContract: benefits.requiresContract,
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

    let contractAcceptedAt: string | null = null;
    let contractVersionAccepted: string | null = null;

    if (benefit.requiresContract) {
      const submittedAcceptedAt = args.input.contractAcceptedAt?.trim() || "";
      const submittedVersion = args.input.contractVersionAccepted?.trim() || "";

      if (!submittedAcceptedAt) {
        throw new Error("Contract acceptance is required for this benefit");
      }
      if (!submittedVersion) {
        throw new Error("Accepted contract version is required");
      }
      if (Number.isNaN(Date.parse(submittedAcceptedAt))) {
        throw new Error("Contract acceptance timestamp is invalid");
      }

      const [activeContract] = benefit.activeContractId
        ? await db
            .select({ version: contracts.version })
            .from(contracts)
            .where(eq(contracts.id, benefit.activeContractId))
            .limit(1)
        : await db
            .select({ version: contracts.version })
            .from(contracts)
            .where(
              and(
                eq(contracts.benefitId, benefitId),
                eq(contracts.isActive, true),
              ),
            )
            .limit(1);

      if (!activeContract) {
        throw new Error("No active contract is attached to this benefit");
      }
      if (activeContract.version !== submittedVersion) {
        throw new Error(
          "The contract has changed. Please reopen the benefit and review the latest version.",
        );
      }

      contractAcceptedAt = submittedAcceptedAt;
      contractVersionAccepted = activeContract.version;
    }

    const [eligibility] = await db
      .select({ status: benefitEligibility.status })
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
    if (eligibility.status === PENDING_STATUS) {
      throw new Error("You already have a pending activation request");
    }
    if (eligibility.status === ACTIVE_STATUS) {
      throw new Error("This benefit is already active for the employee");
    }
    if (eligibility.status !== ELIGIBLE_STATUS) {
      throw new Error("Only eligible benefits can be requested");
    }

    const [pendingRequest] = await db
      .select({ id: benefitRequests.id })
      .from(benefitRequests)
      .where(
        and(
          eq(benefitRequests.employeeId, employeeId),
          eq(benefitRequests.benefitId, benefitId),
          eq(benefitRequests.status, PENDING_STATUS),
        ),
      )
      .limit(1);

    if (pendingRequest) {
      throw new Error("You already have a pending activation request");
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.insert(benefitRequests).values({
      id,
      employeeId,
      benefitId,
      status: PENDING_STATUS,
      contractAcceptedAt,
      contractVersionAccepted,
      reviewedBy: null,
      createdAt: now,
      updatedAt: now,
    });

    try {
      await db
        .update(benefitEligibility)
        .set({
          computedAt: now,
          overrideBy: null,
          overrideExpiresAt: null,
          overrideReason: "Pending employee benefit activation request",
          status: PENDING_STATUS,
        })
        .where(
          and(
            eq(benefitEligibility.employeeId, employeeId),
            eq(benefitEligibility.benefitId, benefitId),
          ),
        );
    } catch (error) {
      await db.delete(benefitRequests).where(eq(benefitRequests.id, id));
      throw error;
    }

    const createdRequest = (await listBenefitRequests(env.DB, { employeeId })).find(
      (request) => request.id === id,
    );
    if (!createdRequest) {
      throw new Error("Submitted benefit request could not be loaded");
    }

    scheduleNotification(env, "employee_benefit_request_submitted", () =>
      sendEmployeeBenefitRequestSubmittedNotification(env, {
        approvalRole: createdRequest.approval_role,
        benefitTitle: createdRequest.benefit.title,
        employeeId: createdRequest.employee.id,
        employeeName: createdRequest.employee.name,
        requestId: createdRequest.id,
      }),
    );

    return createdRequest;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to submit employee benefit request.");
  }
}
