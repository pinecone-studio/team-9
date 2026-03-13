import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { eligibilityRuleOperators, employeeRuleTypes } from "./eligibility-rules";
import { ruleCategories } from "./rule-categories";

export const ruleValueTypes = ["number", "boolean", "enum", "date"] as const;

export const rules = sqliteTable(
  "rules",
  {
    id: text("id").primaryKey(),
    categoryId: text("category_id")
      .notNull()
      .references(() => ruleCategories.id),
    ruleType: text("rule_type", { enum: employeeRuleTypes }).notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    valueType: text("value_type", { enum: ruleValueTypes }).notNull(),
    allowedOperators: text("allowed_operators").notNull().default("[]"),
    optionsJson: text("options_json"),
    defaultUnit: text("default_unit"),
    defaultValue: text("default_value"),
    defaultOperator: text("default_operator", { enum: eligibilityRuleOperators }).notNull().default("eq"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  },
  (table) => ({
    categoryNameUnique: uniqueIndex("rules_category_name_unique").on(
      table.categoryId,
      table.name,
    ),
  }),
);
