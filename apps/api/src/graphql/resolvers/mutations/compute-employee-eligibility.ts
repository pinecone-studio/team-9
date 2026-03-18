import { eq } from 'drizzle-orm';
import { type DbEnv, getDb } from '../../../db';

import { employees } from '../../../db/schema/employees';
import { benefits } from '../../../db/schema/benefits';
import { benefitRules } from '../../../db/schema/benefit-rules';
import { rules } from '../../../db/schema/rules';
import { benefitEligibility } from '../../../db/schema/benefit-eligibility';

import { buildEmployeeMetrics } from '../../../utils/build-employee-metrics';
import { evaluateBenefit } from '../../../utils/eveluate-benefit';
import type { Operator, RuleType } from '../../generated/resolvers-types';

type ExistingEligibilityRow = {
	overrideBy: string | null;
	overrideExpiresAt: string | null;
	status: string;
};

function hasActiveOverride(record: ExistingEligibilityRow | undefined) {
	if (!record?.overrideBy) {
		return false;
	}

	if (!record.overrideExpiresAt) {
		return true;
	}

	const expiresAt = Date.parse(record.overrideExpiresAt);

	return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export const computeEmployeeEligibility = async (env: DbEnv, employeeId: string): Promise<void> => {
	try {
		const db = getDb(env);

		const [employee] = await db.select().from(employees).where(eq(employees.id, employeeId)).limit(1);

		if (!employee) {
			throw new Error('Employee not found');
		}

		const metrics = buildEmployeeMetrics({
			employment_status: employee.employmentStatus,
			okr_submitted: Number(employee.okrSubmitted),
			late_arrival_count: employee.lateArrivalCount,
			responsibility_level: employee.responsibilityLevel,
			role: employee.role,
			hire_date: employee.hireDate,
		});

		const benefitList = await db.select().from(benefits);
		const existingEligibilityRows = await db
			.select({
				benefitId: benefitEligibility.benefitId,
				overrideBy: benefitEligibility.overrideBy,
				overrideExpiresAt: benefitEligibility.overrideExpiresAt,
				status: benefitEligibility.status,
			})
			.from(benefitEligibility)
			.where(eq(benefitEligibility.employeeId, employeeId));
		const existingEligibilityByBenefit = new Map(
			existingEligibilityRows.map((row) => [row.benefitId, row]),
		);

		for (const benefit of benefitList) {
			const existingEligibility = existingEligibilityByBenefit.get(benefit.id);
			const shouldPreserveStatus =
				existingEligibility?.status === 'active' ||
				existingEligibility?.status === 'pending' ||
				hasActiveOverride(existingEligibility);

			if (shouldPreserveStatus) {
				continue;
			}

			const assignedRules = await db
				.select({
					id: benefitRules.id,
					ruleType: rules.ruleType,
					operator: benefitRules.operator,
					value: benefitRules.value,
					priority: benefitRules.priority,
				})
				.from(benefitRules)
				.innerJoin(rules, eq(rules.id, benefitRules.ruleId))
				.where(eq(benefitRules.benefitId, benefit.id));

			const orderedRules =
				assignedRules.length === 0 && benefit.isCore
					? [
							{
								id: `core-${benefit.id}`,
								ruleType: 'employment_status',
								operator: 'neq',
								value: JSON.stringify('terminated'),
								priority: 1,
							},
						]
					: assignedRules.sort((a, b) => a.priority - b.priority);

			const evaluation = evaluateBenefit(
				orderedRules.map((rule) => ({
					id: rule.id,
					rule_type: rule.ruleType as RuleType,
					operator: rule.operator as Operator,
					value: rule.value,
				})),
				metrics,
			);

			await db
				.insert(benefitEligibility)
				.values({
					employeeId,
					benefitId: benefit.id,
					status: evaluation.status,
					ruleEvaluationJson: JSON.stringify(evaluation.results),
					computedAt: new Date().toISOString(),
				})
				.onConflictDoUpdate({
					target: [benefitEligibility.employeeId, benefitEligibility.benefitId],
					set: {
						status: evaluation.status,
						ruleEvaluationJson: JSON.stringify(evaluation.results),
						computedAt: new Date().toISOString(),
						overrideBy: null,
						overrideExpiresAt: null,
						overrideReason: null,
					},
				});
		}
	} catch (error) {
		throw new Error(`Eligibility engine failed: ${(error as Error).message}`);
	}
};
