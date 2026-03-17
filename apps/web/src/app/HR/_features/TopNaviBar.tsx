"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  FilePenLine,
  FileText,
  Grid2x2,
  LayoutGrid,
  Shield,
  Users,
  Waypoints,
} from "lucide-react";
import BmsLogo from "../_icons/BmsLogo";

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
  icon: LucideIcon;
  key: HrNavKey;
  label: string;
};

const navigationItems = [
  {
    href: "/dashboard",
    icon: LayoutGrid,
    key: "dashboard",
    label: "Dashboard",
  },
  {
    hasNotification: true,
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
    hasNotification: true,
    href: "/contracts",
    icon: FileText,
    key: "contracts",
    label: "Contracts",
  },
  {
    hasNotification: true,
    href: "/audit-logs",
    icon: Shield,
    key: "audit-logs",
    label: "Audit Logs",
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
    <div className="relative z-[2] w-full max-w-[1120px] rounded-[16px] border border-[rgba(229,229,229,0.6)] bg-[rgba(255,255,255,0.95)] px-5 py-3 font-sans shadow-[0_67px_27px_rgba(0,0,0,0.01),0_37px_22px_rgba(0,0,0,0.04),0_17px_17px_rgba(0,0,0,0.06),0_4px_9px_rgba(0,0,0,0.07)] backdrop-blur-[4px]">
      <div className="flex h-[44px] items-center gap-4">
        <div className="shrink-0">
          <TopNavLogo />
        </div>

        <nav aria-label="HR sections" className="min-w-0 flex-1 overflow-hidden">
          <ul className="flex h-9 w-full items-center justify-center gap-[2px]">
            {navigationItems.map(
              ({ hasNotification, href, icon: Icon, key, label }) => {
              const isActive = activeKey === key;

              return (
                <li key={key} className="flex min-w-0 items-center">
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative isolate inline-flex h-9 items-center justify-center gap-2 rounded-[8px] px-[14px] text-[14px] leading-5 font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
                      isActive
                        ? "bg-black text-white"
                        : "text-[#737373] hover:text-[#171717]"
                    }`}
                    href={href}
                  >
                    <span className="flex h-5 w-5 items-center justify-center">
                      <Icon
                        className={`transition-colors ${
                          isActive
                            ? "h-5 w-5 text-white"
                            : "h-5 w-5 text-[#737373] group-hover:text-[#171717]"
                        }`}
                        strokeWidth={2}
                      />
                    </span>
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

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
            <div className="relative rounded-full transition-transform hover:scale-[1.02]">
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
