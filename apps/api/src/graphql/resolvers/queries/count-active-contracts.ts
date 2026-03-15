import { count, eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { contracts } from '../../../db/schema/contracts';

export async function countActiveContracts(DB: D1Database): Promise<number> {
	const db = getDb({ DB });

	const [row] = await db.select({ count: count() }).from(contracts).where(eq(contracts.isActive, true));

	return Number(row?.count ?? 0);
}
