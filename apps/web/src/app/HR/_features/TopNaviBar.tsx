"use client";

import Link from "next/link";
import { Show } from "@clerk/nextjs";
import {
  FilePenLine,
  FileText,
  Grid2x2,
  LayoutGrid,
  Shield,
  Users,
  Waypoints,
} from "lucide-react";
import { useRequestsNavBadgeQuery } from "@/shared/apollo/generated";
import { SignOutAvatarButton } from "@/shared/auth/SignOutAvatarButton";
import BmsLogo from "../_icons/BmsLogo";
import TopNavLinkItem, { type NavigationItem } from "./TopNavLinkItem";

export type HrNavKey =
  | "dashboard"
  | "benefits-catalog"
  | "employees"
  | "requests"
  | "eligibility-rules"
  | "audit-logs"
  | "contracts";

const navigationItems = [
  {
    href: "/dashboard",
    icon: LayoutGrid,
    key: "dashboard",
    label: "Dashboard",
  },
  {
    href: "/requests",
    icon: FilePenLine,
    key: "requests",
    label: "Requests",
  },
  {
    href: "/employees",
    icon: Users,
    key: "employees",
    label: "Employees",
  },
  {
    href: "/benefits-catalog",
    icon: Grid2x2,
    key: "benefits-catalog",
    label: "Benefits",
  },
  {
    href: "/eligibility-rules",
    icon: Waypoints,
    key: "eligibility-rules",
    label: "Rules",
  },
  {
    href: "/contracts",
    icon: FileText,
    key: "contracts",
    label: "Contracts",
  },
  {
    href: "/audit-logs",
    icon: Shield,
    key: "audit-logs",
    label: "Audit Logs",
  },
] satisfies NavigationItem[];

type TopNaviBarProps = {
  activeKey: HrNavKey;
};

function TopNavLogo() {
  return (
    <Link
      aria-label="Go to Dashboard"
      className="flex h-[38px] w-[86px] items-center text-black"
      href="/dashboard"
    >
      <BmsLogo className="h-[38px] w-[86px]" />
    </Link>
  );
}

export default function TopNaviBar({ activeKey }: TopNaviBarProps) {
  const { data } = useRequestsNavBadgeQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });
  const pendingRequestsCount =
    (data?.approvalRequests.length ?? 0) +
    (data?.countPendingBenefitRequests ?? 0);

  return (
    <div className="relative z-[2] w-full max-w-[1120px] rounded-[16px] border border-[rgba(229,229,229,0.6)] bg-[rgba(255,255,255,0.95)] px-5 py-3 font-sans shadow-[0_67px_27px_rgba(0,0,0,0.01),0_37px_22px_rgba(0,0,0,0.04),0_17px_17px_rgba(0,0,0,0.06),0_4px_9px_rgba(0,0,0,0.07)] backdrop-blur-[4px]">
      <div className="flex h-[44px] items-center gap-4">
        <div className="shrink-0">
          <TopNavLogo />
        </div>

        <nav aria-label="HR sections" className="min-w-0 flex-1 overflow-visible">
          <ul className="flex h-9 w-full items-center justify-center gap-[2px] overflow-visible">
            {navigationItems.map((item) => (
              <TopNavLinkItem
                key={item.key}
                activeKey={activeKey}
                item={
                  item.key === "requests"
                    ? { ...item, notificationCount: pendingRequestsCount }
                    : item
                }
              />
            ))}
          </ul>
        </nav>

        <div className="top-nav-user-button shrink-0">
          <Show when="signed-out">
            <Link
              className="inline-flex h-11 items-center rounded-full border border-[#d8d7d4] bg-[#f8f7f4] px-4 text-[13px] font-medium text-slate-700 transition-colors hover:bg-white"
              href="/auth/login"
            >
              Sign in
            </Link>
          </Show>
          <Show when="signed-in">
            <div className="relative rounded-full transition-transform hover:scale-[1.02]">
              <SignOutAvatarButton className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d8d7d4] bg-[#f8f7f4] text-[14px] font-semibold leading-none text-slate-700 transition-colors hover:bg-white" />
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
