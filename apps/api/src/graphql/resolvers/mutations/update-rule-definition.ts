import { and, eq, ne } from 'drizzle-orm';

import { getDb } from '../../../db';
import { ruleCategories } from '../../../db/schema/rule-categories';
import { rules } from '../../../db/schema/rules';
import type {
	MutationUpdateRuleDefinitionArgs,
	Operator,
	RuleDefinition,
	RuleType,
	RuleValueType,
} from '../../generated/resolvers-types';

export async function updateRuleDefinition(DB: D1Database, args: MutationUpdateRuleDefinitionArgs): Promise<RuleDefinition> {
	const db = getDb({ DB });
	const input = args.input;

	const [existing] = await db
		.select({ id: rules.id })
		.from(rules)
		.where(eq(rules.id, input.id))
		.limit(1);

	if (!existing) {
		throw new Error(`Rule definition not found: ${input.id}`);
	}

	const updateData: Partial<typeof rules.$inferInsert> = {};

	if (input.categoryId !== null && input.categoryId !== undefined) {
		updateData.categoryId = input.categoryId;
	}

	if (input.ruleType !== null && input.ruleType !== undefined) {
		updateData.ruleType = input.ruleType;
	}

	if (input.name !== null && input.name !== undefined) {
		const name = input.name.trim();
		if (!name) {
			throw new Error('Rule name cannot be empty');
		}
		updateData.name = name;
	}

	if (input.description !== null && input.description !== undefined) {
		const description = input.description.trim();
		if (!description) {
			throw new Error('Rule description cannot be empty');
		}
		updateData.description = description;
	}

	if (input.valueType !== null && input.valueType !== undefined) {
		updateData.valueType = input.valueType;
	}

	if (input.allowedOperators !== null && input.allowedOperators !== undefined) {
		if (input.allowedOperators.length === 0) {
			throw new Error('At least one operator is required');
		}
		updateData.allowedOperators = JSON.stringify(input.allowedOperators);
	}

	if (input.optionsJson !== null && input.optionsJson !== undefined) {
		if (input.optionsJson) {
			try {
				JSON.parse(input.optionsJson);
			} catch {
				throw new Error('optionsJson must be valid JSON');
			}
		}
		updateData.optionsJson = input.optionsJson;
	}

	if (input.defaultUnit !== null && input.defaultUnit !== undefined) {
		updateData.defaultUnit = input.defaultUnit.trim() || null;
	}

	if (input.defaultValue !== null && input.defaultValue !== undefined) {
		if (input.defaultValue) {
			try {
				JSON.parse(input.defaultValue);
			} catch {
				throw new Error('defaultValue must be valid JSON');
			}
		}
		updateData.defaultValue = input.defaultValue;
	}

	if (input.defaultOperator !== null && input.defaultOperator !== undefined) {
		updateData.defaultOperator = input.defaultOperator;
	}

	if (input.isActive !== null && input.isActive !== undefined) {
		updateData.isActive = input.isActive;
	}

	if (Object.keys(updateData).length === 0) {
		throw new Error('At least one field is required to update a rule definition');
	}

	const [currentRule] = await db
		.select({
			categoryId: rules.categoryId,
			name: rules.name,
		})
		.from(rules)
		.where(eq(rules.id, input.id))
		.limit(1);

	if (!currentRule) {
		throw new Error(`Rule definition not found before update: ${input.id}`);
	}

	const targetCategoryId = (updateData.categoryId ?? currentRule.categoryId) as string;
	const targetName = (updateData.name ?? currentRule.name) as string;

	const [duplicate] = await db
		.select({ id: rules.id })
		.from(rules)
		.where(
			and(
				eq(rules.categoryId, targetCategoryId),
				eq(rules.name, targetName),
				ne(rules.id, input.id),
			),
		)
		.limit(1);

	if (duplicate) {
		throw new Error('Another rule with the same name already exists in this category');
	}

	await db.update(rules).set(updateData).where(eq(rules.id, input.id));

	const [updated] = await db
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
			defaultValue: rules.defaultValue,
			defaultOperator: rules.defaultOperator,
			isActive: rules.isActive,
		})
		.from(rules)
		.innerJoin(ruleCategories, eq(ruleCategories.id, rules.categoryId))
		.where(eq(rules.id, input.id))
		.limit(1);

	if (!updated) {
		throw new Error(`Rule definition not found after update: ${input.id}`);
	}

	return {
		id: updated.id,
		category_id: updated.categoryId,
		category_name: updated.categoryName,
		rule_type: updated.ruleType as RuleType,
		name: updated.name,
		description: updated.description,
		value_type: updated.valueType as RuleValueType,
		allowed_operators_json: updated.allowedOperators,
		options_json: updated.optionsJson,
		default_unit: updated.defaultUnit,
		default_value: updated.defaultValue,
		default_operator: updated.defaultOperator as Operator,
		is_active: updated.isActive,
		usage_count: 0,
		linked_benefits_json: '[]',
	};
}
