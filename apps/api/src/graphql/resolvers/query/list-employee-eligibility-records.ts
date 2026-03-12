import { asc, eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitEligibility } from '../../../db/schema/benefit-eligibility';
import { benefitCategories } from '../../../db/schema/benefit-categories';
import { benefits } from '../../../db/schema/benefits';
import { mapBenefitRecord } from '../../../utils/mappers';
import type { BenefitEligibilityModel } from '../../../types/employee';

export async function listEmployeeEligibilityRecords(DB: D1Database, employeeId: string): Promise<BenefitEligibilityModel[]> {
	const db = getDb({ DB });

	const rows = await db
		.select({
			id: benefits.id,
			name: benefits.name,
			categoryId: benefits.categoryId,
			category: benefitCategories.name,
			subsidy_percent: benefits.subsidyPercent,
			vendor_name: benefits.vendorName,
			status: benefitEligibility.status,
			ruleEvaluationJson: benefitEligibility.ruleEvaluationJson,
			computedAt: benefitEligibility.computedAt,
		})
		.from(benefitEligibility)
		.innerJoin(benefits, eq(benefits.id, benefitEligibility.benefitId))
		.leftJoin(benefitCategories, eq(benefitCategories.id, benefits.categoryId))
		.where(eq(benefitEligibility.employeeId, employeeId))
		.orderBy(asc(benefits.name));

	return rows.map((row) => ({
		benefit: mapBenefitRecord({
			id: String(row.id),
			name: row.name,
			categoryId: row.categoryId,
			category: row.category,
			subsidy_percent: row.subsidy_percent,
			vendor_name: row.vendor_name,
		}),
		status: row.status,
		ruleEvaluationJson: row.ruleEvaluationJson,
		computedAt: row.computedAt,
	}));
}
