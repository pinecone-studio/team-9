import { and, asc, eq, inArray } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitEligibility } from '../../../db/schema/benefit-eligibility';
import { benefits } from '../../../db/schema/benefits';
import { mapBenefitRecord } from '../../../utils/mappers';
import type { BenefitModel } from '../../../types/employee';

export async function listEmployeeBenefits(DB: D1Database, employeeId: string): Promise<BenefitModel[]> {
	const db = getDb({ DB });
	const eligibleStatuses = ['active', 'eligible'] as const;

	const rows = await db
		.select({
			id: benefits.id,
			name: benefits.name,
			category: benefits.category,
			subsidy_percent: benefits.subsidyPercent,
			vendor_name: benefits.vendorName,
		})
		.from(benefitEligibility)
		.innerJoin(benefits, eq(benefits.id, benefitEligibility.benefitId))
		.where(
			and(eq(benefitEligibility.employeeId, employeeId), inArray(benefitEligibility.status, eligibleStatuses), eq(benefits.isActive, true)),
		)
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
