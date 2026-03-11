import { createEmployeeRecord } from './create-employee-record';
import { recalculateEmployeeEligibility } from './recalculate-employee-eligibility';
import type { CreateEmployeeArgs, EmployeeEligibilityArgs, GraphQLContext } from '../../../types/employee';

export const mutationResolvers = {
	createEmployee: (_: unknown, args: CreateEmployeeArgs, { DB }: GraphQLContext) => createEmployeeRecord(DB, args),

	recalculateEmployeeEligibility: (_: unknown, { employeeId }: EmployeeEligibilityArgs, { DB }: GraphQLContext) =>
		recalculateEmployeeEligibility(DB, employeeId),
};
