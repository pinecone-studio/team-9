import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const benefits = sqliteTable("benefits", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  subsidyPercent: integer("subsidy_percent").notNull(),
  vendorName: text("vendor_name"),
  requiresContract: integer("requires_contract", { mode: "boolean" })
    .notNull()
    .default(false),
  activeContractId: text("active_contract_id"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});
