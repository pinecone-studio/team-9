import { createBenefitCategory } from './create-benefit-category';
import { createEmployeeRecord } from './create-employee-record';
import { deleteBenefitCategory } from './delete-benefit-category';
import { recalculateEmployeeEligibility } from './recalculate-employee-eligibility';
import type {
	MutationCreateBenefitCategoryArgs,
	MutationCreateEmployeeArgs,
	MutationDeleteBenefitCategoryArgs,
	MutationRecalculateEmployeeEligibilityArgs,
} from '../../generated/resolvers-types';
import { uploadContract, UploadContractInput } from './upload-contract';

type GraphQLContext = {
	DB: D1Database;
	CONTRACTS_BUCKET: R2Bucket;
};

export const mutationResolvers = {
	createEmployee: (_: unknown, args: MutationCreateEmployeeArgs, { DB }: GraphQLContext) => createEmployeeRecord(DB, args),

	createBenefitCategory: (_: unknown, args: MutationCreateBenefitCategoryArgs, { DB }: GraphQLContext) =>
		createBenefitCategory(DB, args),

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
