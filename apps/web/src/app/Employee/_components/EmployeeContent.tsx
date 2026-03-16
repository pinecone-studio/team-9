import { bottomBenefits, topBenefits } from "./benefit-data";
import { BenefitsGroup } from "./BenefitsGroup";
import { EligibilitySignals } from "./EligibilitySignals";
import { EmployeeNav } from "./EmployeeNav";
import { RecentRequests } from "./RecentRequests";
import { SummaryCards } from "./SummaryCards";

type EmployeeContentProps = {
  employeeName: string;
};

export function EmployeeContent({ employeeName }: EmployeeContentProps) {
  return (
    <main className="min-h-screen bg-[#F4F5F7]">
      <div className="relative mx-auto min-h-[1700px] w-[1440px]">
        <EmployeeNav employeeName={employeeName} />

        <header
          className={[
            "absolute left-1/2 top-[120px] flex h-[54px] w-[560px]",
            "-translate-x-1/2 flex-col items-center gap-1",
          ].join(" ")}
        >
          <h1 className="text-[18px] font-semibold text-[#111827]">
            Welcome back, {employeeName}
          </h1>
          <p className="text-xs text-[#6B7280]">
            View your benefits, request new ones, and track your eligibility.
          </p>
        </header>

        <SummaryCards />

        <section
          className={[
            "absolute left-1/2 top-[378px] flex h-[323px] w-[1300px]",
            "-translate-x-1/2 items-start gap-5",
          ].join(" ")}
        >
          <RecentRequests />
          <EligibilitySignals />
        </section>

        <section
          className={[
            "absolute left-1/2 top-[735px] flex w-[1300px]",
            "-translate-x-1/2 flex-col gap-[28px]",
          ].join(" ")}
        >
          <BenefitsGroup items={topBenefits} />
          <BenefitsGroup items={bottomBenefits} />
        </section>
      </div>
    </main>
  );
}
