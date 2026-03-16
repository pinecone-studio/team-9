import { eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitRules } from '../../../db/schema/benefit-rules';
import { ruleCategories } from '../../../db/schema/rule-categories';
import { rules } from '../../../db/schema/rules';
import type {
	EligibilityRule,
	MutationCreateEligibilityRuleArgs,
	Operator,
	RuleType,
	RuleValueType,
} from '../../generated/resolvers-types';

export async function createEligibilityRule(
	DB: D1Database,
	args: MutationCreateEligibilityRuleArgs,
): Promise<EligibilityRule> {
	const db = getDb({ DB });
	const input = args.input;
	const id = crypto.randomUUID();
	const value = input.value.trim();
	const errorMessage = input.errorMessage.trim();

	if (!value) {
		throw new Error('Rule value is required');
	}

	if (!errorMessage) {
		throw new Error('Rule error message is required');
	}

	try {
		JSON.parse(value);
	} catch {
		throw new Error('Rule value must be a valid JSON string');
	}

	const [ruleDefinition] = await db
		.select({
			id: rules.id,
			categoryId: rules.categoryId,
			categoryName: ruleCategories.name,
			ruleType: rules.ruleType,
			name: rules.name,
			description: rules.description,
			valueType: rules.valueType,
			allowedOperators: rules.allowedOperators,
			optionsJson: rules.optionsJson,
			defaultUnit: rules.defaultUnit,
		})
		.from(rules)
		.innerJoin(ruleCategories, eq(ruleCategories.id, rules.categoryId))
		.where(eq(rules.id, input.ruleId))
		.limit(1);

	if (!ruleDefinition) {
		throw new Error(`Rule definition not found: ${input.ruleId}`);
	}

	await db.insert(benefitRules).values({
		id,
		benefitId: input.benefitId,
		ruleId: input.ruleId,
		operator: input.operator,
		value,
		errorMessage,
		priority: input.priority ?? 1,
		isActive: input.isActive ?? true,
	});

	return {
		id,
		benefit_id: input.benefitId,
		rule_id: ruleDefinition.id,
		category_id: ruleDefinition.categoryId,
		category_name: ruleDefinition.categoryName,
		name: ruleDefinition.name,
		description: ruleDefinition.description,
		rule_type: ruleDefinition.ruleType as RuleType,
		value_type: ruleDefinition.valueType as RuleValueType,
		operator: input.operator,
		allowed_operators_json: ruleDefinition.allowedOperators,
		options_json: ruleDefinition.optionsJson,
		default_unit: ruleDefinition.defaultUnit,
		value,
		error_message: errorMessage,
		priority: input.priority ?? 1,
		is_active: input.isActive ?? true,
	};
}
