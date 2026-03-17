import { buildEligibilityOverview, type DashboardBenefitSummary } from "./dashboard-helpers";

type DashboardEligibilityOverviewProps = {
  rows: DashboardBenefitSummary[];
};

type ProgressBarProps = {
  label: string;
  value: number;
  colorClass: string;
};

function ProgressBar({ label, value, colorClass }: ProgressBarProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex h-5 items-center justify-between">
        <p className="text-[14px] leading-5 text-[#737373]">{label}</p>
        <p className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{value}%</p>
      </div>
      <div className="h-[10px] rounded-full bg-[#F5F5F5]">
        <div
          className={`h-[10px] rounded-full transition-[width] duration-300 ${colorClass}`}
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
    <section className="box-border flex h-[147px] w-full flex-col items-start gap-5 rounded-[12px] border border-[#DBDEE1] bg-white px-6 py-[21px]">
      <div className="flex h-[47px] w-full flex-col items-start gap-2">
        <h2 className="h-[21px] text-[16px] leading-[21px] font-semibold text-black">
          Employee Eligibility Overview
        </h2>
        <p className="h-[18px] text-[14px] leading-[18px] text-[#737373]">
          System health at a glance
        </p>
      </div>
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:gap-[31px]">
        <div className="w-full lg:w-[396.67px]">
          <ProgressBar
            colorClass="bg-[#1B4CFF]"
            label="Eligible Employees"
            value={overview.eligiblePercent}
          />
        </div>
        <div className="w-full lg:w-[396.67px]">
          <ProgressBar
            colorClass="bg-[#EF4444]"
            label="Blocked by Rules"
            value={overview.blockedPercent}
          />
        </div>
        <div className="w-full lg:w-[396.67px]">
          <ProgressBar
            colorClass="bg-[#FFD21A]"
            label="Pending Requirements"
            value={overview.pendingPercent}
          />
        </div>
      </div>
    </section>
  );
}
