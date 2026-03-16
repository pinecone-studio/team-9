import { and, eq, ne } from 'drizzle-orm';

import { getDb } from '../../../db';
import { ruleCategories } from '../../../db/schema/rule-categories';
import { rules } from '../../../db/schema/rules';
import type {
	CreateRuleDefinitionInput,
	Operator,
	RuleDefinition,
	RuleType,
	RuleValueType,
	UpdateRuleDefinitionInput,
} from '../../generated/resolvers-types';

type PreparedCreateRuleDefinition = {
	categoryId: string;
	categoryName: string;
	ruleType: CreateRuleDefinitionInput['ruleType'];
	name: string;
	description: string;
	valueType: CreateRuleDefinitionInput['valueType'];
	allowedOperatorsJson: string;
	optionsJson: string | null;
	defaultUnit: string | null;
	defaultValue: string | null;
	defaultOperator:
		| NonNullable<CreateRuleDefinitionInput['defaultOperator']>
		| CreateRuleDefinitionInput['allowedOperators'][number];
	isActive: boolean;
};

type PreparedUpdateRuleDefinition = {
	updateData: Partial<typeof rules.$inferInsert>;
};

function assertValidJson(value: string, fieldName: string) {
	try {
		JSON.parse(value);
	} catch {
		throw new Error(`${fieldName} must be valid JSON`);
	}
}

function mapRuleDefinitionRow(row: {
	id: string;
	categoryId: string;
	categoryName: string;
	ruleType: string;
	name: string;
	description: string;
	valueType: string;
	allowedOperators: string;
	optionsJson: string | null;
	defaultUnit: string | null;
	defaultValue: string | null;
	defaultOperator: string;
	isActive: boolean;
}): RuleDefinition {
	return {
		id: row.id,
		category_id: row.categoryId,
		category_name: row.categoryName,
		rule_type: row.ruleType as RuleType,
		name: row.name,
		description: row.description,
		value_type: row.valueType as RuleValueType,
		allowed_operators_json: row.allowedOperators,
		options_json: row.optionsJson,
		default_unit: row.defaultUnit,
		default_value: row.defaultValue,
		default_operator: row.defaultOperator as Operator,
		is_active: row.isActive,
		usage_count: 0,
		linked_benefits_json: '[]',
	};
}

async function fetchRuleDefinitionById(DB: D1Database, id: string): Promise<RuleDefinition> {
	const db = getDb({ DB });
	const [row] = await db
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
		.where(eq(rules.id, id))
		.limit(1);

	if (!row) {
		throw new Error(`Rule definition not found: ${id}`);
	}

	return mapRuleDefinitionRow(row);
}

export async function prepareCreateRuleDefinition(
	DB: D1Database,
	input: CreateRuleDefinitionInput,
): Promise<PreparedCreateRuleDefinition> {
	const db = getDb({ DB });
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
		assertValidJson(input.optionsJson, 'optionsJson');
	}

	if (input.defaultValue) {
		assertValidJson(input.defaultValue, 'defaultValue');
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

	return {
		categoryId: category.id,
		categoryName: category.name,
		ruleType: input.ruleType,
		name,
		description,
		valueType: input.valueType,
		allowedOperatorsJson,
		optionsJson: input.optionsJson ?? null,
		defaultUnit: input.defaultUnit?.trim() || null,
		defaultValue: input.defaultValue ?? null,
		defaultOperator: input.defaultOperator ?? input.allowedOperators[0],
		isActive: input.isActive ?? true,
	};
}

export async function applyCreateRuleDefinition(
	DB: D1Database,
	input: CreateRuleDefinitionInput,
	id = crypto.randomUUID(),
): Promise<RuleDefinition> {
	const db = getDb({ DB });
	const prepared = await prepareCreateRuleDefinition(DB, input);

	await db.insert(rules).values({
		id,
		categoryId: prepared.categoryId,
		ruleType: prepared.ruleType,
		name: prepared.name,
		description: prepared.description,
		valueType: prepared.valueType,
		allowedOperators: prepared.allowedOperatorsJson,
		optionsJson: prepared.optionsJson,
		defaultUnit: prepared.defaultUnit,
		defaultValue: prepared.defaultValue,
		defaultOperator: prepared.defaultOperator,
		isActive: prepared.isActive,
	});

	return {
		id,
		category_id: prepared.categoryId,
		category_name: prepared.categoryName,
		rule_type: prepared.ruleType as RuleType,
		name: prepared.name,
		description: prepared.description,
		value_type: prepared.valueType as RuleValueType,
		allowed_operators_json: prepared.allowedOperatorsJson,
		options_json: prepared.optionsJson,
		default_unit: prepared.defaultUnit,
		default_value: prepared.defaultValue,
		default_operator: prepared.defaultOperator as Operator,
		is_active: prepared.isActive,
		usage_count: 0,
		linked_benefits_json: '[]',
	};
}

export async function prepareUpdateRuleDefinition(
	DB: D1Database,
	input: UpdateRuleDefinitionInput,
): Promise<PreparedUpdateRuleDefinition> {
	const db = getDb({ DB });

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
			assertValidJson(input.optionsJson, 'optionsJson');
		}
		updateData.optionsJson = input.optionsJson;
	}

	if (input.defaultUnit !== null && input.defaultUnit !== undefined) {
		updateData.defaultUnit = input.defaultUnit.trim() || null;
	}

	if (input.defaultValue !== null && input.defaultValue !== undefined) {
		if (input.defaultValue) {
			assertValidJson(input.defaultValue, 'defaultValue');
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
		.where(and(eq(rules.categoryId, targetCategoryId), eq(rules.name, targetName), ne(rules.id, input.id)))
		.limit(1);

	if (duplicate) {
		throw new Error('Another rule with the same name already exists in this category');
	}

	return { updateData };
}

export async function applyUpdateRuleDefinition(
	DB: D1Database,
	input: UpdateRuleDefinitionInput,
): Promise<RuleDefinition> {
	const db = getDb({ DB });
	const prepared = await prepareUpdateRuleDefinition(DB, input);

	await db.update(rules).set(prepared.updateData).where(eq(rules.id, input.id));

	return fetchRuleDefinitionById(DB, input.id);
}

export async function getRuleDefinitionSnapshot(DB: D1Database, id: string): Promise<RuleDefinition> {
	return fetchRuleDefinitionById(DB, id);
}
