import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import TopNaviBar, { type HrNavKey } from "../_features/TopNaviBar";

type HrPageShellProps = {
  activeKey: HrNavKey;
  children: ReactNode;
  fullWidthHeader?: boolean;
  hideHeader?: boolean;
  lockViewport?: boolean;
  subtitle: string;
  title: string;
};

const geist = Geist({
  subsets: ["latin"],
});

export default function HrPageShell({
  activeKey,
  children,
  fullWidthHeader = false,
  hideHeader = false,
  lockViewport = false,
  subtitle,
  title,
}: HrPageShellProps) {
  return (
    <main
      className={`${geist.className} bg-[#f5f4f4] px-[35px] py-8 ${
        lockViewport ? "h-dvh overflow-hidden" : "min-h-screen"
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-[1300px] flex-col items-center ${
          lockViewport ? "h-full min-h-0" : ""
        }`}
      >
        <TopNaviBar activeKey={activeKey} />

        {!hideHeader && (
          <section
            className={`mt-14 flex h-[54px] w-full shrink-0 flex-col items-center gap-[5px] px-0 text-center ${
              fullWidthHeader ? "max-w-[1300px]" : "max-w-[560px]"
            }`}
          >
            <h1 className="flex h-[31px] w-full items-center justify-center text-[24px] leading-[31px] font-semibold text-black">
              {title}
            </h1>
            <p className="flex h-[18px] w-full items-center justify-center text-[14px] leading-[18px] font-normal text-[#555555]">
              {subtitle}
            </p>
          </section>
        )}

        <section
          className={`${hideHeader ? "mt-0" : "mt-[31px]"} w-full ${
            lockViewport ? "min-h-0 flex-1 overflow-hidden" : ""
          }`}
        >
          {children}
        </section>
      </div>
    </main>
  );
}
