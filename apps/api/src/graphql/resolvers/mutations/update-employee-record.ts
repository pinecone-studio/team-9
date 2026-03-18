import { eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { employees } from '../../../db/schema/employees';
import type { Employee, MutationUpdateEmployeeArgs } from '../../generated/resolvers-types';
import { getEmployeeById } from '../queries/get-employee-by-id';
import { computeEmployeeEligibility } from './compute-employee-eligibility';
import { normalizeUpdateEmployeeInput } from './employee-record-input';

export async function updateEmployeeRecord(
	DB: D1Database,
	args: MutationUpdateEmployeeArgs,
): Promise<Employee> {
	const db = getDb({ DB });
	const employeeId = args.input.id.trim();

	if (!employeeId) {
		throw new Error('id is required');
	}

	const [currentEmployee] = await db
		.select()
		.from(employees)
		.where(eq(employees.id, employeeId))
		.limit(1);

	if (!currentEmployee) {
		throw new Error('Employee not found');
	}

	const input = normalizeUpdateEmployeeInput(currentEmployee, args.input);
	const now = new Date().toISOString();

	await db
		.update(employees)
		.set({
			department: input.department,
			email: input.email,
			employmentStatus: input.employmentStatus,
			hireDate: input.hireDate,
			lateArrivalCount: input.lateArrivalCount,
			lateArrivalUpdatedAt:
				input.lateArrivalCount !== currentEmployee.lateArrivalCount
					? now
					: currentEmployee.lateArrivalUpdatedAt,
			name: input.name,
			nameEng: input.nameEng,
			okrSubmitted: input.okrSubmitted,
			responsibilityLevel: input.responsibilityLevel,
			role: input.role,
			updatedAt: now,
		})
		.where(eq(employees.id, employeeId));

	await computeEmployeeEligibility({ DB }, employeeId);

	const employee = await getEmployeeById(DB, employeeId);

	if (!employee) {
		throw new Error('Employee was updated but could not be loaded');
	}

	return employee;
}
