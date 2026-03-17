"use client";

import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

import AuditLogsIcon from "../_icons/AuditLogs";
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
};

const navigationItems = [
  {
    href: "/dashboard",
    icon: DashboardIcon,
    key: "dashboard",
    label: "Dashboard",
  },
  {
    href: "/benefits-catalog",
    icon: BenefitsCatalogIcon,
    key: "benefits-catalog",
    label: "Benefits catalog",
  },
  {
    href: "/employees",
    icon: EmployeesIcon,
    key: "employees",
    label: "Employees",
  },
  {
    href: "/requests",
    icon: RequestsIcon,
    key: "requests",
    label: "Requests",
  },
  {
    href: "/eligibility-rules",
    icon: EligibilityRulesIcon,
    key: "eligibility-rules",
    label: "Eligibility rules",
  },
  {
    href: "/audit-logs",
    icon: AuditLogsIcon,
    key: "audit-logs",
    label: "Audit Logs",
  },
] satisfies NavigationItem[];

type TopNaviBarProps = {
  activeKey: HrNavKey;
};

export default function TopNaviBar({ activeKey }: TopNaviBarProps) {
  return (
    <div className="h-[78px] w-full max-w-[860px] rounded-2xl border border-[#e6e1e1] bg-white px-6 font-sans shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
      <div className="flex h-full items-center gap-6">
        <nav
          aria-label="HR sections"
          className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex min-w-max items-start gap-4">
            {navigationItems.map(({ href, icon: Icon, key, label }) => {
              const isActive = activeKey === key;

              return (
                <li key={key} className="flex h-[54px] shrink-0 items-center">
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`group flex w-[100px] flex-col items-center justify-center gap-2 rounded-xl text-[13px] leading-none whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
                      isActive
                        ? "h-[54px] text-slate-950"
                        : "h-[44px] text-slate-500 hover:text-slate-700"
                    }`}
                    href={href}
                  >
                    <span className="flex h-7 items-center justify-center">
                      <Icon
                        className={`transition-colors ${
                          isActive
                            ? "h-[34px] w-[34px] text-slate-950"
                            : "h-6 w-6 text-slate-500 group-hover:text-slate-700"
                        }`}
                      />
                    </span>
                    <span
                      className={isActive ? "font-semibold" : "font-medium"}
                    >
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex h-full w-8 shrink-0 items-center justify-center">
          <div className="h-11 w-px bg-[#e6e1e1]" />
        </div>

        <div className="top-nav-user-button shrink-0">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                className="inline-flex h-11 items-center rounded-full border border-[#d8d7d4] bg-[#f8f7f4] px-4 text-[13px] font-medium text-slate-700 transition-colors hover:bg-white"
                type="button"
              >
                Sign in
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <div className="rounded-full transition-transform hover:scale-[1.02]">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "!h-11 !w-11",
                    userButtonTrigger: "!h-11 !w-11",
                  },
                }}
              />
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
