export const typeDefs = `
	type Employee {
		id: ID!
		name: String!
		position: String!
		email: String!
		benefits: [Benefit]
	}

	type Benefit {
		id: ID!
		title: String!
		description: String!
		category: String!
	}

	type BenefitEligibility {
		benefit: Benefit!
		status: String!
		ruleEvaluationJson: String!
		computedAt: String!
	}

	type Query {
		employees: [Employee]
		employee(id: ID!): Employee
		allBenefits: [Benefit]
		employeeEligibility(employeeId: ID!): [BenefitEligibility!]!
	}

	type Mutation {
		createEmployee(name: String!, email: String!, position: String!): Employee
		recalculateEmployeeEligibility(employeeId: ID!): [BenefitEligibility!]!
	}
`;
