import { EligibilityRule, EmployeeMetrics } from '../types';

export const evaluateRule = (rule: EligibilityRule, metrics: EmployeeMetrics): boolean => {
	try {
		const metricValue = metrics[rule.rule_type];

		const expectedValue = JSON.parse(rule.value);

		if (rule.operator === 'eq') {
			return metricValue == expectedValue;
		}

		if (rule.operator === 'neq') {
			return metricValue !== expectedValue;
		}

		if (rule.operator === 'gt') {
			return Number(metricValue) > Number(expectedValue);
		}

		if (rule.operator === 'gte') {
			return Number(metricValue) >= Number(expectedValue);
		}

		if (rule.operator === 'lt') {
			return Number(metricValue) < Number(expectedValue);
		}

		if (rule.operator === 'lte') {
			return Number(metricValue) <= Number(expectedValue);
		}

		if (rule.operator === 'in') {
			return Array.isArray(expectedValue) && expectedValue.includes(metricValue);
		}

		if (rule.operator === 'not_in') {
			return Array.isArray(expectedValue) && !expectedValue.includes(metricValue);
		}

		return false;
	} catch (error) {
		throw new Error(`Rule evaluation failed: ${(error as Error).message}`);
	}
};
