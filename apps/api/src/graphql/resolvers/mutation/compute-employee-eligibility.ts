import { eq } from 'drizzle-orm';
import { Env, getDb } from '../../../db';

import { employees } from '../../../db/schema/employees';
import { benefits } from '../../../db/schema/benefits';
import { eligibilityRules } from '../../../db/schema/eligibility-rules';
import { benefitEligibility } from '../../../db/schema/benefit-eligibility';

import { buildEmployeeMetrics } from '../../../utils/build-employee-metrics';
import { evaluateBenefit } from '../../../utils/eveluate-benefit';

export const computeEmployeeEligibility = async (env: Env, employeeId: string): Promise<void> => {
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

		for (const benefit of benefitList) {
			const rules = await db.select().from(eligibilityRules).where(eq(eligibilityRules.benefitId, benefit.id));

			const evaluation = evaluateBenefit(
				rules.map((rule) => ({
					id: rule.id,
					rule_type: rule.ruleType,
					operator: rule.operator,
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
					},
				});
		}
	} catch (error) {
		throw new Error(`Eligibility engine failed: ${(error as Error).message}`);
	}
};
