import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

import AuditLogsIcon from "../_icons/AuditLogs";
import AvatarIcon from "../_icons/AvatarIcon";
import BenefitsCatalogIcon from "../_icons/Benefits_catalog";
import DashboardIcon from "../_icons/Dashboard";
import EligibilityRulesIcon from "../_icons/EligibilityRules";
import EmployeesIcon from "../_icons/Employees";
import RequestsIcon from "../_icons/Requests";

export type HrNavKey =
  | "dashboard"
  | "benefits-catalog"
  | "employees"
  | "requests"
  | "eligibility-rules"
  | "audit-logs";

type NavigationItem = {
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  key: HrNavKey;
  label: string;
  width: number;
};

const navigationItems = [
  {
    href: "/dashboard",
    icon: DashboardIcon,
    key: "dashboard",
    label: "Dashboard",
    width: 100,
  },
  {
    href: "/benefits-catalog",
    icon: BenefitsCatalogIcon,
    key: "benefits-catalog",
    label: "Benefits catalog",
    width: 111,
  },
  {
    href: "/employees",
    icon: EmployeesIcon,
    key: "employees",
    label: "Employees",
    width: 100,
  },
  {
    href: "/requests",
    icon: RequestsIcon,
    key: "requests",
    label: "Requests",
    width: 100,
  },
  {
    href: "/eligibility-rules",
    icon: EligibilityRulesIcon,
    key: "eligibility-rules",
    label: "Eligibility rules",
    width: 100,
  },
  {
    href: "/audit-logs",
    icon: AuditLogsIcon,
    key: "audit-logs",
    label: "Audit Logs",
    width: 100,
  },
] satisfies NavigationItem[];

type TopNaviBarProps = {
  activeKey: HrNavKey;
};

export default function TopNaviBar({ activeKey }: TopNaviBarProps) {
  return (
    <div className="w-full max-w-229.5 rounded-2xl border border-[#e6e1e1] bg-white px-6 py-4 font-sans shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-6">
        <nav
          aria-label="HR sections"
          className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex min-w-max items-start gap-5">
            {navigationItems.map(({ href, icon: Icon, key, label, width }) => {
              const isActive = activeKey === key;

              return (
                <li key={key} className="shrink-0">
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex flex-col items-center gap-2 rounded-xl py-1.5 text-[13px] leading-none whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
                      isActive
                        ? "text-slate-950"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                    href={href}
                    style={{ width }}
                  >
                    <span className="flex h-7 items-center justify-center">
                      <Icon
                        className={`h-6 w-6 transition-colors ${
                          isActive
                            ? "text-slate-950"
                            : "text-slate-500 group-hover:text-slate-700"
                        }`}
                      />
                    </span>
                    <span className={isActive ? "font-semibold" : "font-medium"}>
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="h-11 w-px shrink-0 bg-[#e6e1e1]" />

        <button
          aria-label="Profile"
          className="shrink-0 rounded-full transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          type="button"
        >
          <AvatarIcon className="h-11 w-11" />
        </button>
      </div>
    </div>
  );
}
