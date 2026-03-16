import type { ReactNode } from "react";
import type { ApprovalRequestRecord } from "./approval-requests.graphql";
import {
  BenefitRequestsTable,
  ConfigurationApprovalsTable,
  EmptyTableState,
} from "./RequestsBoardTables";
import { RequestsMetrics, SectionHeader } from "./RequestsBoardMetrics";

type RequestsBoardContentProps = {
  configurationRequests: ApprovalRequestRecord[];
  benefitRequests: ApprovalRequestRecord[];
  currentUserIdentifier: string;
  error?: string | null;
  loading: boolean;
  metrics: Record<string, number>;
  onReview: (requestId: string) => void;
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
  configurationRequests,
  currentUserIdentifier,
  error,
  loading,
  metrics,
  onReview,
}: RequestsBoardContentProps) {
  return (
    <section className="flex w-full flex-col gap-6 pt-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-[24px] leading-8 font-semibold text-[#0A0A0A]">Requests</h1>
        <p className="text-[14px] leading-5 text-[#737373]">
          Review employee benefit requests and configuration changes.
        </p>
      </div>

      <RequestsMetrics metrics={metrics} />

      <div className="flex flex-col gap-4">
        <SectionHeader count={configurationRequests.length} title="Configuration Approvals" />
        <SectionFrame>
          {loading ? (
            <div className="px-6 text-[14px] leading-6 text-[#737373]">Loading configuration approvals...</div>
          ) : error ? (
            <div className="px-6 text-[14px] leading-6 text-[#B42318]">Configuration approvals could not be loaded.</div>
          ) : configurationRequests.length === 0 ? (
            <div className="px-6"><EmptyTableState message="No configuration approvals found." /></div>
          ) : (
            <ConfigurationApprovalsTable currentUserIdentifier={currentUserIdentifier} onReview={onReview} requests={configurationRequests} />
          )}
        </SectionFrame>
      </div>

      <div className="flex flex-col gap-4 pb-10">
        <SectionHeader count={benefitRequests.length} title="Benefit Requests" />
        <SectionFrame>
          {loading ? (
            <div className="px-6 text-[14px] leading-6 text-[#737373]">Loading benefit requests...</div>
          ) : error ? (
            <div className="px-6 text-[14px] leading-6 text-[#B42318]">Benefit requests could not be loaded.</div>
          ) : benefitRequests.length === 0 ? (
            <div className="px-6"><EmptyTableState message="No benefit requests found." /></div>
          ) : (
            <BenefitRequestsTable currentUserIdentifier={currentUserIdentifier} onReview={onReview} requests={benefitRequests} />
          )}
        </SectionFrame>
      </div>
    </section>
  );
}
