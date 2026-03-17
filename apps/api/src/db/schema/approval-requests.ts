import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const approvalRoles = ["hr_admin", "finance_manager"] as const;
export const approvalEntityTypes = ["rule", "benefit"] as const;
export const approvalActionTypes = ["create", "update", "delete"] as const;
export const approvalRequestStatuses = ["pending", "approved", "rejected"] as const;

export const approvalRequests = sqliteTable("approval_requests", {
  id: text("id").primaryKey(),
  entityType: text("entity_type", { enum: approvalEntityTypes }).notNull(),
  entityId: text("entity_id"),
  actionType: text("action_type", { enum: approvalActionTypes }).notNull(),
  status: text("status", { enum: approvalRequestStatuses }).notNull().default("pending"),
  targetRole: text("target_role", { enum: approvalRoles }).notNull(),
  requestedBy: text("requested_by").notNull(),
  reviewedBy: text("reviewed_by"),
  reviewComment: text("review_comment"),
  payloadJson: text("payload_json").notNull(),
  snapshotJson: text("snapshot_json"),
  createdAt: text("created_at").notNull(),
  reviewedAt: text("reviewed_at"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});
