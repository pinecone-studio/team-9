"use client";

import { useDashboardPageDataQuery } from "@/shared/apollo/generated";
import DashboardBenefitsTable from "./dashboard/DashboardBenefitsTable";
import DashboardEligibilityOverview from "./dashboard/DashboardEligibilityOverview";
import DashboardKpiCards from "./dashboard/DashboardKpiCards";
import DashboardRecentActivity from "./dashboard/DashboardRecentActivity";
import DashboardRulesPanel from "./dashboard/DashboardRulesPanel";
import DashboardHeroSkeleton from "./dashboard/DashboardSkeleton";

type DashboardContentProps = {
  greeting: string;
  subtitle: string;
};

export default function DashboardContent({ greeting, subtitle }: DashboardContentProps) {
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
  const benefitRows = data?.listBenefitEligibilitySummary ?? [];
  const ruleDefinitions = data?.ruleDefinitions ?? [];

  if (loading && !data) {
    return <DashboardHeroSkeleton />;
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <DashboardKpiCards
        activeContracts={data?.countActiveContracts ?? 0}
        greeting={greeting}
        pendingRequests={data?.countPendingBenefitRequests ?? 0}
        subtitle={subtitle}
        totalBenefits={totalBenefits}
        totalEmployees={totalEmployees}
      />
      <DashboardBenefitsTable rows={benefitRows} />
      <DashboardEligibilityOverview rows={benefitRows} />
      <div className="grid w-full grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardRecentActivity />
        <DashboardRulesPanel rules={ruleDefinitions} />
      </div>
    </div>
  );
}
