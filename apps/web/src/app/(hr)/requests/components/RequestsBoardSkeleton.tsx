function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-white/20 ${className}`} />;
}

function HeroCardSkeleton() {
  return (
    <div className="rounded-[14px] border border-white/20 bg-white/10 p-5">
      <div className="flex flex-col gap-5">
        <SkeletonBlock className="h-5 w-36" />
        <div className="flex items-end justify-between gap-4">
          <SkeletonBlock className="h-12 w-20" />
          <SkeletonBlock className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="grid grid-cols-[1.1fr_1.1fr_1fr_0.8fr_0.7fr] gap-4 border-t border-[#EEF1F4] px-6 py-4">
      <div className="flex flex-col gap-2">
        <div className="h-5 w-28 animate-pulse rounded-md bg-slate-200/80" />
        <div className="h-4 w-20 animate-pulse rounded-md bg-slate-200/60" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-5 w-32 animate-pulse rounded-md bg-slate-200/80" />
        <div className="h-4 w-24 animate-pulse rounded-md bg-slate-200/60" />
      </div>
      <div className="h-5 w-36 animate-pulse rounded-md bg-slate-200/70" />
      <div className="h-5 w-24 animate-pulse rounded-md bg-slate-200/70" />
      <div className="ml-auto h-9 w-36 animate-pulse rounded-[8px] bg-slate-200/80" />
    </div>
  );
}

export default function RequestsBoardSkeleton() {
  return (
    <section className="mt-[55px] flex w-full flex-col gap-8 pb-10">
      <section className="relative overflow-hidden rounded-[24px] border border-[#2EA8FF] px-6 py-7 sm:px-8 sm:py-8">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#7FB5FF,#2D63EA_58%,#182456)]" />
        <div className="relative flex flex-col gap-8">
          <div className="mx-auto flex max-w-[420px] flex-col items-center gap-3">
            <SkeletonBlock className="h-8 w-40" />
            <SkeletonBlock className="h-5 w-72" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <HeroCardSkeleton key={`requests-hero-skeleton-${index}`} />
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-5">
        <div className="inline-flex w-fit items-center rounded-[18px] bg-[#F5F5F5] p-[6px]">
          <div className="h-[44px] w-44 animate-pulse rounded-[14px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]" />
          <div className="h-[44px] w-52 animate-pulse rounded-[14px] bg-transparent" />
          <div className="h-[44px] w-40 animate-pulse rounded-[14px] bg-transparent" />
        </div>

        <section className="h-[513px] overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <div className="grid grid-cols-[1.1fr_1.1fr_1fr_0.8fr_0.7fr] gap-4 border-b border-[#E5E7EB] px-6 py-5">
            <div className="h-5 w-24 animate-pulse rounded-md bg-slate-200/80" />
            <div className="h-5 w-20 animate-pulse rounded-md bg-slate-200/80" />
            <div className="h-5 w-28 animate-pulse rounded-md bg-slate-200/80" />
            <div className="h-5 w-20 animate-pulse rounded-md bg-slate-200/80" />
            <div className="ml-auto h-5 w-16 animate-pulse rounded-md bg-slate-200/80" />
          </div>
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </section>
      </div>
    </section>
  );
}
