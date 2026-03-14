import { asc, eq, sql } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitCategories } from '../../../db/schema/benefit-categories';
import { benefitEligibility } from '../../../db/schema/benefit-eligibility';
import { benefitRules } from '../../../db/schema/benefit-rules';
import { benefits } from '../../../db/schema/benefits';
import { rules } from '../../../db/schema/rules';
import type { BenefitEligibilitySummary } from '../../generated/resolvers-types';

type EligibilityCounts = {
	blockedEmployees: number;
	eligibleEmployees: number;
	pendingEmployees: number;
};

function createDefaultCounts(): EligibilityCounts {
	return {
		blockedEmployees: 0,
		eligibleEmployees: 0,
		pendingEmployees: 0,
	};
}

export async function listBenefitEligibilitySummary(DB: D1Database): Promise<BenefitEligibilitySummary[]> {
	const db = getDb({ DB });

	const benefitsRows = await db
		.select({
			benefitId: benefits.id,
			benefitName: benefits.name,
			category: benefitCategories.name,
			subsidyPercent: benefits.subsidyPercent,
			isActive: benefits.isActive,
		})
		.from(benefits)
		.leftJoin(benefitCategories, eq(benefitCategories.id, benefits.categoryId))
		.orderBy(asc(benefits.name));

	const eligibilityRows = await db
		.select({
			benefitId: benefitEligibility.benefitId,
			status: benefitEligibility.status,
			count: sql<number>`count(*)`,
		})
		.from(benefitEligibility)
		.groupBy(benefitEligibility.benefitId, benefitEligibility.status);

	const benefitRuleRows = await db
		.select({
			benefitId: benefitRules.benefitId,
			ruleName: rules.name,
		})
		.from(benefitRules)
		.innerJoin(rules, eq(rules.id, benefitRules.ruleId))
		.where(eq(benefitRules.isActive, true))
		.orderBy(asc(rules.name));

	const countsByBenefit = new Map<string, EligibilityCounts>();
	for (const row of eligibilityRows) {
		const current = countsByBenefit.get(row.benefitId) ?? createDefaultCounts();
		const count = Number(row.count ?? 0);

		if (row.status === 'active' || row.status === 'eligible') {
			current.eligibleEmployees += count;
		} else if (row.status === 'locked') {
			current.blockedEmployees += count;
		} else if (row.status === 'pending') {
			current.pendingEmployees += count;
		}

		countsByBenefit.set(row.benefitId, current);
	}

	const rulesByBenefit = new Map<string, string[]>();
	for (const row of benefitRuleRows) {
		const current = rulesByBenefit.get(row.benefitId) ?? [];
		if (!current.includes(row.ruleName)) {
			current.push(row.ruleName);
		}
		rulesByBenefit.set(row.benefitId, current);
	}

	return benefitsRows.map((benefit) => {
		const counts = countsByBenefit.get(benefit.benefitId) ?? createDefaultCounts();

		return {
			benefitId: benefit.benefitId,
			benefitName: benefit.benefitName,
			category: benefit.category ?? 'General',
			subsidyPercent: benefit.subsidyPercent,
			rulesApplied: rulesByBenefit.get(benefit.benefitId) ?? [],
			eligibleEmployees: counts.eligibleEmployees,
			blockedEmployees: counts.blockedEmployees,
			pendingEmployees: counts.pendingEmployees,
			status: benefit.isActive ? 'Active' : 'Inactive',
		};
	});
}
