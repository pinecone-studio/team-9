import { eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitEligibility } from '../../../db/schema/benefit-eligibility';
import { benefitRequests } from '../../../db/schema/benefit-requests';
import { employees } from '../../../db/schema/employees';
import type { Employee } from '../../generated/resolvers-types';
import { getEmployeeById } from '../queries/get-employee-by-id';

export async function deleteEmployeeRecord(
	DB: D1Database,
	id: string,
): Promise<Employee> {
	const db = getDb({ DB });
	const employeeId = id.trim();

	if (!employeeId) {
		throw new Error('id is required');
	}

	const employee = await getEmployeeById(DB, employeeId);

	if (!employee) {
		throw new Error('Employee not found');
	}

	await db
		.update(benefitRequests)
		.set({ reviewedBy: null })
		.where(eq(benefitRequests.reviewedBy, employeeId));

	await db
		.update(benefitEligibility)
		.set({
			overrideBy: null,
			overrideExpiresAt: null,
			overrideReason: null,
		})
		.where(eq(benefitEligibility.overrideBy, employeeId));

	await db
		.delete(benefitRequests)
		.where(eq(benefitRequests.employeeId, employeeId));

	await db
		.delete(benefitEligibility)
		.where(eq(benefitEligibility.employeeId, employeeId));

	await db.delete(employees).where(eq(employees.id, employeeId));

	return employee;
}
