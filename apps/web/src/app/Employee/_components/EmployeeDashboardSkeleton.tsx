import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
});

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-[10px] bg-[#E5E7EB] ${className}`.trim()} />;
}

function SummaryCardSkeleton() {
  return (
    <article className="rounded-[14px] border border-[#E5E5E5] bg-white p-4">
      <SkeletonBlock className="h-4 w-28" />
      <div className="mt-4 flex items-center justify-between">
        <SkeletonBlock className="h-8 w-20" />
        <SkeletonBlock className="h-6 w-6 rounded-full" />
      </div>
    </article>
  );
}

function SectionCardSkeleton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`rounded-[14px] border border-[#E5E5E5] bg-white p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] ${className}`.trim()}
    >
      {children}
    </article>
  );
}

export default function EmployeeDashboardSkeleton() {
  return (
    <main className={`${geist.className} min-h-screen bg-[#f5f4f4] px-4 py-8 sm:px-6 lg:px-8`}>
      <div className="mx-auto flex w-full max-w-[1300px] flex-col">
        <section className="mt-8 flex items-start justify-between gap-6 sm:mt-10">
          <header className="min-w-0 flex-1 pt-1 text-center sm:pl-[76px]">
            <div className="flex flex-col items-center">
              <SkeletonBlock className="h-8 w-64 max-w-full" />
              <SkeletonBlock className="mt-[9px] h-4 w-80 max-w-full" />
            </div>
          </header>

          <div className="shrink-0">
            <SkeletonBlock className="h-11 w-36 rounded-[12px]" />
          </div>
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <SummaryCardSkeleton key={`employee-summary-skeleton-${index}`} />
          ))}
        </section>

        <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
          <SectionCardSkeleton>
            <SkeletonBlock className="h-6 w-40" />
            <SkeletonBlock className="mt-2 h-4 w-52" />
            <div className="mt-5 overflow-hidden rounded-[12px] border border-[#F3F4F6]">
              <div className="grid min-w-[640px] grid-cols-[1.4fr_0.6fr_0.6fr_0.8fr] gap-3 border-b border-[#E5E5E5] px-4 py-3">
                <SkeletonBlock className="h-4 w-14" />
                <SkeletonBlock className="h-4 w-16" />
                <SkeletonBlock className="h-4 w-12" />
                <SkeletonBlock className="h-4 w-20" />
              </div>
              <div className="min-w-[640px] px-4 py-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    className="grid grid-cols-[1.4fr_0.6fr_0.6fr_0.8fr] items-center gap-3 border-b border-[#F3F4F6] py-3.5 last:border-b-0"
                    key={`employee-request-row-skeleton-${index}`}
                  >
                    <SkeletonBlock className="h-4 w-36" />
                    <SkeletonBlock className="h-4 w-20" />
                    <SkeletonBlock className="h-6 w-20 rounded-[6px]" />
                    <SkeletonBlock className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </SectionCardSkeleton>

          <SectionCardSkeleton>
            <SkeletonBlock className="h-6 w-44" />
            <SkeletonBlock className="mt-2 h-4 w-52" />
            <div className="mt-5">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  className="flex items-center justify-between border-b border-[#F3F4F6] py-3 last:border-b-0"
                  key={`employee-signal-skeleton-${index}`}
                >
                  <div className="flex items-center gap-2">
                    <SkeletonBlock className="h-5 w-5 rounded-[6px]" />
                    <SkeletonBlock className="h-4 w-32" />
                  </div>
                  <SkeletonBlock className="h-5 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </SectionCardSkeleton>
        </section>

        <section className="mt-7 flex flex-col gap-[28px] pb-16">
          {Array.from({ length: 2 }, (_group, groupIndex) => (
            <div className="flex flex-col gap-5" key={`employee-benefit-group-skeleton-${groupIndex}`}>
              <div className="flex items-center justify-between">
                <SkeletonBlock className="h-7 w-56" />
                <SkeletonBlock className="h-5 w-16 rounded-full" />
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }, (_card, cardIndex) => (
                  <SectionCardSkeleton
                    className="p-4 shadow-none"
                    key={`employee-benefit-card-skeleton-${groupIndex}-${cardIndex}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <SkeletonBlock className="h-5 w-40" />
                        <SkeletonBlock className="mt-3 h-4 w-full" />
                        <SkeletonBlock className="mt-2 h-4 w-3/4" />
                      </div>
                      <SkeletonBlock className="h-10 w-10 rounded-[12px]" />
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <SkeletonBlock className="h-6 w-24 rounded-full" />
                      <SkeletonBlock className="h-8 w-24 rounded-[10px]" />
                    </div>
                  </SectionCardSkeleton>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
