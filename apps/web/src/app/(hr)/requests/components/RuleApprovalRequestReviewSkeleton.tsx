function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} />;
}

function SectionSkeleton({ rows }: { rows: number }) {
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

export default function RuleApprovalRequestReviewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-[26px] w-16 rounded-[999px]" />
        <SkeletonBlock className="h-[26px] w-20 rounded-[999px]" />
      </div>
      <SectionSkeleton rows={4} />
      <SectionSkeleton rows={2} />
      <SectionSkeleton rows={2} />
      <SectionSkeleton rows={4} />
    </div>
  );
}
