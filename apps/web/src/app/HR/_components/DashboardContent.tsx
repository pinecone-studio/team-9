/* eslint-disable max-lines */
// import type { ReactNode } from "react";
import type { ReactNode } from "react";
import EligibilityDistributionIcon from "../_icons/EligibilityDistribution";
import PaperIcon from "../_icons/Paper";
import RefreshIcon from "../_icons/Refresh";
import WarningIcon from "../_icons/Warning";
import EligibilityDonut from "./EligibilityDonut";

const employeeKpis: { label: ReactNode; value: string }[] = [
  {
    label: (
      <>
        OKR
        <br />
        Submitted
      </>
    ),
    value: "53%",
  },
  {
    label: (
      <>
        Attendance
        <br />
        Compliance
      </>
    ),
    value: "83%",
  },
  {
    label: (
      <>
        Request
        <br />
        Approval
      </>
    ),
    value: "34%",
  },
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

// import EligibilityDistributionIcon from "../_icons/EligibilityDistribution";
// import PaperIcon from "../_icons/Paper";
// import RefreshIcon from "../_icons/Refresh";
import { TotalEmployees } from "../_icons/TotalEmployees"; 
import { TotalBenefits } from "../_icons/TotalBenefits";
import {EyeIcon} from "../_icons/EyeIcon";
import {ActiveContracts} from "../_icons/ActiveContracts";
import {PendingRequests} from "../_icons/PendingRequest";
import {PencilIcon} from "../_icons/PencilIcon";
// const recentActivity = Array.from({ length: 4 }, () => ({
//   author: "Sarah Chen",
//   title: "Employee requested Gym Membership benefit",
//   when: "1 day ago",
// }));  
 const benefits = Array.from({ length: 4 }, () => ({
  name: "Private Health Insurance",
  category: "Financial",
  subsidy: "70%",
  rules: ["Probation Gate", "General Late Arrival Time"],
  employees: "8 employees",
  status: "Active",
})); 
export default function DashboardContent() {
  return (
    <div className="flex w-full flex-col gap-10">
      <div className="grid grid-cols-4 gap-5 w-full">
        <div className="w-full h-36.5 flex gap-6 ">
        <article className="h-36.5 w-76.75 rounded-2xl bg-white p-7">
          <div className="flex items-center gap-[4px]">
            <TotalEmployees />
            <p className="text-[14px] font-medium leading-5 text-[#737373]">
              Total Employees
            </p>
          </div>

          <div className="flex h-17 w-[320px] items-start gap-10">
            <div className="flex h-17 w-35 flex-col pt-4">
              <p className="text-[40px] font-bold leading-10 text-[#0A0A0A]">
    <div className="flex w-full flex-col gap-5">
      <div className="grid w-full gap-5 xl:grid-cols-[360px_360px_minmax(0,1fr)]">
        <article className="flex min-h-[250px] w-full flex-col justify-between rounded-[16px] bg-[#0A0A0A] p-5 text-white">
          <p className="text-[14px] font-semibold leading-[20px] text-[#FAFAFA]">
            Employees Overall
          </p>

          <div className="flex h-[68px] w-[320px] items-start gap-5">
            <div className="flex h-[68px] w-[90px] flex-col gap-1">
              <p className="text-[48px] font-bold leading-[48px] text-[#FAFAFA]">
                24
              </p>
              <p className="text-[12px] leading-4 text-[#737373]">
                employees in system
              </p>
            </div> 
          </div>
        </article>
       <article className="h-36.5 w-76.75 flex-col rounded-2xl bg-white p-7">
          <div className="flex items-center gap-2">
            <TotalBenefits />
            <p className="text-[14px] font-medium text-[#737373]">
              Total Benefits
            </p>
          </div>

          <div className="flex h-17 w-[320px] items-start gap-5">
            <div className="flex h-17 w-35 flex-col pt-4">
              <p className="text-[40px] font-bold leading-10 text-[#0A0A0A]">
                12
            </div>

            <div className="h-[56px] w-px bg-[#FAFAFA]/15" />

            <div className="flex h-[68px] w-[72px] flex-col gap-1">
              <p className="text-[48px] font-bold leading-[48px] text-[#FAFAFA]">
                4
              </p>
              <p className="text-[12px] leading-4 text-[#737373]">
                benefits configured
              </p>
            </div> 
          </div>
        </article>

        <article className="h-36.5 w-76.75 flex-col rounded-2xl bg-white p-7">
          <div className="flex items-center gap-2">
            <ActiveContracts />
            <p className="text-[14px] font-medium leading-5 text-[#737373]">
              Active Contracts
            </p>

          <div className="grid w-[320px] grid-cols-3 gap-2">
            {employeeKpis.map(({ label, value }) => (
              <div
                className="flex h-20.5 flex-col items-center justify-center rounded-[9px] bg-white/[0.08]"
                key={value}
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

          <div className="flex h-17 w-[320px] items-start gap-5">
            <div className="flex h-17 w-35 flex-col pt-4">
              <p className="text-[40px] font-bold leading-10 text-[#0A0A0A]">
                5
              </p>
              <p className="text-[12px] leading-4 text-[#737373]">
                in the system
              </p>
            </div>
            </div>
        </article>
         <article className="h-36.5 w-76.75 rounded-2xl bg-white p-7">
          <div className="flex items-center gap-2">
            <PendingRequests />
            <p className="text-[14px] font-medium leading-5 text-[#737373]">
              Pending Requests
            </p>
          </div>

          <div className="flex h-17 w-[320px] items-start gap-5">
            <div className="flex h-17 w-35 flex-col pt-4">
              <p className="text-[40px] font-bold leading-10 text-[#0A0A0A]">
                12
              </p>
              <p className="text-[12px] leading-4 text-[#737373]">
                awaiting review
              </p>
            </div> 
          </div>
        </article>
        </div>
      </div>
      <article className="w-full rounded-2xl border border-[#E5E5E5] bg-white">
          <div className="px-6 pt-6 pb-4">
            <p className="text-[18px] font-semibold text-[#0A0A0A]">
              Company Benefits
            </p>
            <p className="text-[14px] text-[#737373]">
                Manage the benefit catalog and eligibility configuration.
            </p>
          </div>

          <div className="grid grid-cols-[2fr_1fr_0.7fr_2.6fr_1.4fr_0.8fr_1.2fr] border-t border-[#E5E5E5] px-6 py-4 text-[14px] font-medium text-[#0A0A0A]">
              <p>Benefit Name</p>
              <p>Category</p>
              <p>Subsidy</p>
              <p>Rules Applied</p>
              <p>Eligible Employees</p>
              <p>Status</p>
              <p>Actions</p>
          </div>

          {benefits.map((benefit, i) => (
          <div
            key={i}
            className="grid grid-cols-[2fr_1fr_0.7fr_2.6fr_1.4fr_0.8fr_1.2fr] items-center border-t border-[#E5E5E5] px-6 py-5 text-[14px]"
          >
            <p className="font-medium text-[#0A0A0A] truncate">{benefit.name}</p>

            <p className="text-[#737373]">{benefit.category}</p>

            <p className="text-[#737373]">{benefit.subsidy}</p>

          <div className="flex flex-wrap gap-2 max-w-full">
            {benefit.rules.map((rule, index) => (
              <span
                key={index}
                className="rounded-md font-medium border border-[#D4D4D4] text-[#000000] px-3 py-1 text-[12px]"
              >
                {rule}
              </span>
          ))}
          </div>

          <div className="flex items-center gap-2 text-[#737373]">
            <TotalEmployees className="w-3.2 h-3.5" />
            <span>{benefit.employees}</span>
          </div>

          <span className="w-fit rounded-md bg-black px-4 py-1 text-[12px] font-semibold text-white">
            {benefit.status}
          </span>

          <div className="flex items-center gap-6 justify-start">
            <button className="flex items-center gap-2 text-[#0A0A0A]">
              <EyeIcon />
              <span>View</span>
            </button>

            <button className="flex items-center gap-2 text-[#0A0A0A]">
              <PencilIcon />
              <span>Edit</span>
            </button>

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
                  className="flex items-center gap-2.5 text-[12px] font-normal leading-4 text-[#6B7280]"
                  key={label}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span>{label}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center">
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
                <div
                  className={`flex items-start gap-3 ${
                    index === recentActivity.length - 1 ? "opacity-[0.18]" : ""
                  }`}
                  key={`${title}-${index}`}
                >
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

          <div className="mt-5 space-y-4">
            {attendanceAlerts.map(({ count, initials, name }) => (
              <div
                className="flex h-[52px] w-[318px] items-center justify-between rounded-[10px] border border-[#EAB308] bg-[#F6F1E8] px-3 py-3 font-medium"
                key={`${name}-${count}`}
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
      </div>
  ))}
    </article>
  </div>
  );
}