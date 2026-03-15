import { and, eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitCategories } from '../../../db/schema/benefit-categories';
import { benefitRules } from '../../../db/schema/benefit-rules';
import { benefits } from '../../../db/schema/benefits';
import { ruleCategories } from '../../../db/schema/rule-categories';
import { rules } from '../../../db/schema/rules';
import { mapBenefitRecord } from '../../../utils/mappers';
import {
	Operator,
	type Benefit,
	type BenefitRuleAssignmentInput,
	type CreateBenefitInput,
	type EligibilityRule,
	type RuleType,
	type RuleValueType,
	type UpdateBenefitInput,
} from '../../generated/resolvers-types';

type PreparedBenefit = {
	name: string;
	categoryId: string;
	categoryName: string;
	subsidyPercent: number;
	description: string;
	vendorName: string | null;
	isCore: boolean;
	approvalRole: 'hr_admin' | 'finance_manager';
	requiresContract: boolean;
};

type BenefitRuleAssignmentRecord = {
	ruleId: string;
	operator: BenefitRuleAssignmentInput['operator'];
	value: string;
	errorMessage: string;
	priority: number;
	isActive: boolean;
};

type CoreRuleInfo = {
	ruleId: string;
};

function normalizeApprovalRole(value?: string | null): 'hr_admin' | 'finance_manager' {
	return value === 'finance_manager' ? 'finance_manager' : 'hr_admin';
}

async function assertValidBenefitRuleAssignments(
	DB: D1Database,
	assignments: BenefitRuleAssignmentInput[],
): Promise<BenefitRuleAssignmentRecord[]> {
	const db = getDb({ DB });
	const normalized = assignments.map((assignment, index) => {
		const errorMessage = assignment.errorMessage.trim();
		const value = assignment.value.trim();

		if (!errorMessage) {
			throw new Error('Each rule assignment must include an error message');
		}

		if (!value) {
			throw new Error('Each rule assignment must include a value');
		}

		return {
			ruleId: assignment.ruleId,
			operator: assignment.operator,
			value,
			errorMessage,
			priority: assignment.priority ?? index + 1,
			isActive: assignment.isActive ?? true,
		};
	});

	const uniqueRuleIds = [...new Set(normalized.map((assignment) => assignment.ruleId))];

	for (const ruleId of uniqueRuleIds) {
		const [rule] = await db.select({ id: rules.id }).from(rules).where(eq(rules.id, ruleId)).limit(1);
		if (!rule) {
			throw new Error(`Rule definition not found: ${ruleId}`);
		}
	}

	return normalized;
}

async function ensureCoreBenefitRule(DB: D1Database): Promise<CoreRuleInfo> {
	const db = getDb({ DB });
	const coreRuleName = 'Core Benefit Employment Gate';

	const [existing] = await db
		.select({ id: rules.id })
		.from(rules)
		.where(and(eq(rules.ruleType, 'employment_status'), eq(rules.name, coreRuleName)))
		.limit(1);

	if (existing) {
		return { ruleId: existing.id };
	}

	const [category] = await db
		.select({ id: ruleCategories.id })
		.from(ruleCategories)
		.where(eq(ruleCategories.id, 'cat_gate_rules'))
		.limit(1);

	if (!category) {
		throw new Error('Gate Rules category is required before creating core benefits');
	}

	const ruleId = crypto.randomUUID();
	await db.insert(rules).values({
		id: ruleId,
		categoryId: category.id,
		ruleType: 'employment_status',
		name: coreRuleName,
		description: 'Core benefits are available only for employees who are not terminated.',
		valueType: 'enum',
		allowedOperators: JSON.stringify(['eq', 'neq']),
		optionsJson: JSON.stringify(['active', 'probation', 'leave', 'terminated']),
		defaultUnit: null,
		defaultValue: JSON.stringify('terminated'),
		defaultOperator: 'neq',
		isActive: true,
	});

	return { ruleId };
}

async function resolveBenefitRuleAssignments(
	DB: D1Database,
	isCore: boolean,
	assignments: BenefitRuleAssignmentInput[],
): Promise<BenefitRuleAssignmentRecord[]> {
	if (isCore) {
		const coreRule = await ensureCoreBenefitRule(DB);
		return [
			{
				ruleId: coreRule.ruleId,
				operator: Operator.Neq,
				value: JSON.stringify('terminated'),
				errorMessage: 'Employment status must not be terminated.',
				priority: 1,
				isActive: true,
			},
		];
	}

	return assertValidBenefitRuleAssignments(DB, assignments);
}

async function replaceBenefitRuleAssignments(
	DB: D1Database,
	benefitId: string,
	assignments: BenefitRuleAssignmentRecord[],
) {
	const db = getDb({ DB });
	await db.delete(benefitRules).where(eq(benefitRules.benefitId, benefitId));

	if (assignments.length === 0) {
		return;
	}

	await db.insert(benefitRules).values(
		assignments.map((assignment) => ({
			id: crypto.randomUUID(),
			benefitId,
			ruleId: assignment.ruleId,
			operator: assignment.operator,
			value: assignment.value,
			errorMessage: assignment.errorMessage,
			priority: assignment.priority,
			isActive: assignment.isActive,
		})),
	);
}

export async function prepareCreateBenefit(DB: D1Database, input: CreateBenefitInput): Promise<PreparedBenefit> {
	const db = getDb({ DB });
	const name = input.name.trim();
	const categoryId = input.categoryId.trim();
	const subsidyPercent = input.subsidyPercent;
	const description = input.description.trim();
	const vendorName = input.vendorName?.trim() || null;
	const isCore = input.isCore ?? false;
	const approvalRole = normalizeApprovalRole(input.approvalRole);

	if (!name) {
		throw new Error('Benefit name is required');
	}

	if (!categoryId) {
		throw new Error('Category is required');
	}

	if (!description) {
		throw new Error('Description is required');
	}

	if (!Number.isInteger(subsidyPercent) || subsidyPercent < 0 || subsidyPercent > 100) {
		throw new Error('Subsidy percent must be an integer between 0 and 100');
	}

	const [category] = await db
		.select({
			id: benefitCategories.id,
			name: benefitCategories.name,
		})
		.from(benefitCategories)
		.where(eq(benefitCategories.id, categoryId))
		.limit(1);

	if (!category) {
		throw new Error(`Category not found: ${categoryId}`);
	}

	return {
		name,
		categoryId,
		categoryName: category.name,
		subsidyPercent,
		description,
		vendorName,
		isCore,
		approvalRole,
		requiresContract: input.requiresContract ?? false,
	};
}

export async function applyCreateBenefit(
	DB: D1Database,
	input: CreateBenefitInput,
	ruleAssignments: BenefitRuleAssignmentInput[] = [],
	id = crypto.randomUUID(),
): Promise<Benefit> {
	const db = getDb({ DB });
	const prepared = await prepareCreateBenefit(DB, input);
	const resolvedAssignments = await resolveBenefitRuleAssignments(DB, prepared.isCore, ruleAssignments);

	await db.insert(benefits).values({
		id,
		name: prepared.name,
		description: prepared.description,
		categoryId: prepared.categoryId,
		subsidyPercent: prepared.subsidyPercent,
		vendorName: prepared.vendorName,
		approvalRole: prepared.approvalRole,
		isCore: prepared.isCore,
		requiresContract: prepared.requiresContract,
		isActive: true,
	});

	await replaceBenefitRuleAssignments(DB, id, resolvedAssignments);

	return mapBenefitRecord({
		id,
		name: prepared.name,
		description: prepared.description,
		categoryId: prepared.categoryId,
		category: prepared.categoryName,
		approval_role: prepared.approvalRole,
		requires_contract: prepared.requiresContract,
		subsidy_percent: prepared.subsidyPercent,
		vendor_name: prepared.vendorName,
		is_core: prepared.isCore,
	});
}

export async function prepareUpdateBenefit(DB: D1Database, input: UpdateBenefitInput): Promise<PreparedBenefit> {
	const db = getDb({ DB });
	const id = input.id.trim();

	if (!id) {
		throw new Error('Benefit id is required');
	}

	const [existingBenefit] = await db
		.select({
			id: benefits.id,
		})
		.from(benefits)
		.where(eq(benefits.id, id))
		.limit(1);

	if (!existingBenefit) {
		throw new Error(`Benefit not found: ${id}`);
	}

	return prepareCreateBenefit(DB, {
		name: input.name,
		categoryId: input.categoryId,
		subsidyPercent: input.subsidyPercent,
		description: input.description,
		vendorName: input.vendorName,
		requiresContract: input.requiresContract,
		isCore: input.isCore,
		approvalRole: input.approvalRole,
	});
}

export async function applyUpdateBenefit(
	DB: D1Database,
	input: UpdateBenefitInput,
	ruleAssignments: BenefitRuleAssignmentInput[] = [],
): Promise<Benefit> {
	const db = getDb({ DB });
	const benefitId = input.id.trim();
	const prepared = await prepareUpdateBenefit(DB, input);
	const resolvedAssignments = await resolveBenefitRuleAssignments(DB, prepared.isCore, ruleAssignments);

	const [existingBenefit] = await db
		.select({
			isActive: benefits.isActive,
		})
		.from(benefits)
		.where(eq(benefits.id, benefitId))
		.limit(1);

	if (!existingBenefit) {
		throw new Error(`Benefit not found: ${benefitId}`);
	}

	await db
		.update(benefits)
		.set({
			name: prepared.name,
			description: prepared.description,
			categoryId: prepared.categoryId,
			subsidyPercent: prepared.subsidyPercent,
			vendorName: prepared.vendorName,
			approvalRole: prepared.approvalRole,
			isCore: prepared.isCore,
			requiresContract: prepared.requiresContract,
		})
		.where(eq(benefits.id, benefitId));

	await replaceBenefitRuleAssignments(DB, benefitId, resolvedAssignments);

	return mapBenefitRecord({
		id: benefitId,
		name: prepared.name,
		description: prepared.description,
		categoryId: prepared.categoryId,
		category: prepared.categoryName,
		is_active: existingBenefit.isActive,
		approval_role: prepared.approvalRole,
		subsidy_percent: prepared.subsidyPercent,
		vendor_name: prepared.vendorName,
		is_core: prepared.isCore,
	});
}

export async function getBenefitSnapshot(DB: D1Database, id: string): Promise<{ benefit: Benefit; ruleAssignments: EligibilityRule[] }> {
	const db = getDb({ DB });

	const [benefit] = await db
		.select({
			id: benefits.id,
			name: benefits.name,
			description: benefits.description,
			categoryId: benefits.categoryId,
			categoryName: benefitCategories.name,
			subsidyPercent: benefits.subsidyPercent,
			vendorName: benefits.vendorName,
			approvalRole: benefits.approvalRole,
			requiresContract: benefits.requiresContract,
			isCore: benefits.isCore,
			isActive: benefits.isActive,
		})
		.from(benefits)
		.innerJoin(benefitCategories, eq(benefitCategories.id, benefits.categoryId))
		.where(eq(benefits.id, id))
		.limit(1);

	if (!benefit) {
		throw new Error(`Benefit not found: ${id}`);
	}

	const rulesRows = await db
		.select({
			id: benefitRules.id,
			benefitId: benefitRules.benefitId,
			ruleId: benefitRules.ruleId,
			ruleType: rules.ruleType,
			categoryId: rules.categoryId,
			categoryName: ruleCategories.name,
			name: rules.name,
			description: rules.description,
			valueType: rules.valueType,
			allowedOperators: rules.allowedOperators,
			optionsJson: rules.optionsJson,
			defaultUnit: rules.defaultUnit,
			operator: benefitRules.operator,
			value: benefitRules.value,
			errorMessage: benefitRules.errorMessage,
			priority: benefitRules.priority,
			isActive: benefitRules.isActive,
		})
		.from(benefitRules)
		.innerJoin(rules, eq(rules.id, benefitRules.ruleId))
		.innerJoin(ruleCategories, eq(ruleCategories.id, rules.categoryId))
		.where(eq(benefitRules.benefitId, id));

	return {
		benefit: mapBenefitRecord({
			id: benefit.id,
			name: benefit.name,
			description: benefit.description,
			categoryId: benefit.categoryId,
			category: benefit.categoryName,
			approval_role: benefit.approvalRole,
			requires_contract: benefit.requiresContract,
			subsidy_percent: benefit.subsidyPercent,
			vendor_name: benefit.vendorName,
			is_core: benefit.isCore,
			is_active: benefit.isActive,
		}),
		ruleAssignments: rulesRows.map((row) => ({
			id: row.id,
			benefit_id: row.benefitId,
			rule_id: row.ruleId,
			category_id: row.categoryId,
			category_name: row.categoryName,
			name: row.name,
			description: row.description,
			rule_type: row.ruleType as RuleType,
			value_type: row.valueType as RuleValueType,
			operator: row.operator as Operator,
			allowed_operators_json: row.allowedOperators,
			options_json: row.optionsJson,
			default_unit: row.defaultUnit,
			value: row.value,
			error_message: row.errorMessage,
			priority: row.priority,
			is_active: row.isActive,
		})),
	};
}
