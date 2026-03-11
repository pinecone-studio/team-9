import { eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { employees } from '../../../db/schema/employees';
import { mapEmployeeRecord } from '../../../utils/mappers';
import type { EmployeeModel } from '../../../types/employee';

export async function getEmployeeById(DB: D1Database, id: string): Promise<EmployeeModel | null> {
	const db = getDb({ DB });

	const result = await db
		.select({
			id: employees.id,
			name: employees.name,
			email: employees.email,
			role: employees.role,
		})
		.from(employees)
		.where(eq(employees.id, id))
		.limit(1);

	return result[0] ? mapEmployeeRecord(result[0]) : null;
}
