import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import TopNaviBar, { type HrNavKey } from "../_features/TopNaviBar";

type HrPageShellProps = {
  activeKey: HrNavKey;
  children: ReactNode;
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
  hideHeader = false,
  lockViewport = false,
  subtitle,
  title,
}: HrPageShellProps) {
  return (
    <main
      className={`${geist.className} bg-[#f5f4f4] px-4 py-8 sm:px-6 lg:px-8 ${
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
          <section className="mt-8 flex shrink-0 flex-col items-center gap-[5px] text-center sm:mt-10">
            <h1 className="text-[24px] font-semibold leading-[100%] tracking-[0] text-black">
              {title}
            </h1>
            <p className="text-[14px] font-normal leading-[100%] tracking-[0] text-[#555555]">
              {subtitle}
            </p>
          </section>
        )}

        <section
          className={`${hideHeader ? "mt-0" : "mt-8"} w-full ${
            lockViewport ? "min-h-0 flex-1 overflow-hidden" : ""
          }`}
        >
          {children}
        </section>
      </div>
    </main>
  );
}
