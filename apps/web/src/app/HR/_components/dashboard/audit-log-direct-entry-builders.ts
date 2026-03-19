import type { AuditLogsDirectEntryRecord } from "./audit-logs.graphql";
import type { AuditLogEntry } from "./audit-log-types";
import { formatBenefitRuleLabel } from "./audit-log-people";

const EMPTY_VALUE = "—";

function parseDirectAuditMetadata(value: string | null | undefined) {
  if (!value) return null;

  try {
    return JSON.parse(value) as {
      benefitName?: string;
      title?: string;
      vendorName?: string | null;
    };
  } catch {
    return null;
  }
}

export function buildDirectAuditEntries(entry: AuditLogsDirectEntryRecord): AuditLogEntry[] {
  const normalizedEntityType = entry.entityType.trim().toLowerCase();
  const normalizedAction = entry.action.trim().toLowerCase();

  if (!(normalizedEntityType === "benefit_delete" || normalizedEntityType === "benefit")) {
    return [];
  }

  if (!(normalizedAction === "submitted" || normalizedAction.includes("delete"))) {
    return [];
  }

  const metadata = parseDirectAuditMetadata(entry.metadata);
  const benefitName = metadata?.benefitName?.trim() || metadata?.title?.trim() || "Untitled Benefit";
  const benefitRule = formatBenefitRuleLabel(benefitName, metadata?.vendorName);

  return [
    {
      actor: "admin",
      benefitRule,
      employee: EMPTY_VALUE,
      event: "Benefit Delete Submitted",
      id: `${entry.id}-direct`,
      occurredAt: entry.createdAt,
      performedBy: { name: "System", role: "Direct archive" },
      result: "Submitted",
      reviewedBy: EMPTY_VALUE,
    },
  ];
}
