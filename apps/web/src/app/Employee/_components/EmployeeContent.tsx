import { Geist } from "next/font/google";
import { BenefitsGroup } from "./BenefitsGroup";
import { EmployeeDashboardAutoRefresh } from "./EmployeeDashboardAutoRefresh";
import { EligibilitySignals } from "./EligibilitySignals";
import { EmployeeNav } from "./EmployeeNav";
import { RecentRequests } from "./RecentRequests";
import { SummaryCards } from "./SummaryCards";
import type { EmployeeDashboardViewData } from "./employee-types";

type EmployeeContentProps = {
  currentUserIdentifier: string;
  dashboardData: EmployeeDashboardViewData;
  employeeEmail: string | null;
  employeeId: string;
  employeeName: string;
};

const geist = Geist({
  subsets: ["latin"],
});

export function EmployeeContent({
  currentUserIdentifier,
  dashboardData,
  employeeEmail,
  employeeId,
  employeeName,
}: EmployeeContentProps) {
  const shouldAutoRefresh = dashboardData.requests.some(
    (request) => request.status === "Pending",
  );

  return (
    <main className={`${geist.className} min-h-screen bg-[#f5f4f4] px-4 py-8 sm:px-6 lg:px-8`}>
      <EmployeeDashboardAutoRefresh enabled={shouldAutoRefresh} />
      <div className="mx-auto flex w-full max-w-[1300px] flex-col">
        <EmployeeNav employeeName={employeeName} />

        <header className="mt-8 flex flex-col items-center gap-[5px] text-center sm:mt-10">
          <h1 className="text-[24px] font-semibold leading-[31px] text-black">
            Welcome back, {employeeName}
          </h1>
          <p className="text-[14px] leading-[18px] text-[#555555]">
            View your benefits, request new ones, and track your eligibility.
          </p>
        </header>

        <SummaryCards cards={dashboardData.summaryCards} className="mt-8" />

        <section
          id="my-requests"
          className="mt-6 grid scroll-mt-32 gap-5 xl:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]"
        >
          <RecentRequests requests={dashboardData.requests} />
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
                employeeEmail={employeeEmail}
                employeeId={employeeId}
                employeeName={employeeName}
                key={section.id}
                section={section}
              />
            ))
          )}
        </section>
      </div>
    </main>
  );
}
