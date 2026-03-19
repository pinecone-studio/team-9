"use client";

import { Geist } from "next/font/google";
import { useState } from "react";
import { BenefitsGroup } from "./BenefitsGroup";
import { EmployeeDashboardAutoRefresh } from "./EmployeeDashboardAutoRefresh";
import EmployeeRequestDialog from "./EmployeeRequestDialog";
import { EligibilitySignals } from "./EligibilitySignals";
import { EmployeeNav } from "./EmployeeNav";
import { RecentRequests } from "./RecentRequests";
import { SummaryCards } from "./SummaryCards";
import type { EmployeeDashboardViewData, EmployeeRequestItem } from "./employee-types";

type EmployeeContentProps = {
  currentUserIdentifier: string;
  dashboardData: EmployeeDashboardViewData;
  employeeId: string;
  employeeName: string;
  errorMessage?: string | null;
  isLoading?: boolean;
};

const geist = Geist({
  subsets: ["latin"],
});

export function EmployeeContent({
  currentUserIdentifier,
  dashboardData,
  employeeId,
  employeeName,
  errorMessage,
  isLoading = false,
}: EmployeeContentProps) {
  const [selectedRequest, setSelectedRequest] = useState<EmployeeRequestItem | null>(null);
  const shouldAutoRefresh = dashboardData.requests.some(
    (request) => request.status === "Pending",
  );

  return (
    <main className={`${geist.className} min-h-screen bg-[#f5f4f4] px-4 py-8 sm:px-6 lg:px-8`}>
      <EmployeeDashboardAutoRefresh enabled={shouldAutoRefresh} />
      <div className="mx-auto flex w-full max-w-[1300px] flex-col">
        <section className="mt-8 flex items-start justify-between gap-6 sm:mt-10">
          <header className="min-w-0 flex-1 pt-1 text-center sm:pl-[76px]">
            <h1 className="text-[24px] font-semibold leading-[31px] text-black">
              Welcome back, {employeeName}
            </h1>
            <p className="mt-[5px] text-[14px] leading-[18px] text-[#555555]">
              View your benefits, request new ones, and track your eligibility.
            </p>
          </header>

          <div className="shrink-0">
            <EmployeeNav employeeName={employeeName} />
          </div>
        </section>

        <SummaryCards cards={dashboardData.summaryCards} className="mt-8" />
        {isLoading ? (
          <p className="mt-3 text-center text-[13px] text-[#6B7280]">
            Loading latest dashboard data...
          </p>
        ) : null}
        {errorMessage ? (
          <div className="mt-4 rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] text-[#B91C1C]">
            {errorMessage}
          </div>
        ) : null}

        <section
          id="my-requests"
          className="mt-6 grid scroll-mt-32 gap-5 xl:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]"
        >
          <RecentRequests
            onSelect={setSelectedRequest}
            requests={dashboardData.requests}
          />
          <EligibilitySignals signals={dashboardData.signals} />
        </section>

        <section className="mt-7 flex flex-col gap-[28px] pb-16">
          {dashboardData.sections.length === 0 ? (
            <article className="rounded-[14px] border border-dashed border-[#d7d3d3] bg-white px-6 py-10 text-center text-[15px] text-slate-500">
              Benefits data is not available yet.
            </article>
          ) : (
            dashboardData.sections.map((section) => (
              <BenefitsGroup
                currentUserIdentifier={currentUserIdentifier}
                employeeId={employeeId}
                key={section.id}
                section={section}
              />
            ))
          )}
        </section>
        {selectedRequest ? (
          <EmployeeRequestDialog
            currentUserIdentifier={currentUserIdentifier}
            employeeId={employeeId}
            onClose={() => setSelectedRequest(null)}
            onSubmitted={async () => {
              setSelectedRequest(null);
            }}
            request={selectedRequest}
          />
        ) : null}
      </div>
    </main>
  );
}
