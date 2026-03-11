import { getEmployeeById } from './get-employee-by-id';
import { listBenefitCatalog } from './list-benefit-catalog';
import { listEmployeeBenefits } from './list-employee-benefits';
import { listEmployeeEligibilityRecords } from './list-employee-eligibility-records';
import { listEmployees } from './list-employees';
import type { EmployeeEligibilityArgs, EmployeeIdentifierArgs, EmployeeModel, GraphQLContext } from '../../../types/employee';

export const queryResolvers = {
	employees: (_: unknown, __: unknown, { DB }: GraphQLContext) => listEmployees(DB),

	employee: (_: unknown, { id }: EmployeeIdentifierArgs, { DB }: GraphQLContext) => getEmployeeById(DB, id),

	allBenefits: (_: unknown, __: unknown, { DB }: GraphQLContext) => listBenefitCatalog(DB),

	employeeEligibility: (_: unknown, { employeeId }: EmployeeEligibilityArgs, { DB }: GraphQLContext) =>
		listEmployeeEligibilityRecords(DB, employeeId),

	// benefits: (parent: EmployeeModel, _: unknown, { DB }: GraphQLContext) => listEmployeeBenefits(DB, parent.id),
};
