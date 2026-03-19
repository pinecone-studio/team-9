import {
  CircleCheckBig,
  CircleX,
  ListChecks,
  type LucideIcon,
  Upload,
  XCircle,
} from "lucide-react";

import { formatShortDateTime } from "@/app/(hr)/requests/components/approval-request-time-formatters";
import type { AuditLogEntry } from "./audit-log-types";

const RESULT_STYLES = {
  Approved: "bg-[#DCFCE7] text-[#166534]",
  Cancelled: "bg-[#F5F5F5] text-[#525252]",
  Rejected: "bg-[#FEF2F2] text-[#C10007]",
  Submitted: "bg-[#DBEAFE] text-[#1D4ED8]",
} as const;

function getEventIcon(event: string): LucideIcon {
  if (event.includes("Approved")) return CircleCheckBig;
  if (event.includes("Rejected")) return CircleX;
  if (event.includes("Cancelled")) return XCircle;
  if (event.includes("Submitted") || event.includes("Requested")) return Upload;
  return ListChecks;
}

export default function AuditLogsTable({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <section className="rounded-[14px] border border-[#E5E5E5] bg-white py-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="overflow-auto">
        <table className="w-full min-w-[1180px] table-fixed border-collapse">
          <thead>
            <tr className="border-b border-[#E5E5E5] text-left">
              {["Timestamp", "Event", "Employee", "Benefit / Rule", "Performed By", "Reviewed By", "Result"].map((label) => (
                <th
                  className="px-6 py-4 text-[14px] leading-5 font-medium text-[#0A0A0A]"
                  key={label}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.length > 0 ? (
              entries.map((entry) => {
                const Icon = getEventIcon(entry.event);
                return (
                  <tr className="border-b border-[#F0F0F0] last:border-b-0" key={entry.id}>
                    <td className="px-6 py-4 text-[14px] leading-5 text-[#737373]">
                      {formatShortDateTime(entry.occurredAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                        <Icon className="h-4 w-4 text-[#737373]" />
                        <span>{entry.event}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[14px] leading-5 text-[#737373]">{entry.employee}</td>
                    <td className="px-6 py-4 text-[14px] leading-5 text-[#0A0A0A]">{entry.benefitRule}</td>
                    <td className="px-6 py-4">
                      <div className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
                        {entry.performedBy.name}
                      </div>
                      <div className="text-[12px] leading-4 text-[#737373]">
                        {entry.performedBy.role}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[14px] leading-5 text-[#737373]">{entry.reviewedBy}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex h-[28px] items-center rounded-full px-3 text-[12px] leading-4 font-semibold ${RESULT_STYLES[entry.result]}`}
                      >
                        {entry.result}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="px-6 py-16 text-center text-[14px] leading-5 text-[#737373]" colSpan={7}>
                  No audit log entries match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
