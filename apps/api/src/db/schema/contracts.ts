import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { benefits } from "./benefits";

export const contracts = sqliteTable("contracts", {
  id: text("id").primaryKey(),
  benefitId: text("benefit_id")
    .notNull()
    .references(() => benefits.id),
  vendorName: text("vendor_name").notNull(),
  version: text("version").notNull(),
  r2ObjectKey: text("r2_object_key").notNull(),
  sha256Hash: text("sha256_hash").notNull(),
  effectiveDate: text("effective_date").notNull(),
  expiryDate: text("expiry_date").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});
