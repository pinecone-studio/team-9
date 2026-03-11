import { asc, eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefits } from '../../../db/schema/benefits';
import { mapBenefitRecord } from '../../../utils/mappers';
import type { BenefitModel } from '../../../types/employee';

export async function listBenefitCatalog(DB: D1Database): Promise<BenefitModel[]> {
	const db = getDb({ DB });

	const rows = await db
		.select({
			id: benefits.id,
			name: benefits.name,
			category: benefits.category,
			subsidy_percent: benefits.subsidyPercent,
			vendor_name: benefits.vendorName,
		})
		.from(benefits)
		.where(eq(benefits.isActive, true))
		.orderBy(asc(benefits.name));

	return rows.map((row) =>
		mapBenefitRecord({
			id: String(row.id),
			name: row.name,
			category: row.category,
			subsidy_percent: row.subsidy_percent,
			vendor_name: row.vendor_name,
		}),
	);
}
