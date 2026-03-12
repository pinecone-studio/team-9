import { gql } from "@apollo/client";

// Source operations for GraphQL Code Generator.
export const EMPLOYEES_QUERY = gql`
  query EmployeesPage {
    employees {
      id
      name
      email
      position
      department
      employmentStatus
      hireDate
      responsibilityLevel
    }
  }
`;

export const EMPLOYEE_ELIGIBILITY_QUERY = gql`
  query EmployeeEligibility($employeeId: ID!) {
    employeeEligibility(employeeId: $employeeId) {
      status
      computedAt
      benefit {
        id
        title
        category
      }
    }
  }
`;

export const RECALCULATE_EMPLOYEE_ELIGIBILITY_MUTATION = gql`
  mutation RecalculateEmployeeEligibility($employeeId: ID!) {
    recalculateEmployeeEligibility(employeeId: $employeeId) {
      status
      computedAt
      benefit {
        id
        title
        category
      }
    }
  }
`;
