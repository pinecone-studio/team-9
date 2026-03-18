import { createApprovalRequest } from './create-approval-request';
import { cancelEmployeeBenefitRequest } from './cancel-employee-benefit-request';
import { createBenefit } from './create-benefit';
import { createBenefitCategory } from './create-benefit-category';
import { createEligibilityRule } from './create-eligibility-rule';
import { createEmployeeRecord } from './create-employee-record';
import { deleteEmployeeRecord } from './delete-employee-record';
import { deleteBenefit } from './delete-benefit';
import { createRuleCategory } from './create-rule-category';
import { createRuleDefinition } from './create-rule-definition';
import { deleteBenefitCategory } from './delete-benefit-category';
import { deleteEligibilityRule } from './delete-eligibility-rule';
import { deleteRuleDefinition } from './delete-rule-definition';
import { overrideEmployeeBenefitEligibility } from './override-employee-benefit-eligibility';
import { recalculateEmployeeEligibility } from './recalculate-employee-eligibility';
import { reviewApprovalRequest } from './review-approval-request';
import { reviewBenefitRequest } from './review-benefit-request';
import { setBenefitStatus } from './set-benefit-status';
import { submitBenefitCreateRequest } from './submit-benefit-create-request';
import { submitBenefitUpdateRequest } from './submit-benefit-update-request';
import { submitRuleDefinitionCreateRequest } from './submit-rule-definition-create-request';
import { submitRuleDefinitionUpdateRequest } from './submit-rule-definition-update-request';
import { submitEmployeeBenefitRequest } from './submit-employee-benefit-request';
import { updateBenefit } from './update-benefit';
import { updateEmployeeRecord } from './update-employee-record';
import { updateEligibilityRule } from './update-eligibility-rule';
import { updateRuleDefinition } from './update-rule-definition';
import type {
	MutationCreateBenefitArgs,
	MutationCreateApprovalRequestArgs,
	MutationCreateBenefitCategoryArgs,
	MutationCreateEligibilityRuleArgs,
	MutationCancelEmployeeBenefitRequestArgs,
	MutationCreateEmployeeArgs,
	MutationDeleteBenefitArgs,
	MutationDeleteEmployeeArgs,
	MutationCreateRuleCategoryArgs,
	MutationCreateRuleDefinitionArgs,
	MutationDeleteBenefitCategoryArgs,
	MutationDeleteEligibilityRuleArgs,
	MutationDeleteRuleDefinitionArgs,
	MutationOverrideEmployeeBenefitEligibilityArgs,
	MutationRecalculateEmployeeEligibilityArgs,
	MutationReviewApprovalRequestArgs,
	MutationReviewBenefitRequestArgs,
	MutationSetBenefitStatusArgs,
	MutationSubmitBenefitCreateRequestArgs,
	MutationSubmitBenefitUpdateRequestArgs,
	MutationSubmitEmployeeBenefitRequestArgs,
	MutationSubmitRuleDefinitionCreateRequestArgs,
	MutationSubmitRuleDefinitionUpdateRequestArgs,
	MutationUpdateBenefitArgs,
	MutationUpdateEmployeeArgs,
	MutationUpdateEligibilityRuleArgs,
	MutationUpdateRuleDefinitionArgs,
} from '../../generated/resolvers-types';
import { uploadContract, UploadContractInput } from './upload-contract';

type GraphQLContext = {
	DB: D1Database;
	CONTRACTS_BUCKET: R2Bucket;
	RESEND_API_KEY?: string;
	RESEND_FROM_EMAIL?: string;
	RESEND_FROM_NAME?: string;
	waitUntil?: (promise: Promise<unknown>) => void;
};

export const mutationResolvers = {
	createEmployee: (_: unknown, args: MutationCreateEmployeeArgs, { DB }: GraphQLContext) => createEmployeeRecord(DB, args),

	updateEmployee: (_: unknown, args: MutationUpdateEmployeeArgs, { DB }: GraphQLContext) =>
		updateEmployeeRecord(DB, args),

	deleteEmployee: (_: unknown, { id }: MutationDeleteEmployeeArgs, { DB }: GraphQLContext) =>
		deleteEmployeeRecord(DB, id),

	createApprovalRequest: (_: unknown, args: MutationCreateApprovalRequestArgs, context: GraphQLContext) =>
		createApprovalRequest(context, args),

	cancelEmployeeBenefitRequest: (
		_: unknown,
		args: MutationCancelEmployeeBenefitRequestArgs,
		{ DB }: GraphQLContext,
	) => cancelEmployeeBenefitRequest(DB, args),

	overrideEmployeeBenefitEligibility: (
		_: unknown,
		args: MutationOverrideEmployeeBenefitEligibilityArgs,
		{ DB }: GraphQLContext,
	) => overrideEmployeeBenefitEligibility(DB, args),

	submitBenefitCreateRequest: (
		_: unknown,
		args: MutationSubmitBenefitCreateRequestArgs,
		context: GraphQLContext,
	) => submitBenefitCreateRequest(context, args),

	submitBenefitUpdateRequest: (
		_: unknown,
		args: MutationSubmitBenefitUpdateRequestArgs,
		context: GraphQLContext,
	) => submitBenefitUpdateRequest(context, args),

	submitRuleDefinitionCreateRequest: (
		_: unknown,
		args: MutationSubmitRuleDefinitionCreateRequestArgs,
		{ DB }: GraphQLContext,
	) => submitRuleDefinitionCreateRequest(DB, args),

	submitRuleDefinitionUpdateRequest: (
		_: unknown,
		args: MutationSubmitRuleDefinitionUpdateRequestArgs,
		{ DB }: GraphQLContext,
	) => submitRuleDefinitionUpdateRequest(DB, args),

	createBenefit: (_: unknown, args: MutationCreateBenefitArgs, { DB }: GraphQLContext) => createBenefit(DB, args),

	updateBenefit: (_: unknown, args: MutationUpdateBenefitArgs, { DB }: GraphQLContext) => updateBenefit(DB, args),

	setBenefitStatus: (_: unknown, args: MutationSetBenefitStatusArgs, { DB }: GraphQLContext) =>
		setBenefitStatus(DB, args),

	createBenefitCategory: (_: unknown, args: MutationCreateBenefitCategoryArgs, { DB }: GraphQLContext) =>
		createBenefitCategory(DB, args),

	deleteBenefit: (_: unknown, { id }: MutationDeleteBenefitArgs, { DB }: GraphQLContext) => deleteBenefit(DB, id),

	deleteBenefitCategory: (_: unknown, { id }: MutationDeleteBenefitCategoryArgs, { DB }: GraphQLContext) =>
		deleteBenefitCategory(DB, id),

	createRuleCategory: (_: unknown, args: MutationCreateRuleCategoryArgs, { DB }: GraphQLContext) =>
		createRuleCategory(DB, args),

	createRuleDefinition: (_: unknown, args: MutationCreateRuleDefinitionArgs, { DB }: GraphQLContext) =>
		createRuleDefinition(DB, args),

	updateRuleDefinition: (_: unknown, args: MutationUpdateRuleDefinitionArgs, { DB }: GraphQLContext) =>
		updateRuleDefinition(DB, args),

	deleteRuleDefinition: (_: unknown, { id }: MutationDeleteRuleDefinitionArgs, { DB }: GraphQLContext) =>
		deleteRuleDefinition(DB, id),

	createEligibilityRule: (_: unknown, args: MutationCreateEligibilityRuleArgs, { DB }: GraphQLContext) =>
		createEligibilityRule(DB, args),

	updateEligibilityRule: (_: unknown, args: MutationUpdateEligibilityRuleArgs, { DB }: GraphQLContext) =>
		updateEligibilityRule(DB, args),

	deleteEligibilityRule: (_: unknown, { id }: MutationDeleteEligibilityRuleArgs, { DB }: GraphQLContext) =>
		deleteEligibilityRule(DB, id),

	recalculateEmployeeEligibility: (
		_: unknown,
		{ employeeId }: MutationRecalculateEmployeeEligibilityArgs,
		{ DB }: GraphQLContext,
	) =>
		recalculateEmployeeEligibility(DB, employeeId),

	reviewApprovalRequest: (
		_: unknown,
		args: MutationReviewApprovalRequestArgs,
		context: GraphQLContext,
	) => reviewApprovalRequest(context, args),

	reviewBenefitRequest: (_: unknown, args: MutationReviewBenefitRequestArgs, context: GraphQLContext) =>
		reviewBenefitRequest(context, args),

	submitEmployeeBenefitRequest: (
		_: unknown,
		args: MutationSubmitEmployeeBenefitRequestArgs,
		context: GraphQLContext,
	) => submitEmployeeBenefitRequest(context, args),

	uploadContract: (_: unknown, { input }: { input: UploadContractInput }, { CONTRACTS_BUCKET, DB }: GraphQLContext) =>
		uploadContract({ DB, CONTRACTS_BUCKET }, input),
};
