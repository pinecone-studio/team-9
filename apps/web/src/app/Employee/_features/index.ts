export const employeeFeatureKeys = ["overview", "requests"] as const;
export type EmployeeFeatureKey = (typeof employeeFeatureKeys)[number];
