import { eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { employees } from '../../../db/schema/employees';
import { mapEmployeeRecord } from '../../../utils/mappers';
import type { Employee } from '../../generated/resolvers-types';

export async function getEmployeeById(DB: D1Database, id: string): Promise<Employee | null> {
	try {
		const db = getDb({ DB });

		const result = await db
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
			.where(eq(employees.id, id))
			.limit(1);

		return result[0] ? mapEmployeeRecord(result[0]) : null;
	} catch (error) {
		throw new Error(`Failed to get employee by id: ${error instanceof Error ? error.message : String(error)}`);
	}
}
