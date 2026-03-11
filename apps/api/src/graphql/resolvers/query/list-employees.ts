import { asc } from 'drizzle-orm';

import { getDb } from '../../../db';
import { employees } from '../../../db/schema/employees';
import { mapEmployeeRecord } from '../../../utils/mappers';
import type { EmployeeModel } from '../../../types/employee';

export async function listEmployees(DB: D1Database): Promise<EmployeeModel[]> {
	const db = getDb({ DB });

	const rows = await db
		.select({
			id: employees.id,
			name: employees.name,
			email: employees.email,
			role: employees.role,
		})
		.from(employees)
		.orderBy(asc(employees.name));

	return rows.map(mapEmployeeRecord);
}
