import { and, desc, eq } from "drizzle-orm";

import { getDb } from "../../../db";
import { approvalRequests } from "../../../db/schema/approval-requests";
import type {
  ApprovalRequest,
  ApprovalRequestStatus,
  ApprovalRole,
} from "../../generated/resolvers-types";
import { mapApprovalRequest } from "../approval-request-mappers";

export async function listApprovalRequests(
  DB: D1Database,
  args: { status?: ApprovalRequestStatus | null; targetRole?: ApprovalRole | null },
): Promise<ApprovalRequest[]> {
  try {
    const db = getDb({ DB });
    const filters = [];

    if (args.status) filters.push(eq(approvalRequests.status, args.status));
    if (args.targetRole) filters.push(eq(approvalRequests.targetRole, args.targetRole));

    const rows =
      filters.length > 0
        ? await db
            .select()
            .from(approvalRequests)
            .where(and(...filters))
            .orderBy(desc(approvalRequests.createdAt))
        : await db.select().from(approvalRequests).orderBy(desc(approvalRequests.createdAt));

    return rows.map(mapApprovalRequest);
  } catch (error) {
    throw new Error(
      `Failed to list approval requests: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
