import { computeEmployeeEligibility } from './compute-employee-eligibility';
import { listEmployeeEligibilityRecords } from '../query/list-employee-eligibility-records';
import type { BenefitEligibilityModel } from '../../../types/employee';

export async function recalculateEmployeeEligibility(DB: D1Database, employeeId: string): Promise<BenefitEligibilityModel[]> {
	await computeEmployeeEligibility({ DB }, employeeId);
	return listEmployeeEligibilityRecords(DB, employeeId);
}
