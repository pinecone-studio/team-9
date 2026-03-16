import { eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitRules } from '../../../db/schema/benefit-rules';
import { ruleCategories } from '../../../db/schema/rule-categories';
import { rules } from '../../../db/schema/rules';
import type {
	EligibilityRule,
	MutationUpdateEligibilityRuleArgs,
	Operator,
	RuleType,
	RuleValueType,
} from '../../generated/resolvers-types';

export async function updateEligibilityRule(
	DB: D1Database,
	args: MutationUpdateEligibilityRuleArgs,
): Promise<EligibilityRule> {
	const db = getDb({ DB });
	const input = args.input;
	const [existing] = await db
		.select({
			id: benefitRules.id,
		})
		.from(benefitRules)
		.where(eq(benefitRules.id, input.id))
		.limit(1);

	if (!existing) {
		throw new Error(`Eligibility rule not found: ${input.id}`);
	}

	const updateData: Partial<typeof benefitRules.$inferInsert> = {};

	if (input.ruleId !== null && input.ruleId !== undefined) {
		updateData.ruleId = input.ruleId;
	}

	if (input.operator !== null && input.operator !== undefined) {
		updateData.operator = input.operator;
	}

	if (input.value !== null && input.value !== undefined) {
		const value = input.value.trim();

		if (!value) {
			throw new Error('Rule value cannot be empty');
		}

		try {
			JSON.parse(value);
		} catch {
			throw new Error('Rule value must be a valid JSON string');
		}

		updateData.value = value;
	}

	if (input.errorMessage !== null && input.errorMessage !== undefined) {
		const errorMessage = input.errorMessage.trim();

		if (!errorMessage) {
			throw new Error('Rule error message cannot be empty');
		}

		updateData.errorMessage = errorMessage;
	}

	if (input.priority !== null && input.priority !== undefined) {
		updateData.priority = input.priority;
	}

	if (input.isActive !== null && input.isActive !== undefined) {
		updateData.isActive = input.isActive;
	}

	if (Object.keys(updateData).length === 0) {
		throw new Error('At least one field is required to update an eligibility rule');
	}

	await db.update(benefitRules).set(updateData).where(eq(benefitRules.id, input.id));

	const [updated] = await db
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
		.where(eq(benefitRules.id, input.id))
		.limit(1);

	if (!updated) {
		throw new Error(`Eligibility rule not found after update: ${input.id}`);
	}

	return {
		id: updated.id,
		benefit_id: updated.benefitId,
		rule_id: updated.ruleId,
		category_id: updated.categoryId,
		category_name: updated.categoryName,
		name: updated.name,
		description: updated.description,
		rule_type: updated.ruleType as RuleType,
		value_type: updated.valueType as RuleValueType,
		operator: updated.operator as Operator,
		allowed_operators_json: updated.allowedOperators,
		options_json: updated.optionsJson,
		default_unit: updated.defaultUnit,
		value: updated.value,
		error_message: updated.errorMessage,
		priority: updated.priority,
		is_active: updated.isActive,
	};
}
