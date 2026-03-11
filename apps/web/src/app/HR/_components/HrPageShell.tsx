import type { ReactNode } from "react";

import TopNaviBar, { type HrNavKey } from "../_features/TopNaviBar";

type HrPageShellProps = {
  activeKey: HrNavKey;
  children: ReactNode;
  hideHeader?: boolean;
  subtitle: string;
  title: string;
};

export default function HrPageShell({
  activeKey,
  children,
  hideHeader = false,
  subtitle,
  title,
}: HrPageShellProps) {
  return (
    <main className="min-h-screen bg-[#f5f4f4] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-325 flex-col items-center">
        <TopNaviBar activeKey={activeKey} />

        {!hideHeader && (
          <section className="mt-8 text-center sm:mt-10">
            <h1 className="text-[36px] font-semibold tracking-[-0.04em] text-slate-950 sm:text-[44px]">
              {title}
            </h1>
            <p className="mt-2 text-[16px] text-slate-500 sm:text-[17px]">
              {subtitle}
            </p>
          </section>
        )}

        <section className={`${hideHeader ? "mt-0" : "mt-8"} w-full`}>
          {children}
        </section>
      </div>
    </main>
  );
}
