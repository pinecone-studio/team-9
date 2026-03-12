import { getEmployeeById } from './get-employee-by-id';
import { listBenefitCatalog } from './list-benefit-catalog';
import { listBenefitCategories } from './list-benefit-categories';
import { listEmployeeEligibilityRecords } from './list-employee-eligibility-records';
import { listEmployees } from './list-employees';
import type { EmployeeEligibilityArgs, EmployeeIdentifierArgs, EmployeeModel, GraphQLContext } from '../../../types/employee';
import { listEmployeeBenefits } from './list-employee-benefits';

export const queryResolvers = {
	employees: (_: unknown, __: unknown, { DB }: GraphQLContext) => listEmployees(DB),

	employee: (_: unknown, { id }: EmployeeIdentifierArgs, { DB }: GraphQLContext) => getEmployeeById(DB, id),

	benefitCategories: (_: unknown, __: unknown, { DB }: GraphQLContext) => listBenefitCategories(DB),

	allBenefits: (_: unknown, __: unknown, { DB }: GraphQLContext) => listBenefitCatalog(DB),

	employeeEligibility: (_: unknown, { employeeId }: EmployeeEligibilityArgs, { DB }: GraphQLContext) =>
		listEmployeeEligibilityRecords(DB, employeeId),

	// benefits: (parent: EmployeeModel, _: unknown, { DB }: GraphQLContext) => listEmployeeBenefits(DB, parent.id),
};
