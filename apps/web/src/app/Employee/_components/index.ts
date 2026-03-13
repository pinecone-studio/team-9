export const employeeComponentSlots = ["profile-card", "benefit-list"] as const;
export type EmployeeComponentSlot = (typeof employeeComponentSlots)[number];
