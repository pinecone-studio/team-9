import { and, eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { ruleCategories } from '../../../db/schema/rule-categories';
import { rules } from '../../../db/schema/rules';
import type {
	MutationCreateRuleDefinitionArgs,
	Operator,
	RuleDefinition,
	RuleType,
	RuleValueType,
} from '../../generated/resolvers-types';

export async function createRuleDefinition(DB: D1Database, args: MutationCreateRuleDefinitionArgs): Promise<RuleDefinition> {
	const db = getDb({ DB });
	const input = args.input;
	const id = crypto.randomUUID();
	const name = input.name.trim();
	const description = input.description.trim();
	const allowedOperatorsJson = JSON.stringify(input.allowedOperators);

	if (!name) {
		throw new Error('Rule name is required');
	}

	if (!description) {
		throw new Error('Rule description is required');
	}

	if (input.allowedOperators.length === 0) {
		throw new Error('At least one operator is required');
	}

	if (input.optionsJson) {
		try {
			JSON.parse(input.optionsJson);
		} catch {
			throw new Error('optionsJson must be valid JSON');
		}
	}

	if (input.defaultValue) {
		try {
			JSON.parse(input.defaultValue);
		} catch {
			throw new Error('defaultValue must be valid JSON');
		}
	}

	const [category] = await db
		.select({
			id: ruleCategories.id,
			name: ruleCategories.name,
		})
		.from(ruleCategories)
		.where(eq(ruleCategories.id, input.categoryId))
		.limit(1);

	if (!category) {
		throw new Error(`Rule category not found: ${input.categoryId}`);
	}

	const [duplicate] = await db
		.select({ id: rules.id })
		.from(rules)
		.where(and(eq(rules.categoryId, input.categoryId), eq(rules.name, name)))
		.limit(1);

	if (duplicate) {
		throw new Error(`A rule with this name already exists in ${category.name}`);
	}

	await db.insert(rules).values({
		id,
		categoryId: input.categoryId,
		ruleType: input.ruleType,
		name,
		description,
		valueType: input.valueType,
		allowedOperators: allowedOperatorsJson,
		optionsJson: input.optionsJson ?? null,
		defaultUnit: input.defaultUnit?.trim() || null,
		defaultValue: input.defaultValue ?? null,
		defaultOperator: input.defaultOperator ?? input.allowedOperators[0],
		isActive: input.isActive ?? true,
	});

	return {
		id,
		category_id: category.id,
		category_name: category.name,
		rule_type: input.ruleType as RuleType,
		name,
		description,
		value_type: input.valueType as RuleValueType,
		allowed_operators_json: allowedOperatorsJson,
		options_json: input.optionsJson ?? null,
		default_unit: input.defaultUnit?.trim() || null,
		default_value: input.defaultValue ?? null,
		default_operator: (input.defaultOperator ?? input.allowedOperators[0]) as Operator,
		is_active: input.isActive ?? true,
		usage_count: 0,
		linked_benefits_json: '[]',
	};
}
