import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { HrNavKey } from "./TopNaviBar";

export type NavigationItem = {
  href: string;
  icon: LucideIcon;
  key: HrNavKey;
  label: string;
  notificationCount?: number;
};

type TopNavLinkItemProps = {
  activeKey: HrNavKey;
  item: NavigationItem;
};

export default function TopNavLinkItem({
  activeKey,
  item,
}: TopNavLinkItemProps) {
  const { href, icon: Icon, key, label, notificationCount = 0 } = item;
  const isActive = activeKey === key;
  const hasNotification = notificationCount > 0;

  return (
    <li className="flex min-w-0 items-center overflow-visible">
      <Link
        aria-current={isActive ? "page" : undefined}
        className={`group relative isolate inline-flex h-9 items-center justify-center gap-2 overflow-visible rounded-[8px] px-[14px] text-[14px] leading-5 font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
          isActive
            ? "bg-black text-white"
            : "text-[#737373] hover:text-[#171717]"
        } ${hasNotification ? "z-10" : ""}`}
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
        {hasNotification ? (
          <>
            <span className="sr-only">{`${notificationCount} pending requests`}</span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[6px] -right-[8px] z-20 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-[rgba(255,255,255,0.95)] bg-[#EF4444] px-1 text-[11px] leading-none font-semibold tabular-nums text-white shadow-[0_1px_2px_rgba(15,23,42,0.18)]"
            >
              {notificationCount}
            </span>
          </>
        ) : null}
      </Link>
    </li>
  );
}
