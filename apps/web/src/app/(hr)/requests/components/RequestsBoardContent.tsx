"use client";

import { useState } from "react";

import type { ApprovalRequestRecord } from "./approval-requests.graphql";
import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import BenefitRequestsTable from "./BenefitRequestsTable";
import ConfigurationApprovalsTable from "./ConfigurationApprovalsTable";
import OverrideRequestsTable from "./OverrideRequestsTable";
import RequestsBoardSkeleton from "./RequestsBoardSkeleton";
import { type RequestsMetricKey, RequestsMetrics } from "./RequestsBoardMetrics";
import { EmptyTableState } from "./RequestsTableShared";
import {
  filterApprovalRequests,
  filterBenefitRequests,
  getTabForMetric,
  type RequestsBoardTab,
} from "./requests-board-filters";
import RequestsBoardToolbar from "./RequestsBoardToolbar";

type RequestsBoardContentProps = {
  benefitRequests: BenefitRequestRecord[];
  benefitError?: string | null;
  configurationRequests: ApprovalRequestRecord[];
  configurationError?: string | null;
  currentUserIdentifier: string;
  currentUserRole: string;
  loading: boolean;
  metrics: Record<string, number>;
  onBenefitReview: (requestId: string) => void;
  onConfigurationReview: (requestId: string) => void;
  overrideRequests: ApprovalRequestRecord[];
};

function resolveEmptyMessage(
  activeMetric: RequestsMetricKey | null,
  activeTab: RequestsBoardTab,
) {
  if (activeMetric) {
    if (activeTab === "benefit") return "No benefit requests match this filter.";
    if (activeTab === "configuration") {
      return "No configuration approvals match this filter.";
    }

    return "No override requests match this filter.";
  }

  if (activeTab === "benefit") return "No benefit requests found.";
  if (activeTab === "configuration") return "No configuration approvals found.";
  return "No override requests found.";
}

export default function RequestsBoardContent({
  benefitRequests,
  benefitError,
  configurationRequests,
  configurationError,
  currentUserIdentifier,
  currentUserRole,
  loading,
  metrics,
  onBenefitReview,
  onConfigurationReview,
  overrideRequests,
}: RequestsBoardContentProps) {
  const [activeTab, setActiveTab] = useState<RequestsBoardTab>("configuration");
  const [activeMetric, setActiveMetric] = useState<RequestsMetricKey | null>(null);
  const normalizedUserIdentifier = currentUserIdentifier.trim().toLowerCase();
  const normalizedUserRole = currentUserRole.trim().toLowerCase();
  const filteredBenefitRequests = filterBenefitRequests(
    benefitRequests,
    activeMetric,
    normalizedUserIdentifier,
    normalizedUserRole,
  );
  const filteredConfigurationRequests = filterApprovalRequests(
    configurationRequests,
    activeMetric,
    normalizedUserIdentifier,
    normalizedUserRole,
  );
  const filteredOverrideRequests = filterApprovalRequests(
    overrideRequests,
    activeMetric,
    normalizedUserIdentifier,
    normalizedUserRole,
  );
  const counts = {
    benefit: filteredBenefitRequests.length,
    configuration: filteredConfigurationRequests.length,
    override: filteredOverrideRequests.length,
  };
  const activeCount = counts[activeTab];
  const activeError = activeTab === "benefit" ? benefitError : configurationError;

  const handleMetricSelect = (metric: RequestsMetricKey) => {
    const nextMetric = activeMetric === metric ? null : metric;
    const nextCounts = {
      benefit: filterBenefitRequests(
        benefitRequests,
        nextMetric,
        normalizedUserIdentifier,
        normalizedUserRole,
      ).length,
      configuration: filterApprovalRequests(
        configurationRequests,
        nextMetric,
        normalizedUserIdentifier,
        normalizedUserRole,
      ).length,
      override: filterApprovalRequests(
        overrideRequests,
        nextMetric,
        normalizedUserIdentifier,
        normalizedUserRole,
      ).length,
    };

    setActiveMetric(nextMetric);
    setActiveTab(getTabForMetric(nextMetric, activeTab, nextCounts));
  };

  if (loading) {
    return <RequestsBoardSkeleton />;
  }

  return (
    <section className="mt-[32px] flex w-full flex-col gap-[48px] pb-10">
      <RequestsMetrics
        activeMetric={activeMetric}
        metrics={metrics}
        onMetricSelect={handleMetricSelect}
      />

      <div className="flex flex-col gap-[24px]">
        <RequestsBoardToolbar
          activeMetric={activeMetric}
          activeTab={activeTab}
          benefitCount={counts.benefit}
          configurationCount={counts.configuration}
          onClearFilter={() => setActiveMetric(null)}
          onTabChange={setActiveTab}
          overrideCount={counts.override}
        />

        <section className="relative isolate min-h-[680px] overflow-hidden rounded-[22px] border border-[#E5E7EB] bg-white py-[18px] shadow-[0_1px_2px_rgba(16,24,40,0.05),0_1px_3px_rgba(16,24,40,0.1)]">
          <div className="pointer-events-none absolute inset-0 bg-[rgba(255,255,255,0.002)]" />
          {activeError ? (
            <div className="relative z-[1] flex h-full items-center px-6 font-sans text-[14px] leading-6 text-[#B42318]">
              {activeError}
            </div>
          ) : activeCount === 0 ? (
            <div className="relative z-[1] flex h-full items-center p-6">
              <EmptyTableState message={resolveEmptyMessage(activeMetric, activeTab)} />
            </div>
          ) : activeTab === "benefit" ? (
            <BenefitRequestsTable
              currentUserRole={currentUserRole}
              onReview={onBenefitReview}
              requests={filteredBenefitRequests}
            />
          ) : activeTab === "configuration" ? (
            <ConfigurationApprovalsTable
              currentUserRole={currentUserRole}
              onReview={onConfigurationReview}
              requests={filteredConfigurationRequests}
            />
          ) : (
            <OverrideRequestsTable
              currentUserRole={currentUserRole}
              onReview={onConfigurationReview}
              requests={filteredOverrideRequests}
            />
          )}
        </section>
      </div>
    </section>
  );
}
