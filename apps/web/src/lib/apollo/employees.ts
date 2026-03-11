import { gql } from "@apollo/client";

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

export type Employee = {
  department: string;
  email: string;
  employmentStatus: string;
  hireDate: string;
  id: string;
  name: string;
  position: string;
  responsibilityLevel: number;
};

export type BenefitEligibility = {
  computedAt: string;
  status: string;
  benefit: {
    category: string;
    id: string;
    title: string;
  };
};

export type EmployeesQueryData = {
  employees: Employee[] | null;
};

export type EmployeeEligibilityQueryData = {
  employeeEligibility: BenefitEligibility[];
};

export type RecalculateEligibilityMutationData = {
  recalculateEmployeeEligibility: BenefitEligibility[];
};

export type RecalculateEligibilityMutationVars = {
  employeeId: string;
};
