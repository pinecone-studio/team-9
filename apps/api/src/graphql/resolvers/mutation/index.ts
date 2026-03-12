import { createBenefitCategory } from './create-benefit-category';
import { createEmployeeRecord } from './create-employee-record';
import { deleteBenefitCategory } from './delete-benefit-category';
import { recalculateEmployeeEligibility } from './recalculate-employee-eligibility';
import type {
	BenefitCategoryIdentifierArgs,
	CreateBenefitCategoryArgs,
	CreateEmployeeArgs,
	EmployeeEligibilityArgs,
	GraphQLContext,
} from '../../../types/employee';
import { uploadContract, UploadContractInput } from './upload-contract';

export const mutationResolvers = {
	createEmployee: (_: unknown, args: CreateEmployeeArgs, { DB }: GraphQLContext) => createEmployeeRecord(DB, args),

	createBenefitCategory: (_: unknown, args: CreateBenefitCategoryArgs, { DB }: GraphQLContext) => createBenefitCategory(DB, args),

	deleteBenefitCategory: (_: unknown, { id }: BenefitCategoryIdentifierArgs, { DB }: GraphQLContext) =>
		deleteBenefitCategory(DB, id),

	recalculateEmployeeEligibility: (_: unknown, { employeeId }: EmployeeEligibilityArgs, { DB }: GraphQLContext) =>
		recalculateEmployeeEligibility(DB, employeeId),

	uploadContract: (_: unknown, { input }: { input: UploadContractInput }, { CONTRACTS_BUCKET, DB }: GraphQLContext) =>
		uploadContract({ DB, CONTRACTS_BUCKET }, input),
};
