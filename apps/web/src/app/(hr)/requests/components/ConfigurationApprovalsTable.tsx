import { Gift, Scale } from "lucide-react";

import { ReviewButton, StatusBadge } from "./RequestsUi";
import type { ConfigurationRow } from "./requests-data";

const typeLabel: Record<ConfigurationRow["type"], string> = {
  benefit: "Benefit",
  rule: "Rule",
};

export default function ConfigurationApprovalsTable({
  rows,
}: {
  rows: ConfigurationRow[];
}) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E5E5E5]">
              <th className="px-4 py-2.5 text-left text-[14px] leading-5 font-medium text-[#0A0A0A]">
                Type
              </th>
              <th className="px-4 py-2.5 text-left text-[14px] leading-5 font-medium text-[#0A0A0A]">
                Name
              </th>
              <th className="px-4 py-2.5 text-left text-[14px] leading-5 font-medium text-[#0A0A0A]">
                Changes
              </th>
              <th className="px-4 py-2.5 text-left text-[14px] leading-5 font-medium text-[#0A0A0A]">
                Created By
              </th>
              <th className="px-4 py-2.5 text-left text-[14px] leading-5 font-medium text-[#0A0A0A]">
                Submitted
              </th>
              <th className="px-4 py-2.5 text-left text-[14px] leading-5 font-medium text-[#0A0A0A]">
                Status
              </th>
              <th className="px-4 py-2.5 text-left text-[14px] leading-5 font-medium text-[#0A0A0A]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={`${row.type}-${row.name}`}
                className={index < rows.length - 1 ? "border-b border-[#E5E5E5]" : ""}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {row.type === "benefit" ? (
                      <Gift className="h-4 w-4 text-[#737373]" strokeWidth={1.6} />
                    ) : (
                      <Scale className="h-4 w-4 text-[#737373]" strokeWidth={1.6} />
                    )}
                    <span className="inline-flex h-[22px] items-center justify-center rounded-[8px] border border-[#E5E5E5] px-2 text-[12px] leading-4 font-medium text-[#0A0A0A]">
                      {typeLabel[row.type]}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  {row.name}
                </td>
                <td className="px-4 py-3 text-[14px] leading-5 font-normal text-[#737373]">
                  {row.changes}
                </td>
                <td className="px-4 py-3 text-[14px] leading-5 font-normal text-[#737373]">
                  {row.createdBy}
                </td>
                <td className="px-4 py-3 text-[14px] leading-5 font-normal text-[#737373]">
                  {row.submitted}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-2.5">
                  <ReviewButton label={row.action} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
