import { and, eq, ne, or } from "drizzle-orm";

import { getDb } from "../db";
import { employees } from "../db/schema/employees";

const DEFAULT_FROM_NAME = "EBMS";
const RESEND_API_URL = "https://api.resend.com/emails";

type ApprovalRole = "finance_manager" | "hr_admin";

type EmployeeNotificationTarget = {
  email: string;
  id: string;
  name: string;
  role: string;
};

export type NotificationRuntime = {
  DB: D1Database;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  RESEND_FROM_NAME?: string;
  waitUntil?: (promise: Promise<unknown>) => void;
};

export type EmailSendResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      reason:
        | "invalid_target_role"
        | "missing_api_key"
        | "missing_from_email"
        | "no_recipients"
        | "request_failed"
        | "requester_not_found";
      skipped?: boolean;
      status?: number;
    };

type SendEmailInput = {
  html?: string;
  kind: string;
  subject: string;
  text: string;
  to: string[];
};

type ApprovalRequestSubmittedInput = {
  actionType: string;
  entityType: string;
  requestId: string;
  requestedBy: string;
  targetRole: string;
};

type ApprovalReviewedInput = {
  actionType: string;
  approved: boolean;
  entityType: string;
  requestId: string;
  requestedBy: string;
  reviewComment?: string | null;
  reviewedBy: string;
};

type BenefitRequestReviewedInput = {
  approved: boolean;
  benefitTitle: string;
  employeeEmail: string | null | undefined;
  requestId: string;
  reviewerName?: string | null;
};

type EmployeeBenefitRequestSubmittedInput = {
  approvalRole: string;
  benefitTitle: string;
  employeeId: string;
  employeeName: string;
  requestId: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeEmail(value: string | null | undefined) {
  return value?.trim().toLowerCase() || null;
}

function uniqueEmails(values: string[]) {
  return [
    ...new Set(
      values
        .map((value) => normalizeEmail(value))
        .filter((value): value is string => Boolean(value)),
    ),
  ];
}

function isApprovalRole(value: string): value is ApprovalRole {
  return value === "finance_manager" || value === "hr_admin";
}

function formatRoleLabel(role: ApprovalRole) {
  return role === "finance_manager" ? "Finance" : "HR";
}

function formatApprovalSummary(actionType: string, entityType: string) {
  const normalizedAction =
    actionType === "create" || actionType === "update" || actionType === "delete"
      ? actionType
      : "change";
  const normalizedEntity =
    entityType === "benefit" || entityType === "rule" ? entityType : "item";

  return `${normalizedEntity} ${normalizedAction} request`;
}

function buildHtml(paragraphs: string[]) {
  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

function buildFromAddress(runtime: NotificationRuntime) {
  const fromEmail = normalizeEmail(runtime.RESEND_FROM_EMAIL);
  if (!fromEmail) {
    return null;
  }

  const fromName = runtime.RESEND_FROM_NAME?.trim() || DEFAULT_FROM_NAME;
  return `${fromName} <${fromEmail}>`;
}

async function resolveEmployeeByIdentifier(
  DB: D1Database,
  identifier: string,
): Promise<EmployeeNotificationTarget | null> {
  const normalizedIdentifier = identifier.trim();
  if (!normalizedIdentifier) {
    return null;
  }

  const db = getDb({ DB });
  const normalizedEmailIdentifier = normalizedIdentifier.toLowerCase();
  const [employee] = await db
    .select({
      email: employees.email,
      id: employees.id,
      name: employees.name,
      role: employees.role,
    })
    .from(employees)
    .where(
      or(
        eq(employees.id, normalizedIdentifier),
        eq(employees.email, normalizedEmailIdentifier),
        eq(employees.name, normalizedIdentifier),
      ),
    )
    .limit(1);

  return employee ?? null;
}

async function listRoleRecipientEmails(
  DB: D1Database,
  role: ApprovalRole,
  excludeEmployeeId?: string | null,
) {
  const db = getDb({ DB });
  const rows = await db
    .select({
      email: employees.email,
    })
    .from(employees)
    .where(
      excludeEmployeeId
        ? and(eq(employees.role, role), ne(employees.id, excludeEmployeeId))
        : eq(employees.role, role),
    );

  return uniqueEmails(rows.map((row) => row.email));
}

export function scheduleNotification(
  runtime: NotificationRuntime,
  kind: string,
  operation: () => Promise<unknown>,
) {
  const task = (async () => {
    try {
      await operation();
    } catch (error) {
      console.error("[notifications] Notification task failed.", {
        error: error instanceof Error ? error.message : String(error),
        kind,
      });
    }
  })();

  if (runtime.waitUntil) {
    runtime.waitUntil(task);
    return;
  }

  void task;
}

export async function sendEmail(
  runtime: NotificationRuntime,
  input: SendEmailInput,
): Promise<EmailSendResult> {
  if (!runtime.RESEND_API_KEY?.trim()) {
    console.warn("[notifications] Email skipped.", {
      kind: input.kind,
      reason: "missing_api_key",
    });
    return {
      ok: false,
      reason: "missing_api_key",
      skipped: true,
    };
  }

  const from = buildFromAddress(runtime);
  if (!from) {
    console.warn("[notifications] Email skipped.", {
      kind: input.kind,
      reason: "missing_from_email",
    });
    return {
      ok: false,
      reason: "missing_from_email",
      skipped: true,
    };
  }

  const recipients = uniqueEmails(input.to);
  if (recipients.length === 0) {
    console.warn("[notifications] Email skipped.", {
      kind: input.kind,
      reason: "no_recipients",
    });
    return {
      ok: false,
      reason: "no_recipients",
      skipped: true,
    };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      body: JSON.stringify({
        from,
        html: input.html,
        subject: input.subject,
        text: input.text,
        to: recipients,
      }),
      headers: {
        "Authorization": `Bearer ${runtime.RESEND_API_KEY.trim()}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      console.error("[notifications] Email send failed.", {
        kind: input.kind,
        recipientCount: recipients.length,
        status: response.status,
      });
      return {
        ok: false,
        reason: "request_failed",
        status: response.status,
      };
    }

    console.info("[notifications] Email sent.", {
      kind: input.kind,
      recipientCount: recipients.length,
    });
    return { ok: true };
  } catch (error) {
    console.error("[notifications] Email send failed.", {
      error: error instanceof Error ? error.message : String(error),
      kind: input.kind,
      recipientCount: recipients.length,
    });
    return {
      ok: false,
      reason: "request_failed",
    };
  }
}

export async function sendApprovalRequestSubmittedNotification(
  runtime: NotificationRuntime,
  input: ApprovalRequestSubmittedInput,
) {
  if (!isApprovalRole(input.targetRole)) {
    console.warn("[notifications] Approval notification skipped.", {
      kind: "approval_request_submitted",
      reason: "invalid_target_role",
      targetRole: input.targetRole,
    });
    return {
      ok: false,
      reason: "invalid_target_role",
      skipped: true,
    } satisfies EmailSendResult;
  }

  const requester = await resolveEmployeeByIdentifier(runtime.DB, input.requestedBy);
  // TODO: Replace role-wide delivery with explicit reviewer routing when approver ownership exists in the model.
  const recipients = await listRoleRecipientEmails(
    runtime.DB,
    input.targetRole,
    requester?.id ?? null,
  );
  const approvalSummary = formatApprovalSummary(input.actionType, input.entityType);
  const targetRoleLabel = formatRoleLabel(input.targetRole);
  const requesterLabel = requester
    ? `${requester.name} (${requester.email})`
    : input.requestedBy.trim() || "A teammate";
  const textLines = [
    `A new ${approvalSummary} was submitted in EBMS.`,
    `Target reviewers: ${targetRoleLabel}`,
    `Requested by: ${requesterLabel}`,
    `Request ID: ${input.requestId}`,
  ];

  return sendEmail(runtime, {
    html: buildHtml(textLines),
    kind: "approval_request_submitted",
    subject: `EBMS: ${approvalSummary} submitted`,
    text: textLines.join("\n"),
    to: recipients,
  });
}

export async function sendApprovalReviewedNotification(
  runtime: NotificationRuntime,
  input: ApprovalReviewedInput,
) {
  const requester = await resolveEmployeeByIdentifier(runtime.DB, input.requestedBy);
  if (!requester) {
    console.warn("[notifications] Approval review notification skipped.", {
      kind: "approval_request_reviewed",
      reason: "requester_not_found",
      requestId: input.requestId,
    });
    return {
      ok: false,
      reason: "requester_not_found",
      skipped: true,
    } satisfies EmailSendResult;
  }

  const reviewer = await resolveEmployeeByIdentifier(runtime.DB, input.reviewedBy);
  const approvalSummary = formatApprovalSummary(input.actionType, input.entityType);
  const decisionLabel = input.approved ? "approved" : "rejected";
  const reviewerLabel = reviewer ? reviewer.name : "A reviewer";
  const textLines = [
    `Your ${approvalSummary} was ${decisionLabel} in EBMS.`,
    `Reviewed by: ${reviewerLabel}`,
    `Request ID: ${input.requestId}`,
  ];

  if (input.reviewComment?.trim()) {
    textLines.push(`Review comment: ${input.reviewComment.trim()}`);
  }

  return sendEmail(runtime, {
    html: buildHtml(textLines),
    kind: "approval_request_reviewed",
    subject: `EBMS: ${approvalSummary} ${decisionLabel}`,
    text: textLines.join("\n"),
    to: [requester.email],
  });
}

export async function sendBenefitRequestReviewedNotification(
  runtime: NotificationRuntime,
  input: BenefitRequestReviewedInput,
) {
  const decisionLabel = input.approved ? "approved" : "rejected";
  const textLines = [
    `Your request for ${input.benefitTitle} was ${decisionLabel} in EBMS.`,
    `Request ID: ${input.requestId}`,
  ];

  if (input.reviewerName?.trim()) {
    textLines.push(`Reviewed by: ${input.reviewerName.trim()}`);
  }

  return sendEmail(runtime, {
    html: buildHtml(textLines),
    kind: "benefit_request_reviewed",
    subject: `EBMS: ${input.benefitTitle} request ${decisionLabel}`,
    text: textLines.join("\n"),
    to: input.employeeEmail ? [input.employeeEmail] : [],
  });
}

export async function sendEmployeeBenefitRequestSubmittedNotification(
  runtime: NotificationRuntime,
  input: EmployeeBenefitRequestSubmittedInput,
) {
  if (!isApprovalRole(input.approvalRole)) {
    console.warn("[notifications] Benefit request notification skipped.", {
      approvalRole: input.approvalRole,
      kind: "employee_benefit_request_submitted",
      reason: "invalid_target_role",
    });
    return {
      ok: false,
      reason: "invalid_target_role",
      skipped: true,
    } satisfies EmailSendResult;
  }

  // TODO: Replace role-wide delivery with explicit reviewer routing when approval ownership exists in the model.
  const recipients = await listRoleRecipientEmails(
    runtime.DB,
    input.approvalRole,
    input.employeeId,
  );
  const reviewerGroupLabel = formatRoleLabel(input.approvalRole);
  const textLines = [
    `A new employee benefit request is pending review in EBMS.`,
    `Benefit: ${input.benefitTitle}`,
    `Requested by: ${input.employeeName}`,
    `Target reviewers: ${reviewerGroupLabel}`,
    `Request ID: ${input.requestId}`,
  ];

  return sendEmail(runtime, {
    html: buildHtml(textLines),
    kind: "employee_benefit_request_submitted",
    subject: `EBMS: ${input.benefitTitle} request submitted`,
    text: textLines.join("\n"),
    to: recipients,
  });
}
