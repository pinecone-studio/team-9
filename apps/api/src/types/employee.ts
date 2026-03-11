export type EmployeeRow = {
	id: string;
	name: string;
	email: string;
	role: string;
};

export type BenefitRow = {
	id: string;
	name: string;
	category: string | null;
	subsidy_percent?: number | null;
	vendor_name?: string | null;
	description?: string | null;
};

export type EmployeeModel = {
	id: string;
	name: string;
	email: string;
	position: string;
};

export type BenefitModel = {
	id: string;
	title: string;
	description: string;
	category: string;
};

export type BenefitEligibilityModel = {
	benefit: BenefitModel;
	status: string;
	ruleEvaluationJson: string;
	computedAt: string;
};

export type GraphQLContext = {
	DB: D1Database;
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
