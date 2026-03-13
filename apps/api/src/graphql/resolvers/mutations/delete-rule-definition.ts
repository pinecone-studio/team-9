import { eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitRules } from '../../../db/schema/benefit-rules';
import { rules } from '../../../db/schema/rules';

export async function deleteRuleDefinition(DB: D1Database, id: string): Promise<boolean> {
	const db = getDb({ DB });
	const [existing] = await db
		.select({ id: rules.id })
		.from(rules)
		.where(eq(rules.id, id))
		.limit(1);

	if (!existing) {
		return false;
	}

	await db.delete(benefitRules).where(eq(benefitRules.ruleId, id));
	await db.delete(rules).where(eq(rules.id, id));

	return true;
}
