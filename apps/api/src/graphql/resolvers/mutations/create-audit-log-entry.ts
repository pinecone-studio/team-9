import { getDb } from "../../../db";
import { auditLog } from "../../../db/schema/audit-log";

type CreateAuditLogEntryParams = {
  action: string;
  entityId?: number | null;
  entityType: string;
  metadata?: Record<string, unknown> | null;
};

export async function createAuditLogEntry(
  DB: D1Database,
  { action, entityId = null, entityType, metadata = null }: CreateAuditLogEntryParams,
) {
  const db = getDb({ DB });

  await db.insert(auditLog).values({
    action,
    actorId: null,
    createdAt: new Date(),
    entityId,
    entityType,
    metadata: metadata ? JSON.stringify(metadata) : null,
  });
}
