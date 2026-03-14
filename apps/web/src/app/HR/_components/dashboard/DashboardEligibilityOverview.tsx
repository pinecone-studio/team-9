import { buildEligibilityOverview, type DashboardBenefitSummary } from "./dashboard-helpers";

type DashboardEligibilityOverviewProps = {
  rows: DashboardBenefitSummary[];
};

type ProgressBarProps = {
  label: string;
  value: number;
};

function ProgressBar({ label, value }: ProgressBarProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-[14px] leading-5 text-[#737373]">{label}</p>
        <p className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{value}%</p>
      </div>
      <div className="h-2 rounded-full bg-[#F5F5F5]">
        <div
          className="h-2 rounded-full bg-black transition-[width] duration-300"
          style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardEligibilityOverview({
  rows,
}: DashboardEligibilityOverviewProps) {
  const overview = buildEligibilityOverview(rows);

  return (
    <section className="w-full rounded-[12px] border border-[#DBDEE1] bg-white px-6 py-5">
      <h2 className="text-[16px] leading-[21px] font-semibold text-black">
        Employee Eligibility Overview
      </h2>
      <p className="mt-2 text-[14px] leading-[18px] text-[#737373]">System health at a glance</p>
      <div className="mt-5 flex flex-col gap-6 xl:flex-row xl:gap-8">
        <ProgressBar label="Eligible Employees" value={overview.eligiblePercent} />
        <ProgressBar label="Blocked by Rules" value={overview.blockedPercent} />
        <ProgressBar label="Pending Requirements" value={overview.pendingPercent} />
      </div>
    </section>
  );
}
