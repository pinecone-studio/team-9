function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} />;
}

function DetailCardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <section className="flex flex-col gap-3">
      <SkeletonBlock className="h-5 w-40" />
      <div className="rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] p-4">
        <div className="flex flex-col gap-4">
          {Array.from({ length: rows }).map((_, index) => (
            <div className="flex flex-col gap-2" key={index}>
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-5 w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ApprovalRequestReviewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-[26px] w-16 rounded-[4px]" />
        <SkeletonBlock className="h-[26px] w-24 rounded-[4px]" />
      </div>

      <DetailCardSkeleton rows={5} />
      <DetailCardSkeleton rows={2} />
      <DetailCardSkeleton rows={2} />
      <DetailCardSkeleton rows={4} />

      <div className="h-px w-full bg-[#E5E5E5]" />

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-4 w-4 rounded-full" />
          <SkeletonBlock className="h-5 w-20" />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="flex gap-3" key={index}>
              <div className="flex w-[6px] flex-col items-center">
                <SkeletonBlock className="mt-2 h-[6px] w-[6px] rounded-full" />
                {index < 2 ? <div className="h-10 w-px bg-[#E5E5E5]" /> : null}
              </div>
              <div className="flex-1 pb-3">
                <SkeletonBlock className="h-5 w-40" />
                <SkeletonBlock className="mt-2 h-4 w-56" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
