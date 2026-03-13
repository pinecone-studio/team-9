import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const employees = sqliteTable("employees", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  nameEng: text("name_eng").notNull(),
  role: text("role").notNull(),
  department: text("department").notNull(),
  responsibilityLevel: integer("responsibility_level").notNull(),
  employmentStatus: text("employment_status").notNull().default("active"),
  hireDate: text("hire_date").notNull(),
  okrSubmitted: integer("okr_submitted", { mode: "boolean" }).notNull().default(false),
  lateArrivalCount: integer("late_arrival_count").notNull().default(0),
  lateArrivalUpdatedAt: text("late_arrival_updated_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
