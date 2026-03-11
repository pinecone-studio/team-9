export const hrFeatureKeys = ["dashboard", "employees"] as const;
export type HrFeatureKey = (typeof hrFeatureKeys)[number];
