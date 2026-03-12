import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const benefitCategories = sqliteTable("benefit_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});