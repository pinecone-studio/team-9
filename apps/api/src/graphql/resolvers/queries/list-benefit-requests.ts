import { and, desc, eq, inArray } from "drizzle-orm";

import { getDb } from "../../../db";
import { benefitRequests } from "../../../db/schema/benefit-requests";
import { benefits } from "../../../db/schema/benefits";
import { benefitCategories } from "../../../db/schema/benefit-categories";
import { employees } from "../../../db/schema/employees";
import { mapBenefitRecord, mapEmployeeRecord } from "../../../utils/mappers";
import type { ApprovalRole, BenefitRequest } from "../../generated/resolvers-types";

type ListBenefitRequestsArgs = {
  benefitId?: string | null;
  employeeId?: string | null;
  targetRole?: ApprovalRole | null;
};

export async function listBenefitRequests(
  DB: D1Database,
  args: ListBenefitRequestsArgs,
): Promise<BenefitRequest[]> {
  try {
    const db = getDb({ DB });
    const normalizedBenefitId = args.benefitId?.trim() || null;
    const normalizedEmployeeId = args.employeeId?.trim() || null;
    const requestRows = await db
      .select()
      .from(benefitRequests)
      .where(
        normalizedEmployeeId && normalizedBenefitId
          ? and(
              eq(benefitRequests.employeeId, normalizedEmployeeId),
              eq(benefitRequests.benefitId, normalizedBenefitId),
            )
          : normalizedEmployeeId
            ? eq(benefitRequests.employeeId, normalizedEmployeeId)
            : normalizedBenefitId
              ? eq(benefitRequests.benefitId, normalizedBenefitId)
              : undefined,
      )
      .orderBy(desc(benefitRequests.createdAt));

    if (requestRows.length === 0) {
      return [];
    }

    const employeeIds = Array.from(
      new Set(
        requestRows.flatMap((request) =>
          request.reviewedBy ? [request.employeeId, request.reviewedBy] : [request.employeeId],
        ),
      ),
    );
    const benefitIds = Array.from(new Set(requestRows.map((request) => request.benefitId)));

    const employeeRows = await db
      .select({
        department: employees.department,
        id: employees.id,
        name: employees.name,
        email: employees.email,
        employmentStatus: employees.employmentStatus,
        hireDate: employees.hireDate,
        lateArrivalCount: employees.lateArrivalCount,
        okrSubmitted: employees.okrSubmitted,
        role: employees.role,
        responsibilityLevel: employees.responsibilityLevel,
      })
      .from(employees)
      .where(inArray(employees.id, employeeIds));

    const benefitRows = await db
      .select({
        id: benefits.id,
        name: benefits.name,
        categoryId: benefits.categoryId,
        category: benefitCategories.name,
        approval_role: benefits.approvalRole,
        requires_contract: benefits.requiresContract,
        is_active: benefits.isActive,
        is_core: benefits.isCore,
        subsidy_percent: benefits.subsidyPercent,
        vendor_name: benefits.vendorName,
        description: benefits.description,
      })
      .from(benefits)
      .leftJoin(benefitCategories, eq(benefitCategories.id, benefits.categoryId))
      .where(inArray(benefits.id, benefitIds));

    const employeeMap = new Map(employeeRows.map((row) => [row.id, mapEmployeeRecord(row)]));
    const benefitMap = new Map(benefitRows.map((row) => [row.id, mapBenefitRecord(row)]));

    const mappedRequests: Array<BenefitRequest | null> = requestRows.map((request) => {
      try {
        const employee = employeeMap.get(request.employeeId);
        const benefit = benefitMap.get(request.benefitId);
        if (!employee || !benefit) {
          return null;
        }

        return {
          id: request.id,
          employee,
          benefit,
          status: String(request.status),
          contractVersionAccepted: request.contractVersionAccepted,
          contractAcceptedAt: request.contractAcceptedAt,
          created_at: request.createdAt,
          updated_at: request.updatedAt,
          reviewed_by: request.reviewedBy ? employeeMap.get(request.reviewedBy) ?? null : null,
          approval_role: benefit.approvalRole,
        } satisfies BenefitRequest;
      } catch (error) {
        console.error("[benefitRequests] Failed to map request row.", {
          error: error instanceof Error ? error.message : String(error),
          requestId: request.id,
        });
        return null;
      }
    });

    return mappedRequests.filter((request): request is BenefitRequest => {
      if (!request) return false;
      if (!args.targetRole) return true;
      return request.approval_role === args.targetRole;
    });
  } catch (error) {
    console.error("[benefitRequests] Failed to load benefit requests.", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}
