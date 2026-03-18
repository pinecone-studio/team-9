import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

import type { HrNavKey } from "./TopNaviBar";

export type NavigationItem = {
  hasNotification?: boolean;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  key: HrNavKey;
  label: string;
};

type TopNavLinkItemProps = {
  activeKey: HrNavKey;
  item: NavigationItem;
  showNotificationDot: boolean;
};

export default function TopNavLinkItem({
  activeKey,
  item,
  showNotificationDot,
}: TopNavLinkItemProps) {
  const { href, icon: Icon, key, label } = item;
  const isActive = activeKey === key;

  return (
    <li className="flex h-[54px] min-w-0 flex-1 items-center">
      <Link
        aria-current={isActive ? "page" : undefined}
        className={`group relative isolate flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl text-[12px] leading-none whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 ${
          isActive ? "text-slate-950" : "text-slate-500 hover:text-slate-700"
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
        <span className={isActive ? "font-semibold" : "font-medium"}>{label}</span>
        {showNotificationDot ? (
          <span className="absolute top-0 right-2 h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
        ) : null}
      </Link>
    </li>
  );
}
