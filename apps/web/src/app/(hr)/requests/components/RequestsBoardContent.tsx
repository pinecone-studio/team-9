"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type {
  ApprovalRequestRecord,
} from "./approval-requests.graphql";
import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import {
  ConfigurationApprovalsTable,
  EmptyTableState,
} from "./RequestsBoardTables";
import BenefitRequestsTable from "./BenefitRequestsTable";
import RequestsBoardSkeleton from "./RequestsBoardSkeleton";
import {
  type RequestsMetricKey,
  RequestsMetrics,
} from "./RequestsBoardMetrics";
import {
  filterBenefitRequests,
  filterConfigurationRequests,
  getTabForMetric,
} from "./requests-board-filters";
import RequestsBoardToolbar from "./RequestsBoardToolbar";

type RequestsBoardContentProps = {
  configurationRequests: ApprovalRequestRecord[];
  benefitRequests: BenefitRequestRecord[];
  benefitError?: string | null;
  currentUserIdentifier: string;
  currentUserRole: string;
  configurationError?: string | null;
  loading: boolean;
  metrics: Record<string, number>;
  onBenefitReview: (requestId: string) => void;
  onConfigurationReview: (requestId: string) => void;
};

function SectionFrame({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-[14px] border border-[#E5E5E5] bg-white px-0 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.08)]">
      {children}
    </section>
  );
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
}: RequestsBoardContentProps) {
  const [activeTab, setActiveTab] = useState<"benefit" | "configuration">("benefit");
  const [activeMetric, setActiveMetric] = useState<RequestsMetricKey | null>(null);
  const normalizedUserIdentifier = currentUserIdentifier.trim().toLowerCase();
  const activeError = activeTab === "benefit" ? benefitError : configurationError;

  const filteredBenefitRequests = filterBenefitRequests(
    benefitRequests,
    activeMetric,
    normalizedUserIdentifier,
  );
  const filteredConfigurationRequests = filterConfigurationRequests(
    configurationRequests,
    activeMetric,
    normalizedUserIdentifier,
  );

  const activeCount =
    activeTab === "benefit"
      ? filteredBenefitRequests.length
      : filteredConfigurationRequests.length;

  const handleMetricSelect = (metric: RequestsMetricKey) => {
    const nextMetric = activeMetric === metric ? null : metric;
    const nextBenefitRequests = filterBenefitRequests(
      benefitRequests,
      nextMetric,
      normalizedUserIdentifier,
    );
    const nextConfigurationRequests = filterConfigurationRequests(
      configurationRequests,
      nextMetric,
      normalizedUserIdentifier,
    );

    setActiveMetric(nextMetric);
    setActiveTab(
      getTabForMetric(
        nextMetric,
        activeTab,
        nextBenefitRequests.length,
        nextConfigurationRequests.length,
      ),
    );
  };

  if (loading) {
    return <RequestsBoardSkeleton />;
  }

  return (
    <section className="flex w-full flex-col gap-6 pt-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-[24px] leading-8 font-semibold text-[#0A0A0A]">Requests</h1>
        <p className="text-[14px] leading-5 text-[#737373]">
          Review employee benefit requests and configuration changes.
        </p>
      </div>

      <RequestsMetrics
        activeMetric={activeMetric}
        metrics={metrics}
        onMetricSelect={handleMetricSelect}
      />

      <div className="flex flex-col gap-4 pb-10">
        <RequestsBoardToolbar
          activeMetric={activeMetric}
          activeTab={activeTab}
          benefitCount={filteredBenefitRequests.length}
          configurationCount={filteredConfigurationRequests.length}
          onClearFilter={() => setActiveMetric(null)}
          onTabChange={setActiveTab}
        />
        <SectionFrame>
          {activeError ? (
            <div className="px-6 text-[14px] leading-6 text-[#B42318]">{activeError}</div>
          ) : activeCount === 0 ? (
            <div className="px-6">
              <EmptyTableState
                message={
                  activeTab === "benefit"
                    ? activeMetric
                      ? "No benefit requests match this filter."
                      : "No benefit requests found."
                    : activeMetric
                      ? "No configuration approvals match this filter."
                      : "No configuration approvals found."
                }
              />
            </div>
          ) : activeTab === "benefit" ? (
            <BenefitRequestsTable currentUserIdentifier={currentUserIdentifier} currentUserRole={currentUserRole} onReview={onBenefitReview} requests={filteredBenefitRequests} />
          ) : (
            <ConfigurationApprovalsTable currentUserIdentifier={currentUserIdentifier} onReview={onConfigurationReview} requests={filteredConfigurationRequests} />
          )}
        </SectionFrame>
      </div>
    </section>
  );
}
