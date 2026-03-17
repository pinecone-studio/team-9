import { computeEmployeeEligibility } from './compute-employee-eligibility';
import { listEmployeeEligibilityRecords } from '../queries/list-employee-eligibility-records';
import type { BenefitEligibility } from '../../generated/resolvers-types';

export async function recalculateEmployeeEligibility(DB: D1Database, employeeId: string): Promise<BenefitEligibility[]> {
	try {
		await computeEmployeeEligibility({ DB }, employeeId);
		return listEmployeeEligibilityRecords(DB, employeeId);
	} catch (error) {
		throw new Error(
			`Failed to recalculate employee eligibility: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}
