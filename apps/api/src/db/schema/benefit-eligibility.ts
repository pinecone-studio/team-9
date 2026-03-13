import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { benefits } from "./benefits";
import { employees } from "./employees";

export const benefitEligibilityStatuses = ["active", "eligible", "locked", "pending"] as const;

export const benefitEligibility = sqliteTable(
  "benefit_eligibility",
  {
    employeeId: text("employee_id")
      .notNull()
      .references(() => employees.id),
    benefitId: text("benefit_id")
      .notNull()
      .references(() => benefits.id),
    status: text("status", { enum: benefitEligibilityStatuses }).notNull(),
    ruleEvaluationJson: text("rule_evaluation_json").notNull(),
    computedAt: text("computed_at").notNull(),
    overrideBy: text("override_by").references(() => employees.id),
    overrideReason: text("override_reason"),
    overrideExpiresAt: text("override_expires_at"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.employeeId, table.benefitId] }),
  }),
);
