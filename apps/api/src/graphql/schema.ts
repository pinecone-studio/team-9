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
    requiresContract: Boolean!
    approvalRole: ApprovalRole!
    isActive: Boolean!
    isCore: Boolean!
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

  enum ApprovalRole {
    hr_admin
    finance_manager
  }

  enum ApprovalEntityType {
    rule
    benefit
  }

  enum ApprovalActionType {
    create
    update
  }

  enum ApprovalRequestStatus {
    pending
    approved
    rejected
  }

  type ApprovalRequest {
    id: ID!
    entity_type: ApprovalEntityType!
    entity_id: ID
    action_type: ApprovalActionType!
    status: ApprovalRequestStatus!
    target_role: ApprovalRole!
    requested_by: String!
    reviewed_by: String
    review_comment: String
    payload_json: String!
    snapshot_json: String
    created_at: String!
    reviewed_at: String
    is_active: Boolean!
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

  input BenefitContractUploadInput {
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
    isCore: Boolean
    approvalRole: ApprovalRole
  }

  input UpdateBenefitInput {
    id: ID!
    name: String!
    description: String!
    categoryId: ID!
    subsidyPercent: Int!
    vendorName: String
    requiresContract: Boolean
    isCore: Boolean
    isActive: Boolean
    approvalRole: ApprovalRole
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

  enum RuleValueType {
    number
    boolean
    enum
    date
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
    benefit_id: ID!
    rule_id: ID!
    category_id: ID!
    category_name: String!
    name: String!
    description: String!
    rule_type: RuleType!
    value_type: RuleValueType!
    operator: Operator!
    allowed_operators_json: String!
    options_json: String
    default_unit: String
    value: String!
    error_message: String!
    priority: Int!
    is_active: Boolean!
  }

  type RuleCategory {
    id: ID!
    name: String!
    description: String
  }

  type RuleDefinition {
    id: ID!
    category_id: ID!
    category_name: String!
    rule_type: RuleType!
    name: String!
    description: String!
    value_type: RuleValueType!
    allowed_operators_json: String!
    options_json: String
    default_unit: String
    default_value: String
    default_operator: Operator!
    is_active: Boolean!
    usage_count: Int!
    linked_benefits_json: String!
  }

  type AuditLogEntry {
    id: ID!
    action: String!
    entityType: String!
    entityId: ID
    metadata: String
    createdAt: String!
  }

  type BenefitEligibilitySummary {
    benefitId: ID!
    benefitName: String!
    category: String!
    subsidyPercent: Int
    rulesApplied: [String!]!
    activeEmployees: Int!
    eligibleEmployees: Int!
    blockedEmployees: Int!
    pendingEmployees: Int!
    status: String!
  }

  input CreateRuleCategoryInput {
    name: String!
    description: String
  }

  input CreateRuleDefinitionInput {
    categoryId: ID!
    ruleType: RuleType!
    name: String!
    description: String!
    valueType: RuleValueType!
    allowedOperators: [Operator!]!
    optionsJson: String
    defaultUnit: String
    defaultValue: String
    defaultOperator: Operator
    isActive: Boolean
  }

  input UpdateRuleDefinitionInput {
    id: ID!
    categoryId: ID
    ruleType: RuleType
    name: String
    description: String
    valueType: RuleValueType
    allowedOperators: [Operator!]
    optionsJson: String
    defaultUnit: String
    defaultValue: String
    defaultOperator: Operator
    isActive: Boolean
  }

  input CreateEligibilityRuleInput {
    benefitId: ID!
    ruleId: ID!
    operator: Operator!
    value: String!
    errorMessage: String!
    priority: Int
    isActive: Boolean
  }

  input UpdateEligibilityRuleInput {
    id: ID!
    ruleId: ID
    operator: Operator
    value: String
    errorMessage: String
    priority: Int
    isActive: Boolean
  }

  input CreateApprovalRequestInput {
    entityType: ApprovalEntityType!
    entityId: ID
    actionType: ApprovalActionType!
    targetRole: ApprovalRole!
    requestedBy: String!
    payloadJson: String!
    snapshotJson: String
  }

  input SubmitRuleDefinitionCreateRequestInput {
    requestedBy: String!
    rule: CreateRuleDefinitionInput!
  }

  input SubmitRuleDefinitionUpdateRequestInput {
    requestedBy: String!
    rule: UpdateRuleDefinitionInput!
  }

  input BenefitRuleAssignmentInput {
    ruleId: ID!
    operator: Operator!
    value: String!
    errorMessage: String!
    priority: Int
    isActive: Boolean
  }

  input SubmitBenefitCreateRequestInput {
    requestedBy: String!
    benefit: CreateBenefitInput!
    ruleAssignments: [BenefitRuleAssignmentInput!]
    contractUpload: BenefitContractUploadInput
  }

  input SubmitBenefitUpdateRequestInput {
    requestedBy: String!
    benefit: UpdateBenefitInput!
    ruleAssignments: [BenefitRuleAssignmentInput!]
    contractUpload: BenefitContractUploadInput
  }

  input ReviewApprovalRequestInput {
    id: ID!
    approved: Boolean!
    reviewedBy: String!
    reviewComment: String
  }

  type Query {
    employees: [Employee]
    employee(id: ID!): Employee
    employeeByEmail(email: String!): Employee
    benefitCategories: [BenefitCategory!]!
    benefitCatalog: [Benefit]
    allBenefits: [Benefit]
    approvalRequests(status: ApprovalRequestStatus, targetRole: ApprovalRole): [ApprovalRequest!]!
    approvalRequest(id: ID!): ApprovalRequest
    ruleCategories: [RuleCategory!]!
    ruleDefinitions(categoryId: ID, ruleType: RuleType): [RuleDefinition!]!
    eligibilityRules(benefitId: ID): [EligibilityRule!]!
    employeeEligibilityRecords(employeeId: ID!): [BenefitEligibility!]!
    employeeEligibility(employeeId: ID!): [BenefitEligibility!]!
    contractSignedUrl(contractId: ID!): ContractSignedUrl!
    contractSignedUrlByBenefit(benefitId: ID!): ContractSignedUrl!
    countPendingBenefitRequests: Int!
    countActiveContracts: Int!
    listAuditLogEntries(limit: Int): [AuditLogEntry!]!
    listBenefitEligibilitySummary: [BenefitEligibilitySummary!]!
  }

  type Mutation {
    createEmployee(name: String!, email: String!, position: String!): Employee
    createBenefit(input: CreateBenefitInput!): Benefit!
    updateBenefit(input: UpdateBenefitInput!): Benefit!
    createApprovalRequest(input: CreateApprovalRequestInput!): ApprovalRequest!
    submitBenefitCreateRequest(input: SubmitBenefitCreateRequestInput!): ApprovalRequest!
    submitBenefitUpdateRequest(input: SubmitBenefitUpdateRequestInput!): ApprovalRequest!
    submitRuleDefinitionCreateRequest(input: SubmitRuleDefinitionCreateRequestInput!): ApprovalRequest!
    submitRuleDefinitionUpdateRequest(input: SubmitRuleDefinitionUpdateRequestInput!): ApprovalRequest!
    reviewApprovalRequest(input: ReviewApprovalRequestInput!): ApprovalRequest!
    setBenefitStatus(input: SetBenefitStatusInput!): Benefit!
    deleteBenefit(id: ID!): Boolean!
    createBenefitCategory(name: String!): BenefitCategory!
    deleteBenefitCategory(id: ID!): Boolean!
    createRuleCategory(input: CreateRuleCategoryInput!): RuleCategory!
    createRuleDefinition(input: CreateRuleDefinitionInput!): RuleDefinition!
    updateRuleDefinition(input: UpdateRuleDefinitionInput!): RuleDefinition!
    deleteRuleDefinition(id: ID!): Boolean!
    createEligibilityRule(input: CreateEligibilityRuleInput!): EligibilityRule!
    updateEligibilityRule(input: UpdateEligibilityRuleInput!): EligibilityRule!
    deleteEligibilityRule(id: ID!): Boolean!
    recalculateEmployeeEligibility(employeeId: ID!): [BenefitEligibility!]!
    uploadContract(input: ContractInput!): Contract!
  }
`;
