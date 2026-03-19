import type { LucideIcon } from "lucide-react";
import { CheckSquare2, History, ListChecks, Search } from "lucide-react";
import type {
  EligibilityRuleDashboardStat,
  EligibilityRuleFilterTab,
} from "./eligibility-rules-dashboard";

type EligibilityRulesHeaderProps = {
  activeTab: string;
  onSearchChange: (value: string) => void;
  onTabChange: (value: string) => void;
  searchValue: string;
  stats: EligibilityRuleDashboardStat[];
  tabs: EligibilityRuleFilterTab[];
};

export default function EligibilityRulesHeader({
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  stats,
  tabs,
}: EligibilityRulesHeaderProps) {
  const statIcons: LucideIcon[] = [ListChecks, CheckSquare2, History];

  return (
    <section className="mx-auto flex w-full max-w-[1300px] flex-col items-center gap-[46px] px-4 pt-[18px] sm:px-0">
      <div className="relative flex w-full flex-col items-center gap-8 overflow-hidden rounded-[16px] bg-[linear-gradient(125deg,#9EC8FF_0%,#2B58D3_32%,#1D318E_66%,#0B0F3D_100%)] px-[30px] py-[50px] shadow-[0_24px_48px_rgba(25,43,107,0.22)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(255,255,255,0.42),transparent_28%),radial-gradient(circle_at_88%_22%,rgba(255,255,255,0.14),transparent_24%),linear-gradient(120deg,rgba(255,255,255,0.08),transparent_48%)]" />
        <div className="relative flex w-full max-w-[560px] flex-col items-center gap-[5px]">
          <h1 className="w-full text-center text-[24px] leading-[31px] font-semibold text-white">
            Eligibility Rules
          </h1>
          <p className="w-full text-center text-[14px] leading-[18px] font-normal text-white/90">
            Configure benefit eligibility rules
          </p>
        </div>

        <div className="relative grid w-full gap-5 xl:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = statIcons[index] ?? ListChecks;
            return (
              <div
                key={stat.label}
                className="flex min-h-[160px] flex-col justify-center gap-4 rounded-[8px] bg-black/10 p-6 text-white backdrop-blur-[2px]"
              >
                <div className="flex items-center gap-[6px]">
                  <Icon className="h-6 w-6 shrink-0 text-white" />
                  <span className="text-[14px] leading-5 font-medium text-white">
                    {stat.label}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[40px] leading-9 font-bold text-white">
                    {stat.value}
                  </span>
                  <span className="text-[12px] leading-4 font-medium text-white/90">
                    {stat.helper}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex w-full flex-col items-stretch gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-[30px]">
        <div className="flex h-auto w-full flex-wrap items-center justify-center gap-[6px] rounded-[10px] bg-[#F5F5F5] p-[3px] xl:h-9 xl:w-auto xl:flex-nowrap">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;

            return (
              <button
                key={tab.key}
                className={`flex h-[29px] items-center justify-center gap-[6px] rounded-[8px] px-2 py-1 text-[14px] leading-5 font-medium transition ${
                  isActive
                    ? "bg-white text-[#0A0A0A] shadow-[0_2px_4px_rgba(0,0,0,0.14)]"
                    : "text-[#0A0A0A]"
                }`}
                onClick={() => onTabChange(tab.key)}
                type="button"
              >
                <span>{tab.label}</span>
                <span
                  className={`flex h-[22px] min-w-[26px] items-center justify-center rounded-[8px] px-2 text-[12px] leading-4 font-medium ${
                    isActive
                      ? "bg-[#DBEAFE] text-[#1447E6]"
                      : "bg-[#F5F5F5] text-[#171717]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex h-9 w-full items-center gap-2 rounded-[4px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] xl:max-w-[589px]">
          <Search className="h-4 w-4 shrink-0 text-[#51565B]" />
          <input
            aria-label="Search rules"
            className="h-[18px] w-full border-none bg-transparent text-[14px] leading-[18px] font-normal text-[#51565B] outline-none placeholder:text-[#51565B]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search rules..."
            type="text"
            value={searchValue}
          />
        </div>
      </div>
    </section>
  );
}
