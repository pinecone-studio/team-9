import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const approvalRequestEventActorTypes = [
  "employee",
  "reviewer",
  "system",
] as const;

export const approvalRequestEvents = sqliteTable("approval_request_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  approvalRequestId: text("approval_request_id").notNull(),
  actorIdentifier: text("actor_identifier"),
  actorType: text("actor_type", {
    enum: approvalRequestEventActorTypes,
  }).notNull(),
  createdAt: text("created_at").notNull(),
  label: text("label").notNull(),
  reviewComment: text("review_comment"),
});
