import type { DashboardPageDataQuery } from "@/shared/apollo/generated";

export type DashboardActivityEntry = DashboardPageDataQuery["listAuditLogEntries"][number];
export type DashboardBenefitSummary = DashboardPageDataQuery["listBenefitEligibilitySummary"][number];
export type DashboardRuleDefinition = DashboardPageDataQuery["ruleDefinitions"][number];

type ActivityMetadata = {
  description?: string;
  message?: string;
  title?: string;
};

function capitalize(value: string): string {
  if (!value) return value;
  return value[0].toUpperCase() + value.slice(1);
}

function normalizeWords(value: string): string {
  return value.replaceAll("_", " ").trim().toLowerCase();
}

function parseActivityMetadata(metadata: string | null | undefined): ActivityMetadata | null {
  if (!metadata) return null;
  try {
    const parsed = JSON.parse(metadata) as ActivityMetadata;
    if (typeof parsed === "object" && parsed) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function formatActivityMessage(entry: DashboardActivityEntry): string {
  const metadata = parseActivityMetadata(entry.metadata);
  const metadataText = metadata?.message ?? metadata?.title ?? metadata?.description;
  if (metadataText) return metadataText;

  const action = capitalize(normalizeWords(entry.action));
  const entity = normalizeWords(entry.entityType);
  if (entry.entityId) {
    return `${action} ${entity} #${entry.entityId}`;
  }
  return `${action} ${entity}`;
}

export function formatActivityTime(rawIso: string): string {
  const current = new Date();
  const target = new Date(rawIso);

  if (Number.isNaN(target.valueOf())) return rawIso;

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const timeText = formatter.format(target);

  const currentDate = new Date(current.getFullYear(), current.getMonth(), current.getDate());
  const targetDate = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const dayDifference = Math.round(
    (currentDate.getTime() - targetDate.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (dayDifference === 0) return `Today at ${timeText}`;
  if (dayDifference === 1) return `Yesterday at ${timeText}`;

  const dateText = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(target);
  return `${dateText} at ${timeText}`;
}

export function formatRuleValueType(raw: string): string {
  return capitalize(normalizeWords(raw));
}

export function formatRuleDefaultValue(raw: string | null | undefined): string {
  if (!raw) return "Not set";
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed === "boolean") return parsed ? "Yes" : "No";
    if (typeof parsed === "number") return String(parsed);
    if (typeof parsed === "string" && parsed.trim()) return parsed;
    return raw;
  } catch {
    return raw;
  }
}

function toPercent(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

export function buildEligibilityOverview(rows: DashboardBenefitSummary[]) {
  const totals = rows.reduce(
    (acc, row) => {
      acc.eligible += row.eligibleEmployees;
      acc.blocked += row.blockedEmployees;
      acc.pending += row.pendingEmployees;
      return acc;
    },
    { blocked: 0, eligible: 0, pending: 0 },
  );

  const total = totals.eligible + totals.blocked + totals.pending;

  return {
    blockedPercent: toPercent(totals.blocked, total),
    eligiblePercent: toPercent(totals.eligible, total),
    pendingPercent: toPercent(totals.pending, total),
  };
}
