import { getDb } from '../../../db';
import { employees } from '../../../db/schema/employees';
import type { CreateEmployeeArgs, EmployeeModel } from '../../../types/employee';

export async function createEmployeeRecord(DB: D1Database, args: CreateEmployeeArgs): Promise<EmployeeModel> {
	const db = getDb({ DB });

	const id = crypto.randomUUID();
	const now = new Date().toISOString();

	await db.insert(employees).values({
		id,
		email: args.email,
		name: args.name,
		nameEng: args.name,
		role: args.position,
		department: 'Unassigned',
		responsibilityLevel: 1,
		employmentStatus: 'active',
		hireDate: now,
		okrSubmitted: false,
		lateArrivalCount: 0,
		lateArrivalUpdatedAt: null,
		createdAt: now,
		updatedAt: now,
	});

	return {
		id,
		name: args.name,
		email: args.email,
		position: args.position,
	};
}
