import { getEmployeeById } from './get-employee-by-id';
import { listBenefitCatalog } from './list-benefit-catalog';
import { listBenefitCategories } from './list-benefit-categories';
import { listEmployeeEligibilityRecords } from './list-employee-eligibility-records';
import { listEligibilityRules } from './list-eligibility-rules';
import { listRuleCategories } from './list-rule-categories';
import { listRuleDefinitions } from './list-rule-definitions';
import { listEmployees } from './list-employees';
import type {
	QueryEligibilityRulesArgs,
	QueryRuleDefinitionsArgs,
	QueryEmployeeArgs,
	QueryEmployeeEligibilityArgs,
} from '../../generated/resolvers-types';

type GraphQLContext = {
	DB: D1Database;
	CONTRACTS_BUCKET: R2Bucket;
};

export const queryResolvers = {
	employees: (_: unknown, __: unknown, { DB }: GraphQLContext) => listEmployees(DB),

	employee: (_: unknown, { id }: QueryEmployeeArgs, { DB }: GraphQLContext) => getEmployeeById(DB, id),

	benefitCategories: (_: unknown, __: unknown, { DB }: GraphQLContext) => listBenefitCategories(DB),

	benefitCatalog: (_: unknown, __: unknown, { DB }: GraphQLContext) => listBenefitCatalog(DB),

	allBenefits: (_: unknown, __: unknown, { DB }: GraphQLContext) => listBenefitCatalog(DB),

	ruleCategories: (_: unknown, __: unknown, { DB }: GraphQLContext) => listRuleCategories(DB),

	ruleDefinitions: (_: unknown, args: QueryRuleDefinitionsArgs, { DB }: GraphQLContext) => listRuleDefinitions(DB, args),

	eligibilityRules: (_: unknown, { benefitId }: QueryEligibilityRulesArgs, { DB }: GraphQLContext) =>
		listEligibilityRules(DB, benefitId),

	employeeEligibility: (_: unknown, { employeeId }: QueryEmployeeEligibilityArgs, { DB }: GraphQLContext) =>
		listEmployeeEligibilityRecords(DB, employeeId),
};
