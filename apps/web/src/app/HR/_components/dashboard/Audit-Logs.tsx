"use client";

import { useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";

import AuditLogsFilters from "./AuditLogsFilters";
import AuditLogsSkeleton from "./AuditLogsSkeleton";
import AuditLogsSummaryCards from "./AuditLogsSummaryCards";
import AuditLogsTable from "./AuditLogsTable";
import { AUDIT_LOGS_PAGE_QUERY, type AuditLogsPageDataQuery } from "./audit-logs.graphql";
import {
  applyAuditLogFilters,
  buildAuditLogEntries,
  buildAuditLogSummary,
  buildEventOptions,
  buildResultOptions,
} from "./audit-log-utils";
import type { AuditLogFilters } from "./audit-log-types";

const ACTOR_OPTIONS = [
  { label: "All Actors", value: "all" },
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
] as const;

export default function AuditLogs() {
  const [filters, setFilters] = useState<AuditLogFilters>({
    actor: "all",
    event: "all",
    result: "all",
  });
  const { data, loading } = useQuery<AuditLogsPageDataQuery>(AUDIT_LOGS_PAGE_QUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const allEntries = useMemo(() => buildAuditLogEntries(data), [data]);
  const filteredEntries = useMemo(
    () => applyAuditLogFilters(allEntries, filters),
    [allEntries, filters],
  );
  const summary = useMemo(() => buildAuditLogSummary(filteredEntries), [filteredEntries]);
  const eventOptions = useMemo(
    () => [{ label: "All Events", value: "all" }, ...buildEventOptions(allEntries)],
    [allEntries],
  );
  const resultOptions = useMemo(
    () => [{ label: "All Results", value: "all" }, ...buildResultOptions(allEntries)],
    [allEntries],
  );

  if (loading && !data) {
    return <AuditLogsSkeleton />;
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <AuditLogsSummaryCards summary={summary} />
      <AuditLogsFilters
        actionCount={filteredEntries.length}
        actorOptions={[...ACTOR_OPTIONS]}
        eventOptions={eventOptions}
        filters={filters}
        onActorChange={(actor) => setFilters((current) => ({ ...current, actor }))}
        onEventChange={(event) => setFilters((current) => ({ ...current, event }))}
        onResultChange={(result) => setFilters((current) => ({ ...current, result }))}
        resultOptions={resultOptions}
      />
      <AuditLogsTable entries={filteredEntries} />
    </div>
  );
}
