"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";

import TopNavLinkItem from "./TopNavLinkItem";
import { EmsLogo } from "./top-nav.icons";
import { navigationItems } from "./top-nav.items";
import type { HrNavKey } from "./top-nav.types";

type TopNaviBarProps = {
  activeKey: HrNavKey;
};

export default function TopNaviBar({ activeKey }: TopNaviBarProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="mx-auto flex h-[68px] w-[1120px] items-center justify-center gap-4 rounded-[16px] border border-[rgba(229,229,229,0.6)] bg-[rgba(255,255,255,0.95)] px-5 py-3 shadow-[0px_67px_27px_rgba(0,0,0,0.01),0px_37px_22px_rgba(0,0,0,0.04),0px_17px_17px_rgba(0,0,0,0.06),0px_4px_9px_rgba(0,0,0,0.07)] backdrop-blur-[4px]">
        <div className="flex h-[38px] w-[86px] shrink-0 items-center justify-center">
          <EmsLogo className="h-[38px] w-[86px]" />
        </div>

        <nav
          aria-label="HR sections"
          className="flex h-9 w-[900px] shrink-0 items-center justify-center"
        >
          <ul className="flex h-9 w-[900px] items-center gap-[2px]">
            {navigationItems.map((item) => (
              <TopNavLinkItem
                activeKey={activeKey}
                item={item}
                key={item.key}
                showNotificationDot={Boolean(item.hasNotification)}
              />
            ))}
          </ul>
        </nav>

        <div className="top-nav-user-button flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(229,229,229,0.9)] bg-white px-1 text-center text-[9px] leading-[10px] font-medium text-[#737373] transition-colors hover:bg-[#f7f7f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
                type="button"
              >
                Sign in
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <div className="overflow-hidden rounded-full">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "!h-11 !w-11",
                    userButtonAvatarBox: "!h-11 !w-11",
                    userButtonTrigger: "!h-11 !w-11 !rounded-full !border-0 !shadow-none",
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
