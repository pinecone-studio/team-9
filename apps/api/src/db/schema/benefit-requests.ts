import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { benefits } from "./benefits";
import { employees } from "./employees";

export const benefitRequests = sqliteTable("benefit_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employees.id),
  benefitId: integer("benefit_id")
    .notNull()
    .references(() => benefits.id),
  status: text("status").notNull().default("pending"),
  requestedAt: integer("requested_at", { mode: "timestamp" }).notNull(),
  reviewedBy: integer("reviewed_by"),
  reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
  comment: text("comment"),
});
