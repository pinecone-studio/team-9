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
			approval_role: benefits.approvalRole,
			requires_contract: benefits.requiresContract,
			is_active: benefits.isActive,
			is_core: benefits.isCore,
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
			approval_role: row.approval_role,
			requires_contract: row.requires_contract,
			is_active: row.is_active,
			is_core: row.is_core,
			subsidy_percent: row.subsidy_percent,
			vendor_name: row.vendor_name,
		}),
	);
}
