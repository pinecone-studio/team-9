"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

import AuditLogsIcon from "../_icons/AuditLogs";
import BenefitsCatalogIcon from "../_icons/Benefits_catalog";
import ContractsIcon from "../_icons/Contracts";
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
  | "audit-logs"
  | "contracts";

type NavigationItem = {
  hasNotification?: boolean;
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

const CONTRACTS_LAST_SEEN_KEY = "hr_contracts_last_seen_at";

const ContractsNavActivityDocument = gql`
  query ContractsNavActivity {
    listAuditLogEntries {
      id
      entityType
      action
      metadata
      createdAt
    }
  }
`;

type ContractsNavActivityEntry = {
  action: string;
  createdAt: string;
  entityType: string;
  id: string;
  metadata?: string | null;
};

type ContractsNavActivityData = {
  listAuditLogEntries: ContractsNavActivityEntry[];
};

function isContractRelatedActivity(entry: ContractsNavActivityEntry) {
  const searchableText = `${entry.entityType} ${entry.action} ${entry.metadata ?? ""}`;
  return /contract/i.test(searchableText);
}

export default function TopNaviBar({ activeKey }: TopNaviBarProps) {
  const [lastSeenContractChangeAt, setLastSeenContractChangeAt] = useState(0);
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
    const storedValue =
      typeof window !== "undefined" ? window.localStorage.getItem(CONTRACTS_LAST_SEEN_KEY) : null;
    const parsedValue = Number(storedValue);

    if (!Number.isNaN(parsedValue) && parsedValue > 0) {
      setLastSeenContractChangeAt(parsedValue);
    }
  }, []);

  useEffect(() => {
    if (activeKey !== "contracts") {
      return;
    }

    const seenAt = latestContractChangeAt || Date.now();
    setLastSeenContractChangeAt(seenAt);
    window.localStorage.setItem(CONTRACTS_LAST_SEEN_KEY, String(seenAt));
  }, [activeKey, latestContractChangeAt]);

  const shouldShowContractsDot =
    latestContractChangeAt > 0 && latestContractChangeAt > lastSeenContractChangeAt;

  return (
    <div className="h-[78px] w-full max-w-[860px] rounded-2xl border border-[#e6e1e1] bg-white px-6 font-sans shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
      <div className="flex h-full items-center gap-6">
        <nav aria-label="HR sections" className="min-w-0 flex-1 overflow-hidden">
          <ul className="flex w-full items-start justify-between gap-2">
            {navigationItems.map(
              ({ hasNotification, href, icon: Icon, key, label }) => {
              const isActive = activeKey === key;

              return (
                <li key={key} className="flex h-[54px] min-w-0 flex-1 items-center">
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative isolate flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl text-[12px] leading-none whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
                      isActive
                        ? "text-slate-950"
                        : "text-slate-500 hover:text-slate-700"
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
                    <span className={isActive ? "font-semibold" : "font-medium"}>
                      {label}
                    </span>
                    {(key === "contracts" ? shouldShowContractsDot : hasNotification) ? (
                      <span className="absolute top-0 right-2 h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                    ) : null}
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
