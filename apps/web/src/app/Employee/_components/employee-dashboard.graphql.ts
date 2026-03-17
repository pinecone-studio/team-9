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

export const BENEFIT_REQUESTS_QUERY = `
  query EmployeeBenefitRequests($employeeId: ID!) {
    benefitRequests(employeeId: $employeeId) {
      id
      status
      created_at
      updated_at
      approval_role
      employee {
        id
        name
        email
        position
      }
      benefit {
        id
        title
        category
      }
      reviewed_by {
        id
        name
        email
        position
      }
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

export type BenefitRequestsQueryResult = {
  benefitRequests?: Array<{
    approval_role: "finance_manager" | "hr_admin";
    benefit: {
      category: string;
      id: string;
      title: string;
    };
    created_at: string;
    employee: {
      email: string;
      id: string;
      name: string;
      position: string;
    };
    id: string;
    reviewed_by?: {
      email: string;
      id: string;
      name: string;
      position: string;
    } | null;
    status: string;
    updated_at: string;
  }>;
};

export type RecalculateEligibilityMutationResult = {
  recalculateEmployeeEligibility?: DashboardQueryResult["employeeEligibility"];
};

export type EmployeeBenefitStatusOverride = "Active" | "Eligible" | "Pending";
