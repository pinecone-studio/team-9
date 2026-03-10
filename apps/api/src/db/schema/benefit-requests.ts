import { sqliteTable, text } from "drizzle-orm/sqlite-core";

import { benefits } from "./benefits";
import { employees } from "./employees";

export const benefitRequestStatuses = ["pending", "approved", "rejected", "cancelled"] as const;

export const benefitRequests = sqliteTable("benefit_requests", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id")
    .notNull()
    .references(() => employees.id),
  benefitId: text("benefit_id")
    .notNull()
    .references(() => benefits.id),
  status: text("status", { enum: benefitRequestStatuses }).notNull().default("pending"),
  contractVersionAccepted: text("contract_version_accepted"),
  contractAcceptedAt: text("contract_accepted_at"),
  reviewedBy: text("reviewed_by").references(() => employees.id),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
