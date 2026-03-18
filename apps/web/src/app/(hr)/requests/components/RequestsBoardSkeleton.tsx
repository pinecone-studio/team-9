function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} />;
}

function MetricCardSkeleton() {
  return (
    <div className="rounded-[14px] border border-[#E5E5E5] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-3">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-8 w-12" />
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="grid grid-cols-[120px_1.2fr_1.4fr_140px_120px_140px_130px_90px] items-center gap-4 border-t border-[#EDEDED] px-6 py-4">
      <SkeletonBlock className="h-6 w-16 rounded-[8px]" />
      <SkeletonBlock className="h-5 w-40" />
      <SkeletonBlock className="h-5 w-full" />
      <SkeletonBlock className="h-5 w-24" />
      <SkeletonBlock className="h-5 w-20" />
      <SkeletonBlock className="h-5 w-24" />
      <SkeletonBlock className="h-6 w-24 rounded-[6px]" />
      <SkeletonBlock className="h-8 w-16 rounded-[8px]" />
    </div>
  );
}

export default function RequestsBoardSkeleton() {
  return (
    <section className="flex w-full flex-col gap-6 pt-8">
      <div className="flex flex-col gap-3">
        <SkeletonBlock className="h-8 w-36" />
        <SkeletonBlock className="h-5 w-80" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>

      <div className="flex flex-col gap-4 pb-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-9 w-28 rounded-[10px]" />
            <SkeletonBlock className="h-9 w-36 rounded-[10px]" />
          </div>
          <SkeletonBlock className="h-9 w-28 rounded-[10px]" />
        </div>

        <section className="rounded-[14px] border border-[#E5E5E5] bg-white py-6 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-[120px_1.2fr_1.4fr_140px_120px_140px_130px_90px] gap-4 px-6 pb-3">
            <SkeletonBlock className="h-5 w-14" />
            <SkeletonBlock className="h-5 w-16" />
            <SkeletonBlock className="h-5 w-20" />
            <SkeletonBlock className="h-5 w-20" />
            <SkeletonBlock className="h-5 w-20" />
            <SkeletonBlock className="h-5 w-20" />
            <SkeletonBlock className="h-5 w-16" />
            <SkeletonBlock className="h-5 w-14" />
          </div>
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </section>
      </div>
    </section>
  );
}
