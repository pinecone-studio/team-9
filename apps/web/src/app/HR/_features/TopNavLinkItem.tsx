import Link from "next/link";

import type { HrNavKey, NavigationItem } from "./top-nav.types";

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
    <li className="flex h-9 w-[126.86px] shrink-0 items-center">
      <Link
        aria-current={isActive ? "page" : undefined}
        className={`group relative isolate flex h-9 w-[126.86px] items-center justify-center gap-2 rounded-[8px] px-[14px] py-2 font-sans text-[14px] leading-5 font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10 ${
          isActive
            ? "bg-black text-white"
            : "text-[#737373] hover:bg-black/[0.03] hover:text-[#525252]"
        }`}
        href={href}
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          <Icon
            className={`shrink-0 transition-colors ${
              isActive
                ? "h-5 w-5 text-white"
                : "h-5 w-5 text-[#737373] group-hover:text-[#525252]"
            }`}
          />
        </span>
        <span className="text-center">{label}</span>
        {showNotificationDot ? (
          <span className="absolute top-0 right-[10px] h-2 w-2 rounded-full bg-[#FB2C36] shadow-[0_0_0_4px_rgba(251,44,54,0.1)]" />
        ) : null}
      </Link>
    </li>
  );
}
