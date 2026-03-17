"use client";

import { useDashboardPageDataQuery } from "@/shared/apollo/generated";
import DashboardBenefitsTable from "./dashboard/DashboardBenefitsTable";
import DashboardEligibilityOverview from "./dashboard/DashboardEligibilityOverview";
import DashboardKpiCards from "./dashboard/DashboardKpiCards";
import DashboardRecentActivity from "./dashboard/DashboardRecentActivity";
import DashboardRulesPanel from "./dashboard/DashboardRulesPanel";

function DashboardKpiCardsSkeleton() {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="h-[146px] animate-pulse rounded-[8px] border border-[#DBDEE1] bg-white"
            key={index}
          />
        ))}
      </div>
      <div className="h-[359px] animate-pulse rounded-[12px] border border-[#DBDEE1] bg-white" />
      <div className="h-[145px] animate-pulse rounded-[12px] border border-[#DBDEE1] bg-white" />
      <div className="grid w-full grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="h-[490px] animate-pulse rounded-[14px] border border-[#E5E5E5] bg-white" />
        <div className="h-[490px] animate-pulse rounded-[14px] border border-[#E5E5E5] bg-white" />
      </div>
    </div>
  );
}

export default function DashboardContent() {
  const { data, loading } = useDashboardPageDataQuery({
    fetchPolicy: "cache-and-network",
  });

  const totalEmployees = (data?.employees ?? []).reduce(
    (count, employee) => count + (employee ? 1 : 0),
    0,
  );
  const totalBenefits = (data?.allBenefits ?? []).reduce(
    (count, benefit) => count + (benefit ? 1 : 0),
    0,
  );
  const benefitRows = (data?.listBenefitEligibilitySummary ?? []).slice(0, 4);
  const activityEntries = data?.listAuditLogEntries ?? [];
  const ruleDefinitions = data?.ruleDefinitions ?? [];

  if (loading && !data) {
    return <DashboardKpiCardsSkeleton />;
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <DashboardKpiCards
        activeContracts={data?.countActiveContracts ?? 0}
        pendingRequests={data?.countPendingBenefitRequests ?? 0}
        totalBenefits={totalBenefits}
        totalEmployees={totalEmployees}
      />
      <DashboardBenefitsTable rows={benefitRows} />
      <DashboardEligibilityOverview rows={benefitRows} />
      <div className="grid w-full grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardRecentActivity entries={activityEntries} />
        <DashboardRulesPanel rules={ruleDefinitions} />
      </div>
    </div>
  );
}
