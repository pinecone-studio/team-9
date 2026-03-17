export const DEFAULT_GRAPHQL_ENDPOINT =
  "https://ebms-backend.b94889340.workers.dev/graphql";

export const EMPLOYEE_DASHBOARD_QUERY = `
  query EmployeeDashboard($employeeId: ID!) {
    employee(id: $employeeId) {
      id
      employmentStatus
      responsibilityLevel
    }
    employeeEligibility(employeeId: $employeeId) {
      status
      computedAt
      ruleEvaluationJson
      benefit {
        approvalRole
        categoryId
        id
        isActive
        isCore
        requiresContract
        title
        description
        category
        subsidyPercent
        vendorName
      }
    }
    listBenefitEligibilitySummary {
      benefitId
      status
      rulesApplied
    }
  }
`;

export const APPROVAL_REQUESTS_QUERY = `
  query EmployeeApprovalRequests {
    approvalRequests {
      id
      entity_id
      entity_type
      status
      requested_by
      reviewed_by
      payload_json
      created_at
    }
  }
`;

export const RECALCULATE_EMPLOYEE_ELIGIBILITY_MUTATION = `
  mutation RecalculateEmployeeEligibility($employeeId: ID!) {
    recalculateEmployeeEligibility(employeeId: $employeeId) {
      status
      computedAt
      ruleEvaluationJson
      benefit {
        approvalRole
        categoryId
        id
        isActive
        isCore
        requiresContract
        title
        description
        category
        subsidyPercent
        vendorName
      }
    }
  }
`;

export type DashboardQueryResult = {
  employee?: {
    employmentStatus: string;
    id: string;
    responsibilityLevel: number;
  } | null;
  employeeEligibility?: Array<{
    benefit: {
      approvalRole: "finance_manager" | "hr_admin";
      category: string;
      categoryId: string;
      description: string;
      id: string;
      isActive: boolean;
      isCore: boolean;
      requiresContract: boolean;
      subsidyPercent?: number | null;
      title: string;
      vendorName?: string | null;
    };
    computedAt: string;
    ruleEvaluationJson: string;
    status: string;
  }>;
  listBenefitEligibilitySummary?: Array<{
    benefitId: string;
    rulesApplied: string[];
    status: string;
  }>;
};

export type ApprovalRequestsQueryResult = {
  approvalRequests?: Array<{
    created_at: string;
    entity_id?: string | null;
    entity_type: string;
    id: string;
    payload_json: string;
    requested_by: string;
    reviewed_by?: string | null;
    status: string;
  }>;
};

export type RecalculateEligibilityMutationResult = {
  recalculateEmployeeEligibility?: DashboardQueryResult["employeeEligibility"];
};

export type EmployeeBenefitStatusOverride = "Active" | "Eligible" | "Pending";
