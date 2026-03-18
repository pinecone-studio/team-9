import { getDb } from '../../../db';
import { employees } from '../../../db/schema/employees';
import type { Employee, MutationCreateEmployeeArgs } from '../../generated/resolvers-types';
import { getEmployeeById } from '../queries/get-employee-by-id';
import { computeEmployeeEligibility } from './compute-employee-eligibility';
import { normalizeCreateEmployeeInput } from './employee-record-input';

export async function createEmployeeRecord(DB: D1Database, args: MutationCreateEmployeeArgs): Promise<Employee> {
	const db = getDb({ DB });
	const id = crypto.randomUUID();
	const now = new Date().toISOString();
	const input = normalizeCreateEmployeeInput(args.input);

	await db.insert(employees).values({
		department: input.department,
		id,
		email: input.email,
		employmentStatus: input.employmentStatus,
		hireDate: input.hireDate,
		lateArrivalCount: input.lateArrivalCount,
		lateArrivalUpdatedAt: input.lateArrivalCount > 0 ? now : null,
		name: input.name,
		nameEng: input.nameEng,
		okrSubmitted: input.okrSubmitted,
		responsibilityLevel: input.responsibilityLevel,
		role: input.role,
		createdAt: now,
		updatedAt: now,
	});

	await computeEmployeeEligibility({ DB }, id);

	const employee = await getEmployeeById(DB, id);

	if (!employee) {
		throw new Error('Employee was created but could not be loaded');
	}

	return employee;
}
