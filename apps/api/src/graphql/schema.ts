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
    subsidyPercent: Int
    vendorName: String
    isActive: Boolean!
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

  input CreateBenefitInput {
    name: String!
    description: String!
    categoryId: ID!
    subsidyPercent: Int!
    vendorName: String
    requiresContract: Boolean
  }

  input UpdateBenefitInput {
    id: ID!
    name: String!
    description: String!
    categoryId: ID!
    subsidyPercent: Int!
    vendorName: String
    requiresContract: Boolean
  }

  input SetBenefitStatusInput {
    id: ID!
    isActive: Boolean!
  }

  enum EmploymentStatus {
    active
    probation
    leave
    terminated
  }

  enum Operator {
    eq
    neq
    gte
    lte
    gt
    lt
    in
    not_in
  }

  enum RuleType {
    employment_status
    okr_submitted
    attendance
    responsibility_level
    role
    tenure_days
  }

  type EmployeeMetrics {
    employment_status: EmploymentStatus!
    okr_submitted: Boolean!
    attendance: Int!
    responsibility_level: Int!
    role: String!
    tenure_days: Int!
  }

  type EligibilityRule {
    id: ID!
    rule_type: RuleType!
    operator: Operator!
    value: String!
  }

  type Query {
    employees: [Employee]
    employee(id: ID!): Employee
    benefitCategories: [BenefitCategory!]!
    benefitCatalog: [Benefit]
    allBenefits: [Benefit]
    employeeEligibilityRecords(employeeId: ID!): [BenefitEligibility!]!
    employeeEligibility(employeeId: ID!): [BenefitEligibility!]!
    contractSignedUrl(contractId: ID!): ContractSignedUrl!
  }

  type Mutation {
    createEmployee(name: String!, email: String!, position: String!): Employee
    createBenefit(input: CreateBenefitInput!): Benefit!
    updateBenefit(input: UpdateBenefitInput!): Benefit!
    setBenefitStatus(input: SetBenefitStatusInput!): Benefit!
    deleteBenefit(id: ID!): Boolean!
    createBenefitCategory(name: String!): BenefitCategory!
    deleteBenefitCategory(id: ID!): Boolean!
    recalculateEmployeeEligibility(employeeId: ID!): [BenefitEligibility!]!
    uploadContract(input: ContractInput!): Contract!
  }
`;
