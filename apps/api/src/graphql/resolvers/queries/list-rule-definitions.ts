import { and, asc, eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefits } from '../../../db/schema/benefits';
import { benefitRules } from '../../../db/schema/benefit-rules';
import { ruleCategories } from '../../../db/schema/rule-categories';
import { rules } from '../../../db/schema/rules';
import type { Operator, QueryRuleDefinitionsArgs, RuleDefinition, RuleType, RuleValueType } from '../../generated/resolvers-types';

export async function listRuleDefinitions(DB: D1Database, args: QueryRuleDefinitionsArgs): Promise<RuleDefinition[]> {
	const db = getDb({ DB });
	const { categoryId, ruleType } = args;

	const whereClause =
		categoryId && ruleType
			? and(eq(rules.categoryId, categoryId), eq(rules.ruleType, ruleType))
			: categoryId
				? eq(rules.categoryId, categoryId)
				: ruleType
					? eq(rules.ruleType, ruleType)
					: undefined;

	const query = db
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
		.orderBy(asc(ruleCategories.name), asc(rules.name));

	const rows = whereClause ? await query.where(whereClause) : await query;
	const ruleIds = rows.map((row) => row.id);

	const links =
		ruleIds.length > 0
			? await db
					.select({
						ruleId: benefitRules.ruleId,
						benefitId: benefits.id,
						benefitName: benefits.name,
					})
					.from(benefitRules)
					.innerJoin(benefits, eq(benefits.id, benefitRules.benefitId))
					.where(eq(benefitRules.isActive, true))
			: [];

	const usageMap = new Map<string, Array<{ id: string; name: string }>>();
	for (const link of links) {
		if (!ruleIds.includes(link.ruleId)) continue;
		const current = usageMap.get(link.ruleId) ?? [];
		if (!current.some((item) => item.id === link.benefitId)) {
			current.push({ id: link.benefitId, name: link.benefitName });
		}
		usageMap.set(link.ruleId, current);
	}

	return rows.map((row) => ({
		linked_benefits_json: JSON.stringify(usageMap.get(row.id) ?? []),
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
		usage_count: (usageMap.get(row.id) ?? []).length,
	}));
}
