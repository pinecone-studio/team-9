import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ruleCategories = sqliteTable("rule_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});
