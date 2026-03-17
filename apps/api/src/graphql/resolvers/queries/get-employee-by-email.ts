import { sql } from 'drizzle-orm';

import { getDb } from '../../../db';
import { employees } from '../../../db/schema/employees';
import { mapEmployeeRecord } from '../../../utils/mappers';
import type { Employee } from '../../generated/resolvers-types';

export async function getEmployeeByEmail(DB: D1Database, email: string): Promise<Employee | null> {
	const db = getDb({ DB });
	const normalizedEmail = email.trim().toLowerCase();

	if (!normalizedEmail) {
		return null;
	}

	const result = await db
		.select({
			department: employees.department,
			id: employees.id,
			name: employees.name,
			email: employees.email,
			employmentStatus: employees.employmentStatus,
			hireDate: employees.hireDate,
			role: employees.role,
			responsibilityLevel: employees.responsibilityLevel,
		})
		.from(employees)
		.where(sql`lower(${employees.email}) = ${normalizedEmail}`)
		.limit(1);

	return result[0] ? mapEmployeeRecord(result[0]) : null;
}
