import { asc, eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitRules } from '../../../db/schema/benefit-rules';
import { ruleCategories } from '../../../db/schema/rule-categories';
import { rules } from '../../../db/schema/rules';
import type { EligibilityRule, Operator, RuleType, RuleValueType } from '../../generated/resolvers-types';

export async function listEligibilityRules(DB: D1Database, benefitId?: string | null): Promise<EligibilityRule[]> {
	const db = getDb({ DB });

	const baseQuery = db
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
		.innerJoin(ruleCategories, eq(ruleCategories.id, rules.categoryId));

	const rows = benefitId
		? await baseQuery.where(eq(benefitRules.benefitId, benefitId)).orderBy(asc(benefitRules.priority), asc(benefitRules.id))
		: await baseQuery.orderBy(asc(benefitRules.priority), asc(benefitRules.id));

	return rows.map((row) => ({
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
	}));
}
