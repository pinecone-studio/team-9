import { eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitCategories } from '../../../db/schema/benefit-categories';
import type { BenefitCategoryModel, CreateBenefitCategoryArgs } from '../../../types/employee';

export async function createBenefitCategory(DB: D1Database, args: CreateBenefitCategoryArgs): Promise<BenefitCategoryModel> {
	const db = getDb({ DB });
	const name = args.name.trim();

	if (!name) {
		throw new Error('Category name is required');
	}

	const [existing] = await db
		.select({
			id: benefitCategories.id,
			name: benefitCategories.name,
		})
		.from(benefitCategories)
		.where(eq(benefitCategories.name, name))
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
