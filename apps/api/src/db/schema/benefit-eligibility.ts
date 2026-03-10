import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { benefits } from "./benefits";
import { employees } from "./employees";

export const benefitEligibility = sqliteTable("benefit_eligibility", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employees.id),
  benefitId: integer("benefit_id")
    .notNull()
    .references(() => benefits.id),
  isEligible: integer("is_eligible", { mode: "boolean" }).notNull(),
  reason: text("reason"),
  checkedAt: integer("checked_at", { mode: "timestamp" }).notNull(),
});
