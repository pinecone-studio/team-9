import { eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitEligibility } from '../../../db/schema/benefit-eligibility';
import { benefitRules } from '../../../db/schema/benefit-rules';
import { benefits } from '../../../db/schema/benefits';
import { employees } from '../../../db/schema/employees';
import { rules } from '../../../db/schema/rules';
import { buildEmployeeMetrics } from '../../../utils/build-employee-metrics';
import { evaluateBenefit } from '../../../utils/eveluate-benefit';
import type { Operator, RuleType } from '../../generated/resolvers-types';

type BenefitDefinition = {
	id: string;
	isCore: boolean;
};

type BenefitRuleDefinition = {
	id: string;
	operator: string;
	priority: number;
	ruleType: string;
	value: string;
};

type EmployeeEligibilityRow = {
	employeeId: string;
	overrideBy: string | null;
	overrideExpiresAt: string | null;
	status: string;
};

type EmployeeSnapshot = {
	hireDate: string;
	id: string;
	lateArrivalCount: number;
	employmentStatus: string;
	okrSubmitted: boolean | number;
	responsibilityLevel: number;
	role: string;
};

export type BenefitEligibilityRecomputeResult = {
	employeeCount: number;
	preservedCount: number;
	recomputedCount: number;
};

function hasActiveOverride(record: Pick<EmployeeEligibilityRow, 'overrideBy' | 'overrideExpiresAt'> | undefined) {
	if (!record?.overrideBy) {
		return false;
	}

	if (!record.overrideExpiresAt) {
		return true;
	}

	const expiresAt = Date.parse(record.overrideExpiresAt);

	return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

function shouldPreserveEligibilityStatus(
	record: EmployeeEligibilityRow | undefined,
	employmentStatus: string,
) {
	if (employmentStatus.trim().toLowerCase() === 'terminated') {
		return record?.status === 'pending' || hasActiveOverride(record);
	}

	return record?.status === 'active' || record?.status === 'pending' || hasActiveOverride(record);
}

async function loadBenefitDefinition(DB: D1Database, benefitId: string): Promise<BenefitDefinition> {
	const db = getDb({ DB });
	const [benefit] = await db
		.select({
			id: benefits.id,
			isCore: benefits.isCore,
		})
		.from(benefits)
		.where(eq(benefits.id, benefitId))
		.limit(1);

	if (!benefit) {
		throw new Error(`Benefit not found: ${benefitId}`);
	}

	return benefit;
}

async function loadBenefitRules(
	DB: D1Database,
	benefit: BenefitDefinition,
): Promise<BenefitRuleDefinition[]> {
	const db = getDb({ DB });
	const assignedRules = await db
		.select({
			id: benefitRules.id,
			operator: benefitRules.operator,
			priority: benefitRules.priority,
			ruleType: rules.ruleType,
			value: benefitRules.value,
		})
		.from(benefitRules)
		.innerJoin(rules, eq(rules.id, benefitRules.ruleId))
		.where(eq(benefitRules.benefitId, benefit.id));

	if (assignedRules.length === 0 && benefit.isCore) {
		return [
			{
				id: `core-${benefit.id}`,
				operator: 'neq',
				priority: 1,
				ruleType: 'employment_status',
				value: JSON.stringify('terminated'),
			},
		];
	}

	return assignedRules.sort((left, right) => left.priority - right.priority);
}

async function loadEmployees(DB: D1Database): Promise<EmployeeSnapshot[]> {
	const db = getDb({ DB });

	return db
		.select({
			hireDate: employees.hireDate,
			id: employees.id,
			lateArrivalCount: employees.lateArrivalCount,
			employmentStatus: employees.employmentStatus,
			okrSubmitted: employees.okrSubmitted,
			responsibilityLevel: employees.responsibilityLevel,
			role: employees.role,
		})
		.from(employees);
}

async function loadExistingBenefitEligibility(
	DB: D1Database,
	benefitId: string,
): Promise<Map<string, EmployeeEligibilityRow>> {
	const db = getDb({ DB });
	const rows = await db
		.select({
			employeeId: benefitEligibility.employeeId,
			overrideBy: benefitEligibility.overrideBy,
			overrideExpiresAt: benefitEligibility.overrideExpiresAt,
			status: benefitEligibility.status,
		})
		.from(benefitEligibility)
		.where(eq(benefitEligibility.benefitId, benefitId));

	return new Map(rows.map((row) => [row.employeeId, row]));
}

async function persistEligibilityResult(
	DB: D1Database,
	employeeId: string,
	benefitId: string,
	computedAt: string,
	ruleEvaluationJson: string,
	status: 'eligible' | 'locked',
) {
	const db = getDb({ DB });

	await db
		.insert(benefitEligibility)
		.values({
			employeeId,
			benefitId,
			status,
			ruleEvaluationJson,
			computedAt,
		})
		.onConflictDoUpdate({
			target: [benefitEligibility.employeeId, benefitEligibility.benefitId],
			set: {
				status,
				ruleEvaluationJson,
				computedAt,
				overrideBy: null,
				overrideExpiresAt: null,
				overrideReason: null,
			},
		});
}

export async function listBenefitIdsForRule(DB: D1Database, ruleId: string): Promise<string[]> {
	const db = getDb({ DB });
	const rows = await db
		.select({
			benefitId: benefitRules.benefitId,
		})
		.from(benefitRules)
		.where(eq(benefitRules.ruleId, ruleId));

	return [...new Set(rows.map((row) => row.benefitId))];
}

export async function recomputeBenefitEligibilityForAllEmployees(
	DB: D1Database,
	benefitId: string,
): Promise<BenefitEligibilityRecomputeResult> {
	const benefit = await loadBenefitDefinition(DB, benefitId);
	const orderedRules = await loadBenefitRules(DB, benefit);
	const employeeRows = await loadEmployees(DB);
	const existingEligibilityByEmployee = await loadExistingBenefitEligibility(DB, benefitId);
	const computedAt = new Date().toISOString();
	let preservedCount = 0;
	let recomputedCount = 0;

	for (const employee of employeeRows) {
		const existingEligibility = existingEligibilityByEmployee.get(employee.id);
		if (shouldPreserveEligibilityStatus(existingEligibility, employee.employmentStatus)) {
			preservedCount += 1;
			continue;
		}

		const metrics = buildEmployeeMetrics({
			employment_status: employee.employmentStatus,
			okr_submitted: Number(employee.okrSubmitted),
			late_arrival_count: employee.lateArrivalCount,
			responsibility_level: employee.responsibilityLevel,
			role: employee.role,
			hire_date: employee.hireDate,
		});
		const evaluation = evaluateBenefit(
			orderedRules.map((rule) => ({
				id: rule.id,
				rule_type: rule.ruleType as RuleType,
				operator: rule.operator as Operator,
				value: rule.value,
			})),
			metrics,
		);

		await persistEligibilityResult(
			DB,
			employee.id,
			benefitId,
			computedAt,
			JSON.stringify(evaluation.results),
			evaluation.status,
		);
		recomputedCount += 1;
	}

	return {
		employeeCount: employeeRows.length,
		preservedCount,
		recomputedCount,
	};
}
