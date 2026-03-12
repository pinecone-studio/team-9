import { asc } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitCategories } from '../../../db/schema/benefit-categories';
import type { BenefitCategoryModel } from '../../../types/employee';

export async function listBenefitCategories(DB: D1Database): Promise<BenefitCategoryModel[]> {
	const db = getDb({ DB });

	const rows = await db
		.select({
			id: benefitCategories.id,
			name: benefitCategories.name,
		})
		.from(benefitCategories)
		.orderBy(asc(benefitCategories.name));

	return rows.map((row) => ({
		id: row.id,
		name: row.name,
	}));
}
