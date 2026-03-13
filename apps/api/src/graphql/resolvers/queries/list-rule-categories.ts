import { asc } from 'drizzle-orm';

import { getDb } from '../../../db';
import { ruleCategories } from '../../../db/schema/rule-categories';
import type { RuleCategory } from '../../generated/resolvers-types';

export async function listRuleCategories(DB: D1Database): Promise<RuleCategory[]> {
	const db = getDb({ DB });

	const rows = await db
		.select({
			id: ruleCategories.id,
			name: ruleCategories.name,
			description: ruleCategories.description,
		})
		.from(ruleCategories)
		.orderBy(asc(ruleCategories.name));

	return rows.map((row) => ({
		id: row.id,
		name: row.name,
		description: row.description,
	}));
}
