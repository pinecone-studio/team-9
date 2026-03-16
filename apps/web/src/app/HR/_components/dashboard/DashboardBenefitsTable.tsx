import { Eye, Pencil, Users } from "lucide-react";
import type { DashboardBenefitSummary } from "./dashboard-helpers";

type DashboardBenefitsTableProps = {
  rows: DashboardBenefitSummary[];
};

function renderStatusPill(status: string) {
  const isActive = status.toLowerCase() === "active";
  return (
    <span
      className={`inline-flex h-6 items-center rounded-[6px] px-3 text-[10px] leading-[13px] font-semibold ${
        isActive ? "bg-black text-white" : "bg-[#E5E7EB] text-[#374151]"
      }`}
    >
      {status}
    </span>
  );
}

export default function DashboardBenefitsTable({ rows }: DashboardBenefitsTableProps) {
  return (
    <section className="w-full rounded-[12px] border border-[#DBDEE1] bg-white py-5">
      <div className="px-6">
        <h2 className="text-[16px] leading-[21px] font-semibold text-black">Company Benefits</h2>
        <p className="mt-2 text-[14px] leading-[18px] text-[#737373]">
          Manage the benefit catalog and eligibility configuration.
        </p>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-[1100px] w-full border-collapse text-left">
          <thead className="border-y border-[#E5E7EB]">
            <tr className="text-[14px] leading-5 font-medium text-black">
              <th className="px-6 py-3">Benefit Name</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Subsidy</th>
              <th className="px-3 py-3">Rules Applied</th>
              <th className="px-3 py-3">Eligible Employees</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="border-b border-[#F1F3F5]" key={row.benefitId}>
                <td className="px-6 py-4 text-[14px] leading-[18px] font-medium text-black">
                  {row.benefitName}
                </td>
                <td className="px-3 py-4 text-[14px] leading-[18px] text-[#737373]">{row.category}</td>
                <td className="px-3 py-4 text-[14px] leading-[18px] text-[#737373]">
                  {row.subsidyPercent === null ? "-" : `${row.subsidyPercent}%`}
                </td>
                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-1">
                    {row.rulesApplied.length > 0 ? (
                      row.rulesApplied.map((rule) => (
                        <span
                          className="inline-flex items-center rounded-[4px] border border-[#DBDEE1] px-2 py-0.5 text-[10px] leading-[13px] font-medium text-black"
                          key={`${row.benefitId}-${rule}`}
                        >
                          {rule}
                        </span>
                      ))
                    ) : (
                      <span className="text-[12px] text-[#9CA3AF]">No rules</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-4 text-[14px] leading-[18px] text-[#737373]">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {row.eligibleEmployees} employees
                  </span>
                </td>
                <td className="px-3 py-4">{renderStatusPill(row.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button className="inline-flex items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-sm text-black" type="button">
                      <Eye className="h-4 w-4" /> View
                    </button>
                    <button className="inline-flex items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-sm text-black" type="button">
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="px-6 py-10 text-center text-sm text-[#737373]" colSpan={7}>
                  Benefits data is not available yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
