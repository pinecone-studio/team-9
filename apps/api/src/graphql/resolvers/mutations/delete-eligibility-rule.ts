import { eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitRules } from '../../../db/schema/benefit-rules';

export async function deleteEligibilityRule(DB: D1Database, id: string): Promise<boolean> {
	const db = getDb({ DB });
	const [existing] = await db
		.select({
			id: benefitRules.id,
		})
		.from(benefitRules)
		.where(eq(benefitRules.id, id))
		.limit(1);

	if (!existing) {
		return false;
	}

	await db.delete(benefitRules).where(eq(benefitRules.id, id));

	return true;
}
