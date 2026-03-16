import { sql } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitCategories } from '../../../db/schema/benefit-categories';
import type { BenefitCategory, MutationCreateBenefitCategoryArgs } from '../../generated/resolvers-types';

export async function createBenefitCategory(
	DB: D1Database,
	args: MutationCreateBenefitCategoryArgs,
): Promise<BenefitCategory> {
	const db = getDb({ DB });
	const name = args.name.replace(/\s+/g, ' ').trim();

	if (!name) {
		throw new Error('Category name is required');
	}

	const [existing] = await db
		.select({
			id: benefitCategories.id,
			name: benefitCategories.name,
		})
		.from(benefitCategories)
		.where(sql`lower(${benefitCategories.name}) = lower(${name})`)
		.limit(1);

	if (existing) {
		throw new Error(`Category already exists: ${name}`);
	}

	const id = crypto.randomUUID();

	await db.insert(benefitCategories).values({
		id,
		name,
	});

	return { id, name };
}
