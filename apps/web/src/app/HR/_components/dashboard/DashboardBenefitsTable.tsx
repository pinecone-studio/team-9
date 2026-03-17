import { CheckCircle2, Eye, Pencil, Users } from "lucide-react";
import type { DashboardBenefitSummary } from "./dashboard-helpers";

type DashboardBenefitsTableProps = {
  rows: DashboardBenefitSummary[];
};

function renderStatusPill(status: string) {
  const isActive = status.toLowerCase() === "active";

  if (isActive) {
    return (
      <span className="inline-flex h-[22px] min-w-[72px] items-center justify-center gap-1.5 rounded-[4px] bg-[#DCFCE7] px-2 py-0.5 text-[12px] leading-4 font-medium text-[#016630]">
        <CheckCircle2 className="h-3 w-3" />
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex h-[22px] min-w-[72px] items-center justify-center rounded-[4px] bg-[#E5E7EB] px-2 py-0.5 text-[12px] leading-4 font-medium text-[#374151]">
      {status}
    </span>
  );
}

export default function DashboardBenefitsTable({ rows }: DashboardBenefitsTableProps) {
  return (
    <section className="box-border flex h-[359px] w-full flex-col items-start gap-5 rounded-[12px] border border-[#DBDEE1] bg-white py-[22px]">
      <div className="flex h-[47px] w-full flex-col items-start gap-2 px-6">
        <h2 className="h-[21px] text-[16px] leading-[21px] font-semibold text-black">
          Company Benefits
        </h2>
        <p className="h-[18px] text-[14px] leading-[18px] text-[#737373]">
          Manage the benefit catalog and eligibility configuration.
        </p>
      </div>

      <div className="box-border h-[248px] w-full px-[35px]">
        <table className="h-full w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[200.27px]" />
            <col className="w-[167.02px]" />
            <col className="w-[77.64px]" />
            <col className="w-[350.86px]" />
            <col className="w-[157.25px]" />
            <col className="w-[94.08px]" />
            <col className="w-[182.88px]" />
          </colgroup>
          <thead className="border-y border-[#DBDEE1]">
            <tr className="h-[41px] text-[14px] leading-5 font-medium text-black">
              <th className="px-2 py-[9.75px] pb-[10.25px]">Benefit Name</th>
              <th className="px-2 py-[9.75px] pb-[10.25px]">Category</th>
              <th className="px-2 py-[9.75px] pb-[10.25px]">Subsidy</th>
              <th className="px-2 py-[9.75px] pb-[10.25px]">Rules Applied</th>
              <th className="px-2 py-[9.75px] pb-[10.25px]">Eligible Employees</th>
              <th className="px-2 py-[9.75px] pb-[10.25px]">Status</th>
              <th className="px-2 py-[9.75px] pb-[10.25px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                className={`${
                  index === rows.length - 1 ? "h-[49px]" : "h-[50px]"
                } border-b border-[#DBDEE1]`}
                key={row.benefitId}
              >
                <td className="px-2 py-[14.5px] text-[14px] leading-[18px] font-medium text-black">
                  {row.benefitName}
                </td>
                <td className="px-2 py-[14.5px] text-[14px] leading-[18px] text-[#737373]">
                  {row.category}
                </td>
                <td className="px-2 py-[14.5px] text-[14px] leading-[18px] text-[#737373]">
                  {row.subsidyPercent === null ? "-" : `${row.subsidyPercent}%`}
                </td>
                <td className="px-2 py-[14.5px]">
                  <div className="flex flex-wrap gap-x-1 gap-y-0">
                    {row.rulesApplied.length > 0 ? (
                      row.rulesApplied.map((rule) => (
                        <span
                          className="inline-flex h-[22px] items-center justify-center rounded-[4px] border border-[#DBDEE1] px-2 py-0.5 text-[10px] leading-[13px] font-medium text-black"
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
                <td className="px-2 py-[14.5px] text-[14px] leading-[18px] text-[#737373]">
                  <span className="inline-flex items-center gap-1.5 pl-4">
                    <Users className="h-[14px] w-[14px]" />
                    {row.eligibleEmployees} employees
                  </span>
                </td>
                <td className="px-2 py-[13.5px] pl-4">{renderStatusPill(row.status)}</td>
                <td className="px-2 py-[10px]">
                  <div className="flex h-8 items-center justify-end gap-1">
                    <button
                      className="inline-flex h-8 min-w-[75px] items-center justify-center gap-1.5 rounded-[8px] px-2.5 text-[14px] leading-[18px] font-medium text-black"
                      type="button"
                    >
                      <Eye className="h-4 w-4" /> View
                    </button>
                    <button
                      className="inline-flex h-8 min-w-[68px] items-center justify-center gap-1.5 rounded-[8px] px-2.5 text-[14px] leading-[18px] font-medium text-black"
                      type="button"
                    >
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
