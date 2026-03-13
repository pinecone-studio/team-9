import { createBenefit } from './create-benefit';
import { createBenefitCategory } from './create-benefit-category';
import { createEmployeeRecord } from './create-employee-record';
import { deleteBenefit } from './delete-benefit';
import { deleteBenefitCategory } from './delete-benefit-category';
import { recalculateEmployeeEligibility } from './recalculate-employee-eligibility';
import { setBenefitStatus } from './set-benefit-status';
import { updateBenefit } from './update-benefit';
import type {
	MutationCreateBenefitArgs,
	MutationCreateBenefitCategoryArgs,
	MutationCreateEmployeeArgs,
	MutationDeleteBenefitArgs,
	MutationDeleteBenefitCategoryArgs,
	MutationRecalculateEmployeeEligibilityArgs,
	MutationSetBenefitStatusArgs,
	MutationUpdateBenefitArgs,
} from '../../generated/resolvers-types';
import { uploadContract, UploadContractInput } from './upload-contract';

type GraphQLContext = {
	DB: D1Database;
	CONTRACTS_BUCKET: R2Bucket;
};

export const mutationResolvers = {
	createEmployee: (_: unknown, args: MutationCreateEmployeeArgs, { DB }: GraphQLContext) => createEmployeeRecord(DB, args),

	createBenefit: (_: unknown, args: MutationCreateBenefitArgs, { DB }: GraphQLContext) => createBenefit(DB, args),

	updateBenefit: (_: unknown, args: MutationUpdateBenefitArgs, { DB }: GraphQLContext) => updateBenefit(DB, args),

	setBenefitStatus: (_: unknown, args: MutationSetBenefitStatusArgs, { DB }: GraphQLContext) =>
		setBenefitStatus(DB, args),

	createBenefitCategory: (_: unknown, args: MutationCreateBenefitCategoryArgs, { DB }: GraphQLContext) =>
		createBenefitCategory(DB, args),

	deleteBenefit: (_: unknown, { id }: MutationDeleteBenefitArgs, { DB }: GraphQLContext) => deleteBenefit(DB, id),

	deleteBenefitCategory: (_: unknown, { id }: MutationDeleteBenefitCategoryArgs, { DB }: GraphQLContext) =>
		deleteBenefitCategory(DB, id),

	recalculateEmployeeEligibility: (
		_: unknown,
		{ employeeId }: MutationRecalculateEmployeeEligibilityArgs,
		{ DB }: GraphQLContext,
	) =>
		recalculateEmployeeEligibility(DB, employeeId),

	uploadContract: (_: unknown, { input }: { input: UploadContractInput }, { CONTRACTS_BUCKET, DB }: GraphQLContext) =>
		uploadContract({ DB, CONTRACTS_BUCKET }, input),
};
