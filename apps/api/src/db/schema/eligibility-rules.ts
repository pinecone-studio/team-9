import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { benefits } from "./benefits";

export const eligibilityRules = sqliteTable("eligibility_rules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  benefitId: integer("benefit_id")
    .notNull()
    .references(() => benefits.id),
  ruleType: text("rule_type").notNull(),
  ruleConfig: text("rule_config").notNull(),
  priority: integer("priority").notNull().default(1),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
