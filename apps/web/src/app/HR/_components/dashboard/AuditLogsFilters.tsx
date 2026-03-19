import { ChevronDown, Filter } from "lucide-react";

import type { AuditLogFilterOption, AuditLogFilters } from "./audit-log-types";

type AuditLogsFiltersProps = {
  actionCount: number;
  actorOptions: AuditLogFilterOption[];
  eventOptions: AuditLogFilterOption[];
  filters: AuditLogFilters;
  onActorChange: (value: string) => void;
  onEventChange: (value: string) => void;
  onResultChange: (value: string) => void;
  resultOptions: AuditLogFilterOption[];
};

function FilterSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: AuditLogFilterOption[];
  value: string;
}) {
  return (
    <label className="relative min-w-[180px]">
      <span className="sr-only">{label}</span>
      <select
        className="h-11 w-full appearance-none rounded-[10px] border border-[#E5E5E5] bg-white px-4 pr-10 text-[14px] leading-5 text-[#0A0A0A] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] outline-none transition focus:border-[#1D4ED8]"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#737373]" />
    </label>
  );
}

export default function AuditLogsFilters({
  actionCount,
  actorOptions,
  eventOptions,
  filters,
  onActorChange,
  onEventChange,
  onResultChange,
  resultOptions,
}: AuditLogsFiltersProps) {
  return (
    <section className="rounded-[14px] border border-[#E5E5E5] bg-white px-6 py-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-[#737373]">
          <Filter className="h-4 w-4" />
          <span className="text-[14px] leading-5 font-medium">Filters:</span>
        </div>

        <FilterSelect
          label="Event type"
          onChange={onEventChange}
          options={eventOptions}
          value={filters.event}
        />
        <FilterSelect
          label="Result"
          onChange={onResultChange}
          options={resultOptions}
          value={filters.result}
        />
        <FilterSelect
          label="Actor"
          onChange={onActorChange}
          options={actorOptions}
          value={filters.actor}
        />

        <div className="ml-auto text-[14px] leading-5 text-[#737373]">
          {actionCount} actions
        </div>
      </div>
    </section>
  );
}
