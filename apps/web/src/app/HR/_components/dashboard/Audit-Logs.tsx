import { ChevronDown, Eye, Filter } from "lucide-react";

import {
  auditRows,
  filterOptions,
  statusStyles,
  summaryCards,
  type AuditStatus,
} from "./Audit-Logs.data";

function ResultBadge({ status }: { status: AuditStatus }) {
  return (
    <span
      className={`inline-flex h-[22px] items-center justify-center rounded-[4px] px-2 text-[12px] leading-4 font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export default function AuditLogs() {
  return (
    <div className="flex w-full flex-col gap-5">
      <section className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(({ icon: Icon, label, value }) => (
          <article
            className="flex h-[74px] items-center justify-between rounded-[14px] border border-[#E5E5E5] bg-white px-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]"
            key={label}
          >
            <div>
              <p className="text-[12px] leading-4 font-medium text-[#737373]">
                {label}
              </p>
              <p className="mt-1 text-[24px] leading-8 font-semibold text-[#0A0A0A]">
                {value}
              </p>
            </div>
            <span className="flex h-5 w-5 items-center justify-center text-[#737373]">
              <Icon className="h-5 w-5" />
            </span>
          </article>
        ))}
      </section>

      <section className="rounded-[14px] border border-[#E5E5E5] bg-white px-4 py-3 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-[#737373]">
            <Filter className="h-4 w-4" />
            <span className="text-[14px] leading-5 font-medium">Filters:</span>
          </div>

          {filterOptions.map((option) => (
            <button
              className="flex h-9 items-center justify-between gap-4 rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[14px] leading-5 text-[#0A0A0A] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
              key={option}
              type="button"
            >
              <span>{option}</span>
              <ChevronDown className="h-4 w-4 text-[#737373] opacity-60" />
            </button>
          ))}

          <div className="ml-auto text-[14px] leading-5 text-[#737373]">
            12 entries
          </div>
        </div>
      </section>

      <section className="rounded-[14px] border border-[#E5E5E5] bg-white py-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-h-[723px] overflow-auto">
          <table className="w-full min-w-[1298px] table-fixed border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5] text-left">
                <th className="w-[140px] px-2 py-3 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  Timestamp
                </th>
                <th className="w-[200px] px-2 py-3 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  Event
                </th>
                <th className="w-[382px] px-2 py-3 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  Subject
                </th>
                <th className="w-[150px] px-2 py-3 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  Performed By
                </th>
                <th className="w-[178px] px-2 py-3 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  Target
                </th>
                <th className="w-[100px] px-2 py-3 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  Result
                </th>
                <th className="w-[80px] px-2 py-3 text-right text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {auditRows.map((row) => {
                const Icon = row.icon;
                return (
                  <tr
                    className="border-b border-[#F0F0F0] text-left last:border-b-0"
                    key={`${row.timestamp}-${row.event}`}
                  >
                    <td className="px-2 py-4 text-[14px] leading-5 text-[#737373]">
                      {row.timestamp}
                    </td>
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-2 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                        <span className="flex h-4 w-4 items-center justify-center text-[#737373]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span>{row.event}</span>
                      </div>
                    </td>
                    <td className="px-2 py-4 text-[14px] leading-5 text-[#0A0A0A]">
                      {row.subject}
                    </td>
                    <td className="px-2 py-4">
                      <div className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
                        {row.performedBy.name}
                      </div>
                      <div className="text-[12px] leading-4 text-[#737373]">
                        {row.performedBy.role}
                      </div>
                    </td>
                    <td className="px-2 py-4 text-[14px] leading-5 text-[#737373]">
                      {row.target}
                    </td>
                    <td className="px-2 py-4">
                      <ResultBadge status={row.result} />
                    </td>
                    <td className="px-2 py-4 text-right">
                      <button
                        aria-label="View log entry"
                        className="inline-flex h-8 w-9 items-center justify-center rounded-[8px] text-[#0A0A0A] transition hover:bg-[#F5F5F5]"
                        type="button"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
