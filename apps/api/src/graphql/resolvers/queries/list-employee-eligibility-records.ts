import { asc, eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitEligibility } from '../../../db/schema/benefit-eligibility';
import { benefitCategories } from '../../../db/schema/benefit-categories';
import { benefits } from '../../../db/schema/benefits';
import { mapBenefitRecord } from '../../../utils/mappers';
import type { BenefitEligibility } from '../../generated/resolvers-types';

export async function listEmployeeEligibilityRecords(DB: D1Database, employeeId: string): Promise<BenefitEligibility[]> {
	try {
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
			status: row.status,
			ruleEvaluationJson: row.ruleEvaluationJson,
			computedAt: row.computedAt,
		}));
	} catch (error) {
		throw new Error(
			`Failed to list employee eligibility records: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}
