import { useQuery } from "@apollo/client/react";
import {
  CircleCheckBig,
  FileText,
  ListChecks,
  Shield,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react";

import {
  formatActivityTime,
} from "./dashboard-helpers";
import { AUDIT_LOGS_PAGE_QUERY, type AuditLogsPageDataQuery } from "./audit-logs.graphql";
import type { AuditLogEntry } from "./audit-log-types";
import { buildAuditLogEntries } from "./audit-log-utils";

function getActivityIcon(entry: AuditLogEntry): LucideIcon {
  const event = entry.event.toLowerCase();
  if (event.includes("rule")) return ListChecks;
  if (event.includes("contract")) return FileText;
  if (event.includes("request")) return UserRoundPlus;
  if (event.includes("activation")) return Shield;
  return CircleCheckBig;
}

function formatActivityMessage(entry: AuditLogEntry) {
  const itemLabel = `"${entry.benefitRule}"`;

  if (entry.event === "Benefit Requested" || entry.event === "Benefit Activation Submitted") {
    return `${entry.employee} requested ${itemLabel}`;
  }
  if (entry.event === "Benefit Request Approved" || entry.event === "Benefit Activation Approved") {
    return `${entry.performedBy.name} approved ${itemLabel} for ${entry.employee}`;
  }
  if (entry.event === "Benefit Request Rejected" || entry.event === "Benefit Activation Rejected") {
    return `${entry.performedBy.name} rejected ${itemLabel} for ${entry.employee}`;
  }
  if (entry.event === "Benefit Request Cancelled") {
    return `${entry.employee} cancelled ${itemLabel}`;
  }
  if (entry.event === "New Benefit Submitted") {
    return `${entry.performedBy.name} submitted benefit ${itemLabel}`;
  }
  if (entry.event === "New Benefit Approved") {
    return `${entry.performedBy.name} created benefit ${itemLabel}`;
  }
  if (entry.event === "Benefit Update Submitted") {
    return `${entry.performedBy.name} submitted update for ${itemLabel}`;
  }
  if (entry.event === "Benefit Update Approved") {
    return `${entry.performedBy.name} updated ${itemLabel}`;
  }
  if (entry.event === "New Rule Submitted") {
    return `${entry.performedBy.name} submitted rule ${itemLabel}`;
  }
  if (entry.event === "New Rule Approved") {
    return `${entry.performedBy.name} created rule ${itemLabel}`;
  }
  if (entry.event === "Rule Update Submitted") {
    return `${entry.performedBy.name} submitted update for rule ${itemLabel}`;
  }
  if (entry.event === "Rule Update Approved") {
    return `${entry.performedBy.name} updated rule ${itemLabel}`;
  }
  if (entry.event === "Rule Delete Submitted") {
    return `${entry.performedBy.name} submitted deletion of rule ${itemLabel}`;
  }
  if (entry.event === "Rule Delete Approved") {
    return `${entry.performedBy.name} deleted rule ${itemLabel}`;
  }

  return `${entry.event}: ${entry.benefitRule}`;
}

function DashboardRecentActivitySkeleton() {
  return Array.from({ length: 5 }, (_, index) => (
    <article className="flex h-[38px] w-full items-start gap-3" key={index}>
      <span className="h-8 w-8 rounded-full bg-[#F5F5F5]" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
        <span className="h-4 w-full max-w-[360px] rounded bg-[#F5F5F5]" />
        <span className="h-3 w-24 rounded bg-[#F5F5F5]" />
      </div>
    </article>
  ));
}

export default function DashboardRecentActivity() {
  const { data, loading } = useQuery<AuditLogsPageDataQuery>(AUDIT_LOGS_PAGE_QUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });
  const visibleEntries = buildAuditLogEntries(data).slice(0, 5);

  return (
    <section className="box-border flex h-[490px] w-full flex-col items-start gap-6 rounded-[14px] border border-[#E5E5E5] bg-white py-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex h-[44px] w-full flex-col items-start gap-2 px-6">
        <h2 className="h-4 text-[16px] leading-4 font-semibold text-[#0A0A0A]">
          Recent System Activity
        </h2>
        <p className="h-5 text-[14px] leading-5 text-[#737373]">
          Latest actions taken in the system.
        </p>
      </div>

      <div className="flex w-full flex-col gap-4 px-6">
        {loading && visibleEntries.length === 0 ? (
          <DashboardRecentActivitySkeleton />
        ) : visibleEntries.length > 0 ? (
          visibleEntries.map((entry) => {
            const Icon = getActivityIcon(entry);
            return (
              <article className="flex h-[38px] w-full items-start gap-3" key={entry.id}>
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5]">
                  <Icon className="h-4 w-4 text-[#737373]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] leading-5 text-[#0A0A0A]">
                    {formatActivityMessage(entry)}
                  </p>
                  <p className="text-[12px] leading-4 text-[#737373]">
                    {formatActivityTime(entry.occurredAt)}
                  </p>
                </div>
              </article>
            );
          })
        ) : (
          <p className="text-sm text-[#737373]">No recent activity recorded.</p>
        )}
      </div>
    </section>
  );
}
