import {
  CircleCheckBig,
  FileText,
  ListChecks,
  Shield,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react";

import {
  formatActivityMessage,
  formatActivityTime,
  type DashboardActivityEntry,
} from "./dashboard-helpers";

type DashboardRecentActivityProps = {
  entries: DashboardActivityEntry[];
};

function getActivityIcon(entityType: string): LucideIcon {
  const normalized = entityType.toLowerCase();
  if (normalized.includes("rule")) return ListChecks;
  if (normalized.includes("contract")) return FileText;
  if (normalized.includes("request")) return UserRoundPlus;
  if (normalized.includes("eligibility")) return Shield;
  return CircleCheckBig;
}

export default function DashboardRecentActivity({
  entries,
}: DashboardRecentActivityProps) {
  return (
    <section className="rounded-[14px] border border-[#E5E5E5] bg-white px-0 py-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="px-6">
        <h2 className="text-[16px] leading-4 font-semibold text-[#0A0A0A]">Recent System Activity</h2>
        <p className="mt-2 text-[14px] leading-5 text-[#737373]">Latest actions taken in the system.</p>
      </div>

      <div className="mt-6 space-y-4 px-6">
        {entries.length > 0 ? (
          entries.map((entry) => {
            const Icon = getActivityIcon(entry.entityType);
            return (
              <article className="flex items-start gap-3" key={entry.id}>
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F5F5F5]">
                  <Icon className="h-4 w-4 text-[#737373]" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[14px] leading-5 text-[#0A0A0A]">
                    {formatActivityMessage(entry)}
                  </p>
                  <p className="mt-1 text-[12px] leading-4 text-[#737373]">
                    {formatActivityTime(entry.createdAt)}
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
