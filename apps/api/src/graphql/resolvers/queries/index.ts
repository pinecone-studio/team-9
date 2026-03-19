import { getEmployeeByEmail } from './get-employee-by-email';
import { listActiveBenefitContracts } from './list-active-benefit-contracts';
import { listBenefitRequests } from './list-benefit-requests';
import { countActiveContracts } from './count-active-contracts';
import { countPendingBenefitRequests } from './count-pending-benefit-requests';
import { getApprovalRequestById } from './get-approval-request-by-id';
import { getBenefitContract } from './get-benefit-contract';
import { getContractSignedUrl } from './get-contract-signed-url';
import { getContractSignedUrlByBenefit } from './get-contract-signed-url-by-benefit';
import { getEmployeeById } from './get-employee-by-id';
import { getRuleApprovalRequestReview } from './get-rule-approval-request-review';
import { listAuditLogEntries } from './list-audit-log-entries';
import { listBenefitAcceptedEmployees } from './list-benefit-accepted-employees';
import { listApprovalRequests } from './list-approval-requests';
import { listBenefitCatalog } from './list-benefit-catalog';
import { listBenefitCategories } from './list-benefit-categories';
import { listBenefitContractVersions } from './list-benefit-contract-versions';
import { listBenefitEligibilitySummary } from './list-benefit-eligibility-summary';
import { listEmployeeEligibilityRecords } from './list-employee-eligibility-records';
import { listEmployeeEligibilitySummaries } from './list-employee-eligibility-summaries';
import { listEligibilityRules } from './list-eligibility-rules';
import { listRuleCategories } from './list-rule-categories';
import { listRuleDefinitions } from './list-rule-definitions';
import { listEmployees } from './list-employees';
import type {
	QueryEligibilityRulesArgs,
	QueryRuleDefinitionsArgs,
	QueryApprovalRequestArgs,
	QueryRuleApprovalRequestReviewArgs,
	QueryEmployeeArgs,
	QueryEmployeeByEmailArgs,
	QueryEmployeeEligibilityArgs,
	QueryListAuditLogEntriesArgs,
	QueryApprovalRequestsArgs,
	QueryBenefitAcceptedEmployeesArgs,
	QueryBenefitRequestsArgs,
	QueryBenefitContractArgs,
	QueryContractSignedUrlArgs,
	QueryContractSignedUrlByBenefitArgs,
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

	benefitAcceptedEmployees: (
		_: unknown,
		{ benefitId }: QueryBenefitAcceptedEmployeesArgs,
		{ DB }: GraphQLContext,
	) => listBenefitAcceptedEmployees(DB, benefitId),

	benefitCategories: (_: unknown, __: unknown, { DB }: GraphQLContext) => listBenefitCategories(DB),

	benefitCatalog: (_: unknown, __: unknown, { DB }: GraphQLContext) => listBenefitCatalog(DB),

	allBenefits: (_: unknown, __: unknown, { DB }: GraphQLContext) => listBenefitCatalog(DB),

	approvalRequests: (_: unknown, args: QueryApprovalRequestsArgs, { DB }: GraphQLContext) =>
		listApprovalRequests(DB, args),

	approvalRequest: (_: unknown, { id }: QueryApprovalRequestArgs, { DB }: GraphQLContext) =>
		getApprovalRequestById(DB, id),

	ruleApprovalRequestReview: (
		_: unknown,
		args: QueryRuleApprovalRequestReviewArgs,
		{ DB }: GraphQLContext,
	) => getRuleApprovalRequestReview(DB, args),

	benefitRequests: (_: unknown, args: QueryBenefitRequestsArgs, { DB }: GraphQLContext) =>
		listBenefitRequests(DB, args),

	ruleCategories: (_: unknown, __: unknown, { DB }: GraphQLContext) => listRuleCategories(DB),

	ruleDefinitions: (_: unknown, args: QueryRuleDefinitionsArgs, { DB }: GraphQLContext) =>
		listRuleDefinitions(DB, args),

	eligibilityRules: (_: unknown, { benefitId }: QueryEligibilityRulesArgs, { DB }: GraphQLContext) =>
		listEligibilityRules(DB, benefitId),

	employeeEligibility: (_: unknown, { employeeId }: QueryEmployeeEligibilityArgs, { DB }: GraphQLContext) =>
		listEmployeeEligibilityRecords(DB, employeeId),

	employeeEligibilitySummaries: (_: unknown, __: unknown, { DB }: GraphQLContext) =>
		listEmployeeEligibilitySummaries(DB),

	benefitContract: (_: unknown, { benefitId }: QueryBenefitContractArgs, { DB, CONTRACTS_BUCKET }: GraphQLContext) =>
		getBenefitContract({ DB, CONTRACTS_BUCKET }, benefitId),

	benefitContractVersions: (_: unknown, { benefitId }: { benefitId: string }, { DB }: GraphQLContext) =>
		listBenefitContractVersions(DB, benefitId),

	activeBenefitContracts: (_: unknown, __: unknown, { DB }: GraphQLContext) =>
		listActiveBenefitContracts(DB),

	contractSignedUrl: (_: unknown, { contractId }: QueryContractSignedUrlArgs, { DB, CONTRACTS_BUCKET }: GraphQLContext) =>
		getContractSignedUrl({ DB, CONTRACTS_BUCKET }, contractId),

	contractSignedUrlByBenefit: (
		_: unknown,
		{ benefitId }: QueryContractSignedUrlByBenefitArgs,
		{ DB, CONTRACTS_BUCKET }: GraphQLContext,
	) => getContractSignedUrlByBenefit({ DB, CONTRACTS_BUCKET }, benefitId),

	countPendingBenefitRequests: (_: unknown, __: unknown, { DB }: GraphQLContext) => countPendingBenefitRequests(DB),

	countActiveContracts: (_: unknown, __: unknown, { DB }: GraphQLContext) => countActiveContracts(DB),

	listAuditLogEntries: (_: unknown, { limit }: QueryListAuditLogEntriesArgs, { DB }: GraphQLContext) =>
		listAuditLogEntries(DB, limit ?? 5),

	listBenefitEligibilitySummary: (_: unknown, __: unknown, { DB }: GraphQLContext) =>
		listBenefitEligibilitySummary(DB),
};
