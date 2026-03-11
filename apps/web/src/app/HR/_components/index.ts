export const hrComponentSlots = ["summary-card", "request-table"] as const;
export type HrComponentSlot = (typeof hrComponentSlots)[number];
