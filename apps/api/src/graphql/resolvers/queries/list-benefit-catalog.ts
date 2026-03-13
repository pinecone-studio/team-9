import { asc, eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitCategories } from '../../../db/schema/benefit-categories';
import { benefits } from '../../../db/schema/benefits';
import { mapBenefitRecord } from '../../../utils/mappers';
import type { Benefit } from '../../generated/resolvers-types';

export async function listBenefitCatalog(DB: D1Database): Promise<Benefit[]> {
	const db = getDb({ DB });

	const rows = await db
		.select({
			id: benefits.id,
			name: benefits.name,
			description: benefits.description,
			categoryId: benefits.categoryId,
			category: benefitCategories.name,
			is_active: benefits.isActive,
			subsidy_percent: benefits.subsidyPercent,
			vendor_name: benefits.vendorName,
		})
		.from(benefits)
		.leftJoin(benefitCategories, eq(benefitCategories.id, benefits.categoryId))
		.orderBy(asc(benefits.name));

	return rows.map((row) =>
		mapBenefitRecord({
			id: String(row.id),
			name: row.name,
			description: row.description,
			categoryId: row.categoryId,
			category: row.category,
			is_active: row.is_active,
			subsidy_percent: row.subsidy_percent,
			vendor_name: row.vendor_name,
		}),
	);
}
