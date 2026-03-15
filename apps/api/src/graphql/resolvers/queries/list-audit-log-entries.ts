import { desc } from 'drizzle-orm';

import { getDb } from '../../../db';
import { auditLog } from '../../../db/schema/audit-log';
import type { AuditLogEntry } from '../../generated/resolvers-types';

function toIsoDate(value: Date | number): string {
	if (value instanceof Date) {
		return value.toISOString();
	}
	return new Date(value).toISOString();
}

export async function listAuditLogEntries(DB: D1Database, limit = 5): Promise<AuditLogEntry[]> {
	const db = getDb({ DB });
	const safeLimit = Math.max(1, Math.min(limit, 50));

	const rows = await db
		.select({
			id: auditLog.id,
			action: auditLog.action,
			entityType: auditLog.entityType,
			entityId: auditLog.entityId,
			metadata: auditLog.metadata,
			createdAt: auditLog.createdAt,
		})
		.from(auditLog)
		.orderBy(desc(auditLog.createdAt))
		.limit(safeLimit);

	return rows.map((row) => ({
		id: String(row.id),
		action: row.action,
		entityType: row.entityType,
		entityId: row.entityId === null ? null : String(row.entityId),
		metadata: row.metadata,
		createdAt: toIsoDate(row.createdAt),
	}));
}
