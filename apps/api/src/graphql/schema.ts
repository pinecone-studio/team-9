export const typeDefs = /* GraphQL */ `
	type Employee {
		id: ID!
		name: String!
		position: String!
		email: String!
		department: String!
		employmentStatus: String!
		hireDate: String!
		responsibilityLevel: Int!
		benefits: [Benefit]
	}

  type Benefit {
    id: ID!
    title: String!
    description: String!
    category: String!
    categoryId: ID!
  }

  type BenefitCategory {
    id: ID!
    name: String!
  }

  type BenefitEligibility {
    benefit: Benefit!
    status: String!
    ruleEvaluationJson: String!
    computedAt: String!
  }

  type Contract {
    id: ID!
    benefitId: String!
    vendorName: String!
    version: String!
    r2ObjectKey: String!
    sha256Hash: String!
    effectiveDate: String!
    expiryDate: String!
    isActive: Boolean!
  }

  type ContractSignedUrl {
    contractId: ID!
    signedUrl: String!
    expiresAt: String!
  }

  input ContractInput {
    benefitId: String!
    vendorName: String!
    version: String!
    effectiveDate: String!
    expiryDate: String!
    fileBase64: String!
    fileName: String!
  }

  type Query {
    employees: [Employee!]!
    employee(id: ID!): Employee
    benefitCategories: [BenefitCategory!]!
    allBenefits: [Benefit!]!
    employeeEligibility(employeeId: ID!): [BenefitEligibility!]!
    contractSignedUrl(contractId: ID!): ContractSignedUrl!
  }

  type Mutation {
    createEmployee(name: String!, email: String!, position: String!): Employee
    createBenefitCategory(name: String!): BenefitCategory!
    deleteBenefitCategory(id: ID!): Boolean!
    recalculateEmployeeEligibility(employeeId: ID!): [BenefitEligibility!]!
    uploadContract(input: ContractInput!): Contract!
  }
`;
