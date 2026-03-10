import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { benefits } from "./benefits";

export const employeeRuleTypes = [
  "employment_status",
  "okr_submitted",
  "attendance",
  "responsibility_level",
  "role",
  "tenure_days",
] as const;

export const eligibilityRuleOperators = ["eq", "neq", "gte", "lte", "in", "not_in"] as const;

export const eligibilityRules = sqliteTable("eligibility_rules", {
  id: text("id").primaryKey(),
  benefitId: text("benefit_id")
    .notNull()
    .references(() => benefits.id),
  ruleType: text("rule_type", { enum: employeeRuleTypes }).notNull(),
  operator: text("operator", { enum: eligibilityRuleOperators }).notNull(),
  value: text("value").notNull(),
  errorMessage: text("error_message").notNull(),
  priority: integer("priority").notNull().default(1),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});
