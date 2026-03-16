import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { benefits } from "./benefits";
import { eligibilityRuleOperators } from "./eligibility-rules";
import { rules } from "./rules";

export const benefitRules = sqliteTable("benefit_rules", {
  id: text("id").primaryKey(),
  benefitId: text("benefit_id")
    .notNull()
    .references(() => benefits.id),
  ruleId: text("rule_id")
    .notNull()
    .references(() => rules.id),
  operator: text("operator", { enum: eligibilityRuleOperators }).notNull(),
  value: text("value").notNull(),
  errorMessage: text("error_message").notNull(),
  priority: integer("priority").notNull().default(1),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});
