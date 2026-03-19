import { asc, eq } from "drizzle-orm";

import { getDb } from "../../db";
import { approvalRequestEvents } from "../../db/schema/approval-request-events";

type ApprovalRoleValue = "finance_manager" | "hr_admin";
type ApprovalStatusValue = "approved" | "pending" | "rejected";

type ApprovalRequestTimelineSeed = {
  createdAt: string;
  id: string;
  requestedBy: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewComment: string | null;
  status: ApprovalStatusValue;
  targetRole: ApprovalRoleValue;
};

type ApprovalRequestTimelineEntry = {
  actorIdentifier: string | null;
  actorType: "employee" | "reviewer" | "system";
  createdAt: string;
  id: string;
  label: string;
  reviewComment: string | null;
};

function formatApprovalRole(role: ApprovalRoleValue) {
  return role === "finance_manager" ? "Finance" : "HR";
}

export async function createInitialApprovalRequestEvents(
  DB: D1Database,
  params: {
    approvalRequestId: string;
    createdAt: string;
    requestedBy: string;
    targetRole: ApprovalRoleValue;
  },
) {
  const db = getDb({ DB });
  const { approvalRequestId, createdAt, requestedBy, targetRole } = params;

  await db.insert(approvalRequestEvents).values([
    {
      approvalRequestId,
      actorIdentifier: requestedBy,
      actorType: "employee",
      createdAt,
      label: "Request submitted",
      reviewComment: null,
    },
    {
      approvalRequestId,
      actorIdentifier: null,
      actorType: "system",
      createdAt,
      label: "Eligibility validated",
      reviewComment: null,
    },
    {
      approvalRequestId,
      actorIdentifier: null,
      actorType: "system",
      createdAt,
      label: `Routed to ${formatApprovalRole(targetRole)} review`,
      reviewComment: null,
    },
  ]);
}

export async function createApprovalReviewEvent(
  DB: D1Database,
  params: {
    approvalRequestId: string;
    approved: boolean;
    createdAt: string;
    reviewComment: string | null;
    reviewedBy: string;
  },
) {
  const db = getDb({ DB });
  const { approvalRequestId, approved, createdAt, reviewComment, reviewedBy } = params;

  await db.insert(approvalRequestEvents).values({
    approvalRequestId,
    actorIdentifier: reviewedBy,
    actorType: "reviewer",
    createdAt,
    label: approved ? "Request approved" : "Request rejected",
    reviewComment,
  });
}

export async function listApprovalRequestEvents(
  DB: D1Database,
  approvalRequestId: string,
): Promise<ApprovalRequestTimelineEntry[]> {
  const db = getDb({ DB });
  const rows = await db
    .select()
    .from(approvalRequestEvents)
    .where(eq(approvalRequestEvents.approvalRequestId, approvalRequestId))
    .orderBy(asc(approvalRequestEvents.id));

  return rows.map((row) => ({
    actorIdentifier: row.actorIdentifier,
    actorType: row.actorType,
    createdAt: row.createdAt,
    id: String(row.id),
    label: row.label,
    reviewComment: row.reviewComment,
  }));
}

export function buildFallbackApprovalRequestEvents(
  seed: ApprovalRequestTimelineSeed,
): ApprovalRequestTimelineEntry[] {
  const entries: ApprovalRequestTimelineEntry[] = [
    {
      actorIdentifier: seed.requestedBy,
      actorType: "employee",
      createdAt: seed.createdAt,
      id: `${seed.id}:submitted`,
      label: "Request submitted",
      reviewComment: null,
    },
    {
      actorIdentifier: null,
      actorType: "system",
      createdAt: seed.createdAt,
      id: `${seed.id}:validated`,
      label: "Eligibility validated",
      reviewComment: null,
    },
    {
      actorIdentifier: null,
      actorType: "system",
      createdAt: seed.createdAt,
      id: `${seed.id}:routed`,
      label: `Routed to ${formatApprovalRole(seed.targetRole)} review`,
      reviewComment: null,
    },
  ];

  if (seed.status !== "pending" && seed.reviewedAt && seed.reviewedBy) {
    entries.push({
      actorIdentifier: seed.reviewedBy,
      actorType: "reviewer",
      createdAt: seed.reviewedAt,
      id: `${seed.id}:reviewed`,
      label: seed.status === "approved" ? "Request approved" : "Request rejected",
      reviewComment: seed.reviewComment,
    });
  }

  return entries;
}
