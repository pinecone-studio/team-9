import { asc, eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitCategories } from '../../../db/schema/benefit-categories';
import { benefits } from '../../../db/schema/benefits';
import { mapBenefitRecord } from '../../../utils/mappers';
import type { BenefitModel } from '../../../types/employee';

export async function listBenefitCatalog(DB: D1Database): Promise<BenefitModel[]> {
	const db = getDb({ DB });

	const rows = await db
		.select({
			id: benefits.id,
			name: benefits.name,
			categoryId: benefits.categoryId,
			category: benefitCategories.name,
			subsidy_percent: benefits.subsidyPercent,
			vendor_name: benefits.vendorName,
		})
		.from(benefits)
		.leftJoin(benefitCategories, eq(benefitCategories.id, benefits.categoryId))
		.where(eq(benefits.isActive, true))
		.orderBy(asc(benefits.name));

	return rows.map((row) =>
		mapBenefitRecord({
			id: String(row.id),
			name: row.name,
			categoryId: row.categoryId,
			category: row.category,
			subsidy_percent: row.subsidy_percent,
			vendor_name: row.vendor_name,
		}),
	);
}
