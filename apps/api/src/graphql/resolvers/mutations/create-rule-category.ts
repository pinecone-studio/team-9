import { eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { ruleCategories } from '../../../db/schema/rule-categories';
import type { MutationCreateRuleCategoryArgs, RuleCategory } from '../../generated/resolvers-types';

export async function createRuleCategory(DB: D1Database, args: MutationCreateRuleCategoryArgs): Promise<RuleCategory> {
	const db = getDb({ DB });
	const name = args.input.name.trim();
	const description = args.input.description?.trim() ?? null;

	if (!name) {
		throw new Error('Rule category name is required');
	}

	const [existing] = await db
		.select({ id: ruleCategories.id })
		.from(ruleCategories)
		.where(eq(ruleCategories.name, name))
		.limit(1);

	if (existing) {
		throw new Error(`Rule category already exists: ${name}`);
	}

	const id = crypto.randomUUID();

	await db.insert(ruleCategories).values({
		id,
		name,
		description,
	});

	return {
		id,
		name,
		description,
	};
}
