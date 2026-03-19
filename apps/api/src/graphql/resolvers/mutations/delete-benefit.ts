import { eq } from "drizzle-orm";

import { getDb } from "../../../db";
import { benefits } from "../../../db/schema/benefits";
import { createAuditLogEntry } from "./create-audit-log-entry";

export async function deleteBenefit(DB: D1Database, id: string): Promise<boolean> {
  const db = getDb({ DB });

  const [benefit] = await db
    .select({
      id: benefits.id,
      isActive: benefits.isActive,
      name: benefits.name,
      vendorName: benefits.vendorName,
    })
    .from(benefits)
    .where(eq(benefits.id, id))
    .limit(1);

  if (!benefit) {
    return false;
  }

  if (!benefit.isActive) {
    return true;
  }

  await db.update(benefits).set({ isActive: false }).where(eq(benefits.id, id));
  await createAuditLogEntry(DB, {
    action: "submitted",
    entityType: "benefit_delete",
    metadata: {
      benefitId: benefit.id,
      benefitName: benefit.name,
      vendorName: benefit.vendorName,
    },
  });

  return true;
}
