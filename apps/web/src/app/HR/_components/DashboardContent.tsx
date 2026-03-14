"use client";

import { useMemo } from "react";
import { useDashboardPageDataQuery } from "@/shared/apollo/generated";

import DashboardBenefitsTable from "./dashboard/DashboardBenefitsTable";
import DashboardEligibilityOverview from "./dashboard/DashboardEligibilityOverview";
import DashboardKpiCards from "./dashboard/DashboardKpiCards";
import DashboardRecentActivity from "./dashboard/DashboardRecentActivity";
import DashboardRulesPanel from "./dashboard/DashboardRulesPanel";

function DashboardLoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="h-[146px] animate-pulse rounded-[8px] border border-[#DBDEE1] bg-white"
            key={index}
          />
        ))}
      </div>
      <div className="h-[360px] animate-pulse rounded-[12px] border border-[#DBDEE1] bg-white" />
      <div className="h-[145px] animate-pulse rounded-[12px] border border-[#DBDEE1] bg-white" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="h-[490px] animate-pulse rounded-[14px] border border-[#DBDEE1] bg-white" />
        <div className="h-[490px] animate-pulse rounded-[14px] border border-[#DBDEE1] bg-white" />
      </div>
    </div>
  );
}

export default function DashboardContent() {
  const { data, error, loading } = useDashboardPageDataQuery({
    fetchPolicy: "network-only",
  });

  const totalEmployees = useMemo(
    () => (data?.employees ?? []).filter((employee) => employee !== null).length,
    [data?.employees],
  );
  const totalBenefits = useMemo(
    () => (data?.allBenefits ?? []).filter((benefit) => benefit !== null).length,
    [data?.allBenefits],
  );

  const summaryRows = data?.listBenefitEligibilitySummary ?? [];
  const auditEntries = data?.listAuditLogEntries ?? [];
  const ruleDefinitions = data?.ruleDefinitions ?? [];
  const activeContracts = data?.countActiveContracts ?? 0;
  const pendingRequests = data?.countPendingBenefitRequests ?? 0;

  if (loading && !data) {
    return <DashboardLoadingState />;
  }

  if (error && !data) {
    return (
      <div className="rounded-[12px] border border-[#f0c5c5] bg-[#fff8f8] p-6 text-[#b14a4a]">
        Failed to load dashboard data: {error.message}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8">
      {error ? (
        <div className="rounded-[10px] border border-[#f0c5c5] bg-[#fff8f8] px-5 py-4 text-[14px] text-[#b14a4a]">
          Some dashboard sections may be incomplete: {error.message}
        </div>
      ) : null}

      <DashboardKpiCards
        activeContracts={activeContracts}
        pendingRequests={pendingRequests}
        totalBenefits={totalBenefits}
        totalEmployees={totalEmployees}
      />
      <DashboardBenefitsTable rows={summaryRows} />
      <DashboardEligibilityOverview rows={summaryRows} />

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardRecentActivity entries={auditEntries} />
        <DashboardRulesPanel rules={ruleDefinitions} />
      </section>
    </div>
  );
}
