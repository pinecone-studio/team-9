import type { ReactNode } from "react";

import EligibilityDistributionIcon from "../_icons/EligibilityDistribution";
import PaperIcon from "../_icons/Paper";
import RefreshIcon from "../_icons/Refresh";
import WarningIcon from "../_icons/Warning";
import EligibilityDonut from "./EligibilityDonut";

const employeeKpis: { label: ReactNode; value: string }[] = [
  { label: <>OKR<br />Submitted</>, value: "53%" },
  { label: <>Attendance<br />Compliance</>, value: "83%" },
  { label: <>Request<br />Approval</>, value: "34%" },
];

const eligibilityLegend = [
  { color: "#3F7AE8", label: "Eligible" },
  { color: "#29C159", label: "Active" },
  { color: "#E7B106", label: "Pending" },
  { color: "#F24949", label: "Locked" },
];

const recentActivity = Array.from({ length: 4 }, () => ({
  author: "Sarah Chen",
  title: "Employee requested Gym Membership benefit",
  when: "1 day ago",
}));

const attendanceAlerts = [
  { count: "4 late", initials: "TE", name: "Tuguldur Enk..." },
  { count: "2 late", initials: "IE", name: "Idertsog Ank..." },
];

export default function DashboardContent() {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="grid w-full gap-5 xl:grid-cols-[360px_360px_minmax(0,1fr)]">
        <article className="flex min-h-[250px] w-full flex-col justify-between rounded-[16px] bg-[#0A0A0A] p-5 text-white">
          <p className="text-[14px] font-semibold leading-[20px] text-[#FAFAFA]">
            Employees Overall
          </p>
          <div className="flex h-[68px] w-[320px] items-start gap-5">
            <div className="flex h-[68px] w-[90px] flex-col gap-1">
              <p className="text-[48px] font-bold leading-[48px] tracking-[0] text-[#FAFAFA]">
                24
              </p>
              <p className="text-[12px] font-normal leading-[100%] text-[#FAFAFA]/50">
                Total Employees
              </p>
            </div><div className="h-[56px] w-px bg-[#FAFAFA]/15" />
            <div className="flex h-[68px] w-[72px] flex-col gap-1">
              <p className="text-[48px] font-bold leading-[48px] tracking-[0] text-[#FAFAFA]">
                4
              </p>
              <p className="text-[12px] font-normal leading-[100%] text-[#FAFAFA]/50">
                On Probation
              </p>
            </div>
          </div>
          <div className="grid w-[320px] grid-cols-3 gap-2  ">
            {employeeKpis.map(({ label, value }) => (
              <div
                key={value}
                className="flex h-20.5 flex-col items-center justify-center rounded-[9px] bg-white/[0.08]"
              >
                <p className="text-[18px] font-bold leading-6 text-[#FAFAFA]">
                  {value}
                </p>
                <p className="mt-1 text-center text-[12px] font-normal leading-4 text-[#FAFAFA]/50">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </article>
        <article className="min-h-[250px] w-full rounded-2xl border border-[#F3F3F3] bg-white/50 p-5 backdrop-blur-[8px]">
          <div className="flex items-start justify-between">
            <h2 className="text-[16px] font-semibold leading-6 text-[#0A0A0A]">
              Eligibility Distribution
            </h2>
            <EligibilityDistributionIcon className="h-5 w-5 shrink-0" />
          </div>
          <div className="mt-6 flex h-4 items-center gap-1">
            <span className="font-geist text-[12px] font-semibold leading-4 text-[#2D70F5]">
              +12% Eligible
            </span>
            <span className="text-[12px] font-normal leading-4 text-[#6B7280]">
              compared to last month
            </span>
          </div>
          <div className="mt-4 flex h-28 items-center justify-between">
            <ul className="flex h-23.5 w-15.75 flex-col justify-between">
              {eligibilityLegend.map(({ color, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 text-[12px] font-normal leading-4 text-[#6B7280]"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span>{label}</span>
                </li>
              ))}
            </ul><div className="flex items-center justify-center">
              <EligibilityDonut />
            </div>
          </div>
        </article> 
        <article className="flex min-h-[250px] w-full flex-col rounded-[16px] border border-[#F3F3F3] bg-white/50 p-4 backdrop-blur-[8px]">
          <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold leading-[24px] text-[#0A0A0A]">
                Recent Activity
              </h2>
              <RefreshIcon className="h-5 w-5 shrink-0" />
          </div>

          <div className="mt-[17px] min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="space-y-[17px]">
              {recentActivity.map(({ author, title, when }, index) => (
              <div key={`${title}-${index}`} className={`flex items-start gap-3 ${ index === recentActivity.length - 1 ? "opacity-[0.18]" : "" }`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white">
                  <PaperIcon className="h-4 w-4" />
                </span>

              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium leading-[20px] text-[#0A0A0A]">
                  {title}
                </p>
                <p className="mt-1 truncate text-[12px] font-normal leading-[16px] text-[#6B7280]">
                  {author}
                  <span className="px-2 text-[#9CA3AF]">•</span>
                    {when}
                </p>
              </div>
              </div>
      ))}
    </div>
  </div>
</article>

      </div>
      <div className="flex w-full justify-end">
        <article className="min-h-[210px] w-full max-w-[360px] rounded-2xl border border-[#F3F3F3] bg-white/50 p-5 backdrop-blur-[8px]">
          <div className="flex items-center gap-1.5">
            <WarningIcon className="h-5 w-5" />
            <h2 className="text-[16px] font-semibold leading-6 text-[#0A0A0A]">
              Attendance Alerts
            </h2>
          </div>
          <div className="mt-5 space-y-4 ">
            {attendanceAlerts.map(({ count, initials, name }) => (
              <div
                key={`${name}-${count}`}
                className="flex w-[318px] h-[52px] items-center font-medium justify-between rounded-[10px] border border-[#EAB308] bg-[#F6F1E8] px-3 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D9DEE8] text-[12px] font-medium text-[#667085]">
                    {initials}
                  </span>
                  <p className="truncate text-[14px] font-medium leading-5 text-[#0A0A0A]">
                    {name}
                  </p>
                </div>
                <span className="rounded-[6px] border border-[#F3C86B] px-2 py-1 text-[12px] leading-[16px] text-[#D0890D]">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
