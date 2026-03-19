import { ChevronDown, Filter, Search } from "lucide-react";

import type { AuditLogFilterOption, AuditLogFilters } from "./audit-log-types";

type AuditLogsFiltersProps = {
  actionCount: number;
  actorOptions: AuditLogFilterOption[];
  eventOptions: AuditLogFilterOption[];
  filters: AuditLogFilters;
  onActorChange: (value: string) => void;
  onEventChange: (value: string) => void;
  onResultChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  resultOptions: AuditLogFilterOption[];
};

function FilterSelect({
  className = "",
  label,
  onChange,
  options,
  value,
}: {
  className?: string;
  label: string;
  onChange: (value: string) => void;
  options: AuditLogFilterOption[];
  value: string;
}) {
  return (
    <label className={`relative ${className}`.trim()}>
      <span className="sr-only">{label}</span>
      <select
        className="h-9 w-full appearance-none rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 pr-10 text-[14px] leading-5 text-[#0A0A0A] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] outline-none transition focus:border-[#1D4ED8]"
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
  onSearchChange,
  resultOptions,
}: AuditLogsFiltersProps) {
  return (
    <section className="rounded-[14px] border border-[#E5E5E5] bg-white px-4 py-3 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-[#737373]">
            <Filter className="h-5 w-5" />
            <span className="text-[14px] leading-5 font-medium">Filters:</span>
          </div>

          <FilterSelect
            className="w-[160px]"
            label="Event type"
            onChange={onEventChange}
            options={eventOptions}
            value={filters.event}
          />
          <FilterSelect
            className="w-[140px]"
            label="Result"
            onChange={onResultChange}
            options={resultOptions}
            value={filters.result}
          />
          <FilterSelect
            className="w-[140px]"
            label="Actor"
            onChange={onActorChange}
            options={actorOptions}
            value={filters.actor}
          />
        </div>

        <label className="relative block w-full xl:max-w-[614px] xl:flex-1">
          <span className="sr-only">Search actions</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#51565B]" />
          <input
            className="h-9 w-full rounded-[4px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] pl-9 text-[14px] leading-[18px] text-[#51565B] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] outline-none transition placeholder:text-[#51565B] focus:border-[#1D4ED8]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search actions..."
            type="search"
            value={filters.search}
          />
        </label>

        <span className="sr-only">{actionCount} actions</span>
      </div>
    </section>
  );
}
