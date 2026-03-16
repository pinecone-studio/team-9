import { eq } from "drizzle-orm";

import { getDb } from "../../../db";
import { approvalRequests } from "../../../db/schema/approval-requests";
import type { ApprovalRequest } from "../../generated/resolvers-types";
import { mapApprovalRequest } from "../approval-request-mappers";

export async function getApprovalRequestById(
  DB: D1Database,
  id: string,
): Promise<ApprovalRequest | null> {
  const db = getDb({ DB });
  const [row] = await db
    .select()
    .from(approvalRequests)
    .where(eq(approvalRequests.id, id))
    .limit(1);

  if (!row) return null;

  return mapApprovalRequest(row);
}
