"use client";

import { Geist } from "next/font/google";
import { useState } from "react";
import { BenefitsGroup } from "./BenefitsGroup";
import EmployeeDashboardSkeleton from "./EmployeeDashboardSkeleton";
import EmployeeRequestDialog from "./EmployeeRequestDialog";
import { EligibilitySignals } from "./EligibilitySignals";
import { EmployeeNav } from "./EmployeeNav";
import { RecentRequests } from "./RecentRequests";
import { SummaryCards } from "./SummaryCards";
import type {
  EmployeeDashboardViewData,
  EmployeeRequestItem,
} from "./employee-types";

type EmployeeContentProps = {
  currentUserIdentifier: string;
  dashboardData: EmployeeDashboardViewData;
  employeeId: string;
  employeeName: string;
  errorMessage?: string | null;
  isInitialLoading?: boolean;
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
  isInitialLoading = false,
  isLoading = false,
}: EmployeeContentProps) {
  const [selectedRequest, setSelectedRequest] =
    useState<EmployeeRequestItem | null>(null);

  if (isInitialLoading) {
    return <EmployeeDashboardSkeleton />;
  }

  return (
    <main
      className={`${geist.className} min-h-screen bg-[#f5f4f4] px-4 py-8 sm:px-6 lg:px-8`}
    >
      <div className="mx-auto flex w-full max-w-[1300px] flex-col">
        <section className="relative mt-8 overflow-hidden rounded-[16px] border border-[#A9CDFF]/45 px-5 py-6 shadow-[0_28px_70px_rgba(99,121,255,0.18)] sm:mt-10 sm:px-[30px] sm:py-[50px] xl:h-[358px]">
          <div className="pointer-events-none absolute inset-[3px] rounded-[12px] border border-white/10" />
          <video
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src="/contracts-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(61,50,145,0.82)_0%,rgba(96,141,238,0.74)_56%,rgba(194,204,255,0.56)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.16),transparent_24%),radial-gradient(circle_at_70%_16%,rgba(255,255,255,0.18),transparent_18%),radial-gradient(circle_at_88%_78%,rgba(236,216,255,0.24),transparent_20%)]" />

          <div className="absolute right-5 top-5 z-10 sm:right-[30px] sm:top-7">
            <EmployeeNav employeeName={employeeName} variant="hero" />
          </div>

          <div className="relative flex min-h-[330px] flex-col items-center justify-between gap-10 pt-14 sm:h-full sm:min-h-0 sm:gap-[31px] sm:pt-0">
            <header className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-[5px] text-center sm:h-[54px]">
              <h1 className="flex w-full items-center justify-center text-center text-[24px] font-semibold leading-[31px] text-white">
                Welcome back, {employeeName}
              </h1>
              <p className="flex w-full items-center justify-center text-center text-[14px] leading-[18px] text-white">
                View your benefits, request new ones, and track your
                eligibility.
              </p>
            </header>

            <SummaryCards
              cards={dashboardData.summaryCards}
              className="w-full"
              variant="hero"
            />
          </div>
        </section>
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
