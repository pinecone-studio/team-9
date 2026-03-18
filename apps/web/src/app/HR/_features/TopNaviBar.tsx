"use client";

import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo } from "react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

import AuditLogsIcon from "../_icons/AuditLogs";
import BenefitsCatalogIcon from "../_icons/Benefits_catalog";
import ContractsIcon from "../_icons/Contracts";
import DashboardIcon from "../_icons/Dashboard";
import EligibilityRulesIcon from "../_icons/EligibilityRules";
import EmployeesIcon from "../_icons/Employees";
import RequestsIcon from "../_icons/Requests";
import TopNavLinkItem, { type NavigationItem } from "./TopNavLinkItem";
import {
  ContractsNavActivityDocument,
  getStoredContractsLastSeenAt,
  isContractRelatedActivity,
  storeContractsLastSeenAt,
  type ContractsNavActivityData,
} from "./top-nav.contracts-activity";

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
  {
    hasNotification: true,
    href: "/contracts",
    icon: ContractsIcon,
    key: "contracts",
    label: "Contracts",
  },
] satisfies NavigationItem[];

type TopNaviBarProps = {
  activeKey: HrNavKey;
};

export default function TopNaviBar({ activeKey }: TopNaviBarProps) {
  const { data } = useQuery<ContractsNavActivityData>(ContractsNavActivityDocument, {
    fetchPolicy: "cache-and-network",
    pollInterval: 30000,
  });

  const latestContractChangeAt = useMemo(() => {
    const entries = data?.listAuditLogEntries ?? [];
    let latest = 0;

    entries.forEach((entry) => {
      if (!isContractRelatedActivity(entry)) {
        return;
      }

      const timestamp = Date.parse(entry.createdAt);
      if (!Number.isNaN(timestamp) && timestamp > latest) {
        latest = timestamp;
      }
    });

    return latest;
  }, [data]);

  useEffect(() => {
    if (activeKey !== "contracts") {
      return;
    }

    const seenAt = latestContractChangeAt || Date.now();
    storeContractsLastSeenAt(seenAt);
  }, [activeKey, latestContractChangeAt]);

  const lastSeenContractChangeAt = getStoredContractsLastSeenAt();
  const shouldShowContractsDot =
    activeKey !== "contracts" &&
    latestContractChangeAt > 0 &&
    latestContractChangeAt > lastSeenContractChangeAt;

  return (
    <div className="h-[78px] w-full max-w-[860px] rounded-2xl border border-[#e6e1e1] bg-white px-6 font-sans shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
      <div className="flex h-full items-center gap-6">
        <nav aria-label="HR sections" className="min-w-0 flex-1 overflow-hidden">
          <ul className="flex w-full items-start justify-between gap-2">
            {navigationItems.map((item) => (
              <TopNavLinkItem
                activeKey={activeKey}
                item={item}
                key={item.key}
                showNotificationDot={
                  item.key === "contracts" ? shouldShowContractsDot : Boolean(item.hasNotification)
                }
              />
            ))}
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
