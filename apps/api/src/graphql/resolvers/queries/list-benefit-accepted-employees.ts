import { and, asc, eq } from 'drizzle-orm';

import { getDb } from '../../../db';
import { benefitEligibility } from '../../../db/schema/benefit-eligibility';
import { employees } from '../../../db/schema/employees';
import { mapEmployeeRecord } from '../../../utils/mappers';
import type { Employee } from '../../generated/resolvers-types';

export async function listBenefitAcceptedEmployees(
	DB: D1Database,
	benefitId: string,
): Promise<Employee[]> {
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
		.from(benefitEligibility)
		.innerJoin(employees, eq(employees.id, benefitEligibility.employeeId))
		.where(and(eq(benefitEligibility.benefitId, benefitId), eq(benefitEligibility.status, 'active')))
		.orderBy(asc(employees.name));

	return rows.map(mapEmployeeRecord);
}
