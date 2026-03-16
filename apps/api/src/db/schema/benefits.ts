import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { benefitCategories } from "./benefit-categories";
import { approvalRoles } from "./approval-requests";

export const benefits = sqliteTable("benefits", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: text("category_id")
    .notNull()
    .references(() => benefitCategories.id),
  subsidyPercent: integer("subsidy_percent").notNull(),
  vendorName: text("vendor_name"),
  requiresContract: integer("requires_contract", { mode: "boolean" })
    .notNull()
    .default(false),
  isCore: integer("is_core", { mode: "boolean" }).notNull().default(false),
  approvalRole: text("approval_role", { enum: approvalRoles }).notNull().default("hr_admin"),
  activeContractId: text("active_contract_id"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});
