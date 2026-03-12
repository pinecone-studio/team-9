export type EmployeeRow = {
	department: string;
	id: string;
	name: string;
	email: string;
	employmentStatus: string;
	hireDate: string;
	role: string;
	responsibilityLevel: number | null;
};

export type BenefitRow = {
	id: string;
	name: string;
	categoryId: string | null;
	category: string | null;
	subsidy_percent?: number | null;
	vendor_name?: string | null;
	description?: string | null;
};

export type EmployeeModel = {
	department: string;
	id: string;
	name: string;
	email: string;
	employmentStatus: string;
	hireDate: string;
	position: string;
	responsibilityLevel: number;
};

export type BenefitModel = {
	id: string;
	title: string;
	description: string;
	categoryId: string;
	category: string;
};

export type BenefitCategoryModel = {
	id: string;
	name: string;
};

export type BenefitEligibilityModel = {
	benefit: BenefitModel;
	status: string;
	ruleEvaluationJson: string;
	computedAt: string;
};

export type GraphQLContext = {
	DB: D1Database;
	CONTRACTS_BUCKET: R2Bucket;
};

export type EmployeeIdentifierArgs = {
	id: string;
};

export type EmployeeEligibilityArgs = {
	employeeId: string;
};

export type CreateEmployeeArgs = {
	name: string;
	email: string;
	position: string;
};

export type BenefitCategoryIdentifierArgs = {
	id: string;
};

export type CreateBenefitCategoryArgs = {
	name: string;
};
