import { asc } from 'drizzle-orm';

import { getDb } from '../../../db';
import { employees } from '../../../db/schema/employees';
import { mapEmployeeRecord } from '../../../utils/mappers';
import type { Employee } from '../../generated/resolvers-types';

export async function listEmployees(DB: D1Database): Promise<Employee[]> {
	const db = getDb({ DB });

	const rows = await db
		.select({
			department: employees.department,
			id: employees.id,
			name: employees.name,
			email: employees.email,
			employmentStatus: employees.employmentStatus,
			hireDate: employees.hireDate,
			lateArrivalCount: employees.lateArrivalCount,
			okrSubmitted: employees.okrSubmitted,
			role: employees.role,
			responsibilityLevel: employees.responsibilityLevel,
		})
		.from(employees)
		.orderBy(asc(employees.name));

	return rows.map(mapEmployeeRecord);
}
