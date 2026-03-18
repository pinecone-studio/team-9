import { ArrowUpFromLine, Eye, RefreshCw, Users } from "lucide-react";

import ContractsStatusBadge from "./ContractsStatusBadge";
import type { ContractRow } from "./contracts-content.helpers";

type ContractsTableProps = {
  loading: boolean;
  rows: ContractRow[];
};

export default function ContractsTable({ loading, rows }: ContractsTableProps) {
  return (
    <section className="box-border flex h-[412.5px] w-full flex-col overflow-hidden rounded-[10px] border border-[#E5E5E5] bg-white">
      <div className="h-[410.5px] w-full overflow-hidden">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[201.11px]" />
            <col className="w-[125.54px]" />
            <col className="w-[68.98px]" />
            <col className="w-[114.46px]" />
            <col className="w-[106.12px]" />
            <col className="w-[118.36px]" />
            <col className="w-[171.03px]" />
            <col className="w-[324.41px]" />
          </colgroup>
          <thead>
            <tr className="h-[41px] border-b border-[#E5E5E5] text-[14px] leading-5 font-medium text-[#0A0A0A]">
              <th className="px-2 py-[9.75px] pb-[10.25px]">Benefit</th>
              <th className="px-2 py-[9.75px] pb-[10.25px]">Vendor</th>
              <th className="px-2 py-[9.75px] pb-[10.25px]">Version</th>
              <th className="px-2 py-[9.75px] pb-[10.25px]">Effective Date</th>
              <th className="px-2 py-[9.75px] pb-[10.25px]">Expiry Date</th>
              <th className="px-2 py-[9.75px] pb-[10.25px]">Status</th>
              <th className="px-2 py-[9.75px] pb-[10.25px]">Accepted This Version</th>
              <th className="px-[18px] py-[9.75px] pb-[10.25px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                className={`${index === rows.length - 1 ? "h-[52.5px]" : "h-[54px]"} border-b border-[#E5E5E5]`}
                key={row.benefitId}
              >
                <td className="px-2 py-[16.5px] text-[14px] leading-5 font-medium text-[#0A0A0A]">{row.benefit}</td>
                <td className="px-2 py-[16.5px] text-[14px] leading-5 text-[#737373]">{row.vendor}</td>
                <td className="overflow-hidden px-2 py-[15.5px]">
                  <span className="inline-flex h-[22px] max-w-[52px] items-center justify-center overflow-hidden rounded-[8px] border border-[#E5E5E5] px-2 text-[12px] leading-4 font-medium text-[#0A0A0A] text-ellipsis whitespace-nowrap">
                    {row.version}
                  </span>
                </td>
                <td className="px-2 py-[16.5px] text-[14px] leading-5 whitespace-nowrap text-[#737373]">
                  {row.effectiveDate}
                </td>
                <td className="px-2 py-[16.5px] text-[14px] leading-5 whitespace-nowrap text-[#737373]">
                  {row.expiryDate}
                </td>
                <td className="px-2 py-[15.5px]">
                  <ContractsStatusBadge status={row.status} />
                </td>
                <td className="px-2 py-[16.5px] text-[14px] leading-5 text-[#737373]">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-[14px] w-[14px]" />
                    {row.accepted}
                  </span>
                </td>
                <td className="px-0 py-[11px] pr-[18px]">
                  <div className="flex h-8 items-center justify-end gap-1">
                    <button
                      className="inline-flex h-8 min-w-[75px] items-center justify-center gap-1.5 rounded-[8px] px-2.5 text-[14px] leading-5 font-medium text-[#0A0A0A]"
                      type="button"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button
                      className="inline-flex h-8 min-w-[122px] items-center justify-center gap-1.5 rounded-[8px] px-2.5 text-[14px] leading-5 font-medium text-[#0A0A0A]"
                      type="button"
                    >
                      <ArrowUpFromLine className="h-4 w-4" />
                      Upload New
                    </button>
                    {row.status === "expired" ? (
                      <button
                        className="inline-flex h-8 min-w-[87px] items-center justify-center gap-1.5 rounded-[8px] px-2.5 text-[14px] leading-5 font-medium text-[#0A0A0A]"
                        type="button"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Renew
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 ? (
              <tr className="h-[54px] border-b border-[#E5E5E5]">
                <td className="px-4 text-[14px] text-[#737373]" colSpan={8}>
                  No contract benefits found.
                </td>
              </tr>
            ) : null}
            {loading ? (
              <tr className="h-[54px] border-b border-[#E5E5E5]">
                <td className="px-4 text-[14px] text-[#737373]" colSpan={8}>
                  Loading contracts...
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
