export const employeeIconKeys = ["user", "gift"] as const;
export type EmployeeIconKey = (typeof employeeIconKeys)[number];
