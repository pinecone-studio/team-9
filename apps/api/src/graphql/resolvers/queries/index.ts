import { getEmployeeById } from './get-employee-by-id';
import { listBenefitCatalog } from './list-benefit-catalog';
import { listBenefitCategories } from './list-benefit-categories';
import { listEmployeeEligibilityRecords } from './list-employee-eligibility-records';
import { listEmployees } from './list-employees';
import type { QueryEmployeeArgs, QueryEmployeeEligibilityArgs } from '../../generated/resolvers-types';

type GraphQLContext = {
	DB: D1Database;
	CONTRACTS_BUCKET: R2Bucket;
};

export const queryResolvers = {
	employees: (_: unknown, __: unknown, { DB }: GraphQLContext) => listEmployees(DB),

	employee: (_: unknown, { id }: QueryEmployeeArgs, { DB }: GraphQLContext) => getEmployeeById(DB, id),

	benefitCategories: (_: unknown, __: unknown, { DB }: GraphQLContext) => listBenefitCategories(DB),

	allBenefits: (_: unknown, __: unknown, { DB }: GraphQLContext) => listBenefitCatalog(DB),

	employeeEligibility: (_: unknown, { employeeId }: QueryEmployeeEligibilityArgs, { DB }: GraphQLContext) =>
		listEmployeeEligibilityRecords(DB, employeeId),
};
