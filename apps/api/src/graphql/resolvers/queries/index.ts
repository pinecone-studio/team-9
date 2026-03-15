import { getEmployeeByEmail } from './get-employee-by-email';
import { countActiveContracts } from './count-active-contracts';
import { countPendingBenefitRequests } from './count-pending-benefit-requests';
import { getApprovalRequestById } from './get-approval-request-by-id';
import { getEmployeeById } from './get-employee-by-id';
import { listAuditLogEntries } from './list-audit-log-entries';
import { listApprovalRequests } from './list-approval-requests';
import { listBenefitCatalog } from './list-benefit-catalog';
import { listBenefitCategories } from './list-benefit-categories';
import { listBenefitEligibilitySummary } from './list-benefit-eligibility-summary';
import { listEmployeeEligibilityRecords } from './list-employee-eligibility-records';
import { listEligibilityRules } from './list-eligibility-rules';
import { listRuleCategories } from './list-rule-categories';
import { listRuleDefinitions } from './list-rule-definitions';
import { listEmployees } from './list-employees';
import type {
	QueryEligibilityRulesArgs,
	QueryRuleDefinitionsArgs,
	QueryApprovalRequestArgs,
	QueryApprovalRequestsArgs,
	QueryEmployeeArgs,
	QueryEmployeeByEmailArgs,
	QueryEmployeeEligibilityArgs,
	QueryListAuditLogEntriesArgs,
} from '../../generated/resolvers-types';

type GraphQLContext = {
	DB: D1Database;
	CONTRACTS_BUCKET: R2Bucket;
};

export const queryResolvers = {
	employees: (_: unknown, __: unknown, { DB }: GraphQLContext) => listEmployees(DB),

	employee: (_: unknown, { id }: QueryEmployeeArgs, { DB }: GraphQLContext) => getEmployeeById(DB, id),

	employeeByEmail: (_: unknown, { email }: QueryEmployeeByEmailArgs, { DB }: GraphQLContext) =>
		getEmployeeByEmail(DB, email),

	benefitCategories: (_: unknown, __: unknown, { DB }: GraphQLContext) => listBenefitCategories(DB),

	benefitCatalog: (_: unknown, __: unknown, { DB }: GraphQLContext) => listBenefitCatalog(DB),

	allBenefits: (_: unknown, __: unknown, { DB }: GraphQLContext) => listBenefitCatalog(DB),

	approvalRequests: (_: unknown, args: QueryApprovalRequestsArgs, { DB }: GraphQLContext) =>
		listApprovalRequests(DB, args),

	approvalRequest: (_: unknown, { id }: QueryApprovalRequestArgs, { DB }: GraphQLContext) =>
		getApprovalRequestById(DB, id),

	ruleCategories: (_: unknown, __: unknown, { DB }: GraphQLContext) => listRuleCategories(DB),

	ruleDefinitions: (_: unknown, args: QueryRuleDefinitionsArgs, { DB }: GraphQLContext) =>
		listRuleDefinitions(DB, args),

	eligibilityRules: (_: unknown, { benefitId }: QueryEligibilityRulesArgs, { DB }: GraphQLContext) =>
		listEligibilityRules(DB, benefitId),

	employeeEligibility: (_: unknown, { employeeId }: QueryEmployeeEligibilityArgs, { DB }: GraphQLContext) =>
		listEmployeeEligibilityRecords(DB, employeeId),

	countPendingBenefitRequests: (_: unknown, __: unknown, { DB }: GraphQLContext) =>
		countPendingBenefitRequests(DB),

	countActiveContracts: (_: unknown, __: unknown, { DB }: GraphQLContext) => countActiveContracts(DB),

	listAuditLogEntries: (_: unknown, { limit }: QueryListAuditLogEntriesArgs, { DB }: GraphQLContext) =>
		listAuditLogEntries(DB, limit ?? 5),

	listBenefitEligibilitySummary: (_: unknown, __: unknown, { DB }: GraphQLContext) =>
		listBenefitEligibilitySummary(DB),
};
