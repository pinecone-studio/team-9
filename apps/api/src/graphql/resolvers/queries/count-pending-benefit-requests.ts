import { count, eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitRequests } from '../../../db/schema/benefit-requests';

export async function countPendingBenefitRequests(DB: D1Database): Promise<number> {
	const db = getDb({ DB });

	const [row] = await db
		.select({ count: count() })
		.from(benefitRequests)
		.where(eq(benefitRequests.status, 'pending'));

	return Number(row?.count ?? 0);
}
