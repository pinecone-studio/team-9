import type {
  EmployeeEligibilityQuery,
  EmployeesPageQuery,
} from "@/shared/apollo/generated";

export type Employee = NonNullable<
  NonNullable<EmployeesPageQuery["employees"]>[number]
>;

export type BenefitEligibility = EmployeeEligibilityQuery["employeeEligibility"][number];
