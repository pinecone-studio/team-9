import { ArrowUpFromLine, Eye, RefreshCw, Users } from "lucide-react";
import type { ContractRow } from "./contracts-types";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} />;
}

function renderStatusBadge(status: ContractRow["status"]) {
  if (status === "active") {
    return <span className="inline-flex h-[22px] min-w-[54px] items-center justify-center rounded-[8px] bg-[#DCFCE7] px-2 text-[12px] leading-4 font-medium text-[#016630]">Active</span>;
  }
  if (status === "expiring") {
    return <span className="inline-flex h-[22px] min-w-[96px] items-center justify-center rounded-[8px] bg-[#FEF3C6] px-2 text-[12px] leading-4 font-medium text-[#973C00]">Expiring Soon</span>;
  }
  if (status === "expired") {
    return <span className="inline-flex h-[22px] min-w-[61px] items-center justify-center rounded-[8px] bg-[#E7000B] px-2 text-[12px] leading-4 font-medium text-white">Expired</span>;
  }
  return <span className="inline-flex h-[22px] min-w-[68px] items-center justify-center rounded-[8px] bg-[#F5F5F5] px-2 text-[12px] leading-4 font-medium text-[#171717]">Archived</span>;
}

export function ContractsTableSkeleton() {
  return (
    <section className="box-border flex w-full flex-col overflow-hidden rounded-[10px] border border-[#E5E5E5] bg-white">
      <div className="w-full overflow-hidden">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[201.11px]" /><col className="w-[125.54px]" /><col className="w-[68.98px]" /><col className="w-[114.46px]" />
            <col className="w-[106.12px]" /><col className="w-[118.36px]" /><col className="w-[171.03px]" /><col className="w-[324.41px]" />
          </colgroup>
          <thead>
            <tr className="h-[41px] border-b border-[#E5E5E5]">
              {Array.from({ length: 8 }).map((_, index) => (
                <th className={`py-[9.75px] pb-[10.25px] ${index === 0 ? "pr-2 pl-6" : index === 7 ? "px-[18px] text-right" : "px-2"}`} key={`contracts-header-${index}`}>
                  <SkeletonBlock className={`h-4 ${index === 0 ? "w-16" : index === 1 ? "w-14" : index === 2 ? "w-14" : index === 3 || index === 4 ? "w-24" : index === 5 ? "w-16" : index === 6 ? "w-36" : "ml-auto w-14"}`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr className="h-[54px] border-b border-[#E5E5E5]" key={`contracts-row-${rowIndex}`}>
                <td className="py-[16.5px] pr-2 pl-6"><SkeletonBlock className="h-5 w-[160px]" /></td>
                <td className="px-2 py-[16.5px]"><SkeletonBlock className="h-5 w-[92px]" /></td>
                <td className="px-2 py-[15.5px]"><SkeletonBlock className="h-[22px] w-12 rounded-[8px]" /></td>
                <td className="px-2 py-[16.5px]"><SkeletonBlock className="h-5 w-[90px]" /></td>
                <td className="px-2 py-[16.5px]"><SkeletonBlock className="h-5 w-[90px]" /></td>
                <td className="px-2 py-[15.5px]"><SkeletonBlock className="h-[22px] w-[78px] rounded-[8px]" /></td>
                <td className="px-2 py-[16.5px]"><div className="flex items-center gap-2"><SkeletonBlock className="h-[14px] w-[14px] rounded-full" /><SkeletonBlock className="h-5 w-[92px]" /></div></td>
                <td className="px-0 py-[11px] pr-[18px]"><div className="flex h-8 items-center justify-end gap-2"><SkeletonBlock className="h-8 w-[75px] rounded-[8px]" /><SkeletonBlock className="h-8 w-[122px] rounded-[8px]" /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type ContractsTableProps = {
  contractsLoading: boolean;
  loading: boolean;
  onAcceptedClick: (row: ContractRow) => void;
  onRenew: (row: ContractRow) => void;
  onUpload: (row: ContractRow) => void;
  onView: (row: ContractRow) => void;
  rows: ContractRow[];
};

export default function ContractsTable({
  contractsLoading,
  loading,
  onAcceptedClick,
  onRenew,
  onUpload,
  onView,
  rows,
}: ContractsTableProps) {
  return (
    <section className="box-border flex w-full flex-col overflow-hidden rounded-[10px] border border-[#E5E5E5] bg-white">
      <div className="w-full overflow-hidden">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[201.11px]" /><col className="w-[125.54px]" /><col className="w-[68.98px]" /><col className="w-[114.46px]" />
            <col className="w-[106.12px]" /><col className="w-[118.36px]" /><col className="w-[171.03px]" /><col className="w-[324.41px]" />
          </colgroup>
          <thead>
            <tr className="h-[41px] border-b border-[#E5E5E5] text-[14px] leading-5 font-medium text-[#0A0A0A]">
              <th className="py-[9.75px] pr-2 pl-6 pb-[10.25px]">Benefit</th>
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
              <tr className={`${index === rows.length - 1 ? "h-[52.5px]" : "h-[54px]"} border-b border-[#E5E5E5]`} key={row.benefitId}>
                <td className="py-[16.5px] pr-2 pl-6 text-[14px] leading-5 font-medium text-[#0A0A0A]">{row.benefit}</td>
                <td className="px-2 py-[16.5px] text-[14px] leading-5 text-[#737373]">{row.vendor}</td>
                <td className="overflow-hidden px-2 py-[15.5px]"><span className="inline-flex h-[22px] max-w-[52px] items-center justify-center overflow-hidden rounded-[8px] border border-[#E5E5E5] px-2 text-[12px] leading-4 font-medium text-[#0A0A0A] text-ellipsis whitespace-nowrap">{row.version}</span></td>
                <td className="px-2 py-[16.5px] text-[14px] leading-5 whitespace-nowrap text-[#737373]">{row.effectiveDate}</td>
                <td className="px-2 py-[16.5px] text-[14px] leading-5 whitespace-nowrap text-[#737373]">{row.expiryDate}</td>
                <td className="px-2 py-[15.5px]">{renderStatusBadge(row.status)}</td>
                <td className="px-2 py-[16.5px] text-[14px] leading-5 text-[#737373]">
                  <button
                    className="inline-flex items-center gap-1.5 rounded-[8px] px-1 py-0.5 text-left transition hover:bg-[#F5F5F5] hover:text-[#0A0A0A]"
                    onClick={() => onAcceptedClick(row)}
                    type="button"
                  >
                    <Users className="h-[14px] w-[14px]" />
                    {row.acceptedCount} accepted
                  </button>
                </td>
                <td className="px-0 py-[11px] pr-[18px]">
                  <div className="flex h-8 items-center justify-end gap-1">
                    <button className="inline-flex h-8 min-w-[75px] items-center justify-center gap-1.5 rounded-[8px] px-2.5 text-[14px] leading-5 font-medium text-[#0A0A0A]" onClick={() => onView(row)} type="button"><Eye className="h-4 w-4" />View</button>
                    <button className="inline-flex h-8 min-w-[122px] items-center justify-center gap-1.5 rounded-[8px] px-2.5 text-[14px] leading-5 font-medium text-[#0A0A0A]" onClick={() => onUpload(row)} type="button"><ArrowUpFromLine className="h-4 w-4" />Upload New</button>
                    {row.status === "expired" ? (
                      <button className="inline-flex h-8 min-w-[87px] items-center justify-center gap-1.5 rounded-[8px] px-2.5 text-[14px] leading-5 font-medium text-[#0A0A0A]" onClick={() => onRenew(row)} type="button"><RefreshCw className="h-4 w-4" />Renew</button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !contractsLoading && rows.length === 0 ? (
              <tr className="h-[54px] border-b border-[#E5E5E5]"><td className="px-4 text-[14px] text-[#737373]" colSpan={8}>No contract benefits found.</td></tr>
            ) : null}
            {contractsLoading ? (
              <tr className="h-[54px] border-b border-[#E5E5E5]"><td className="px-4 text-[14px] text-[#737373]" colSpan={8}>Loading contracts...</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
