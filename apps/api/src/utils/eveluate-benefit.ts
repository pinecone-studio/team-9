import type { EligibilityRule, EmployeeMetrics } from '../graphql/generated/resolvers-types';

import { evaluateRule } from './eveluate-rule';

export type RuleResult = {
	ruleType: string;
	passed: boolean;
};

export type BenefitEvaluation = {
	status: 'eligible' | 'locked';
	results: RuleResult[];
};

export const evaluateBenefit = (rules: EligibilityRule[], metrics: EmployeeMetrics): BenefitEvaluation => {
	try {
		const results: RuleResult[] = [];

		for (const rule of rules) {
			const passed: boolean = evaluateRule(rule, metrics);

			results.push({
				ruleType: rule.rule_type,
				passed,
			});

			if (!passed) {
				return {
					status: 'locked',
					results,
				};
			}
		}

		return {
			status: 'eligible',
			results,
		};
	} catch (error) {
		throw new Error(`Benefit evaluation failed: ${(error as Error).message}`);
	}
};
