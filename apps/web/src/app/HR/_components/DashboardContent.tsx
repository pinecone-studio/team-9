/* eslint-disable max-lines */
// import type { ReactNode } from "react";

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
          </div>
      </div>
  ))}
    </article>
  </div>
  );
}