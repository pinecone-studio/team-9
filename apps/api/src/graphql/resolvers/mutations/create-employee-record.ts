import { getDb } from '../../../db';
import { employees } from '../../../db/schema/employees';
import type { Employee, MutationCreateEmployeeArgs } from '../../generated/resolvers-types';

export async function createEmployeeRecord(DB: D1Database, args: MutationCreateEmployeeArgs): Promise<Employee> {
	const db = getDb({ DB });

	const id = crypto.randomUUID();
	const now = new Date().toISOString();
	const normalizedEmail = args.email.trim().toLowerCase();

	await db.insert(employees).values({
		id,
		email: normalizedEmail,
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
		department: 'Unassigned',
		id,
		name: args.name,
		email: normalizedEmail,
		employmentStatus: 'active',
		hireDate: now,
		position: args.position,
		responsibilityLevel: 1,
	};
}
