import {
  EmployeeBenefitRequestsDocument,
  EmployeeDashboardDataDocument,
  RecalculateEmployeeEligibilityDocument,
  type EmployeeBenefitRequestsQuery as BenefitRequestsQueryResult,
  type EmployeeDashboardDataQuery as DashboardQueryResult,
  type RecalculateEmployeeEligibilityMutation as RecalculateEligibilityMutationResult,
} from "@/shared/apollo/generated";

export const DEFAULT_GRAPHQL_ENDPOINT =
  "https://ebms-backend.b94889340.workers.dev/graphql";

export const EMPLOYEE_DASHBOARD_QUERY = EmployeeDashboardDataDocument;
export const BENEFIT_REQUESTS_QUERY = EmployeeBenefitRequestsDocument;
export const RECALCULATE_EMPLOYEE_ELIGIBILITY_MUTATION =
  RecalculateEmployeeEligibilityDocument;

export type {
  BenefitRequestsQueryResult,
  DashboardQueryResult,
  RecalculateEligibilityMutationResult,
};

export type EmployeeBenefitStatusOverride = "Active" | "Eligible" | "Pending";
