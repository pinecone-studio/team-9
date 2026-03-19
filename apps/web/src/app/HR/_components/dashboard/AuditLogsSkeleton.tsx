function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} />;
}

function AuditLogsHeroSkeleton() {
  return (
    <section className="relative mt-[55px] flex min-h-[340px] w-full animate-pulse flex-col justify-between overflow-hidden rounded-[16px] border border-[#2EA8FF] px-6 py-8">
      <video
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/contracts-hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(104,168,255,0.55)_0%,rgba(54,114,234,0.65)_42%,rgba(14,31,104,0.88)_100%)]" />

      <div className="relative mx-auto flex w-full max-w-[560px] flex-col items-center gap-2 text-center">
        <div className="h-8 w-56 rounded-full bg-white/45" />
        <div className="h-4 w-80 rounded-full bg-white/30" />
      </div>

      <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="flex min-h-[144px] flex-col justify-center gap-4 rounded-[14px] border border-white/20 bg-white/10 p-6 backdrop-blur-[12px]"
            key={`audit-hero-skeleton-${index}`}
          >
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-white/35" />
              <div className="h-4 w-28 rounded-full bg-white/35" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-9 w-20 rounded-full bg-white/45" />
              <div className="h-3 w-40 rounded-full bg-white/30" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AuditLogsFiltersSkeleton() {
  return (
    <section className="rounded-[14px] border border-[#E5E5E5] bg-white px-6 py-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex flex-wrap items-center gap-3">
        <SkeletonBlock className="h-5 w-20" />
        <SkeletonBlock className="h-11 w-[180px] rounded-[10px]" />
        <SkeletonBlock className="h-11 w-[180px] rounded-[10px]" />
        <SkeletonBlock className="h-11 w-[180px] rounded-[10px]" />
        <SkeletonBlock className="ml-auto h-5 w-20" />
      </div>
    </section>
  );
}

function AuditLogsTableSkeleton() {
  return (
    <section className="rounded-[14px] border border-[#E5E5E5] bg-white py-4 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="overflow-hidden">
        <div className="grid grid-cols-[1.15fr_1.45fr_1fr_1.55fr_1.2fr_1fr_0.8fr] gap-4 border-b border-[#E5E5E5] px-6 py-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <SkeletonBlock className="h-4 w-20" key={`audit-head-${index}`} />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div
            className="grid grid-cols-[1.15fr_1.45fr_1fr_1.55fr_1.2fr_1fr_0.8fr] gap-4 border-b border-[#F0F0F0] px-6 py-4 last:border-b-0"
            key={`audit-row-${rowIndex}`}
          >
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-4 w-36" />
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-4 w-40" />
            <div className="flex flex-col gap-2">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-3 w-16" />
            </div>
            <SkeletonBlock className="h-4 w-20" />
            <SkeletonBlock className="h-7 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AuditLogsSkeleton() {
  return (
    <div className="flex w-full flex-col gap-5">
      <AuditLogsHeroSkeleton />
      <AuditLogsFiltersSkeleton />
      <AuditLogsTableSkeleton />
    </div>
  );
}
