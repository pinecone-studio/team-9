import type { EmployeeMetrics } from '../graphql/generated/resolvers-types';

export type EmployeeRow = {
	employment_status: string;
	okr_submitted: boolean | number;
	late_arrival_count: number;
	responsibility_level: number;
	role: string;
	hire_date: string;
};

export const buildEmployeeMetrics = (employee: EmployeeRow): EmployeeMetrics => {
	try {
		const hireDate: Date = new Date(employee.hire_date);

		const daysSinceHire: number = Math.floor((Date.now() - hireDate.getTime()) / (1000 * 60 * 60 * 24));

		const metrics: EmployeeMetrics = {
			employment_status: employee.employment_status as EmployeeMetrics['employment_status'],
			okr_submitted: Number(employee.okr_submitted) === 1,
			attendance: employee.late_arrival_count,
			responsibility_level: employee.responsibility_level,
			role: employee.role,
			tenure_days: daysSinceHire,
		};

		return metrics;
	} catch (error) {
		throw new Error(`Metric build failed: ${(error as Error).message}`);
	}
};
