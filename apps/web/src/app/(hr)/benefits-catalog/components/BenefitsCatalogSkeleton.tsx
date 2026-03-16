function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} />;
}

function BenefitCardSkeleton() {
  return (
    <article className="flex h-[184px] w-full flex-col justify-between rounded-[8px] border border-[#DBDEE1] bg-white p-4 xl:max-w-[420px]">
      <div className="flex flex-col gap-3">
        <div className="flex h-[26px] items-center justify-between">
          <SkeletonBlock className="h-5 w-36" />
          <SkeletonBlock className="h-[26px] w-[71px] rounded-[4px]" />
        </div>
        <SkeletonBlock className="h-[18px] w-full max-w-[360px]" />
        <SkeletonBlock className="h-[18px] w-[240px]" />
      </div>
      <div className="flex h-[30px] items-end border-t border-[#EDEFF0] pt-[14px]">
        <div className="flex items-center gap-5">
          <SkeletonBlock className="h-4 w-20" />
          <SkeletonBlock className="h-4 w-24" />
        </div>
      </div>
    </article>
  );
}

function BenefitCategorySkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-6 items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-6 w-6 rounded-full" />
            <SkeletonBlock className="h-5 w-28" />
          </div>
          <SkeletonBlock className="h-6 w-[61px] rounded-[6px]" />
        </div>
        <SkeletonBlock className="h-6 w-6 rounded-full" />
      </div>
      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <BenefitCardSkeleton />
        <BenefitCardSkeleton />
        <BenefitCardSkeleton />
      </div>
    </div>
  );
}

export default function BenefitsCatalogSkeleton() {
  return (
    <section className="mx-auto mt-[30px] flex w-full max-w-[1300px] flex-col gap-[34px] px-4 sm:px-0">
      <BenefitCategorySkeleton />
      <div className="h-px w-full bg-[#DBDEE1]" />
      <BenefitCategorySkeleton />
      <div className="h-px w-full bg-[#DBDEE1]" />
      <div className="flex flex-col gap-6">
        <SkeletonBlock className="h-5 w-44" />
        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          <div className="flex h-[184px] w-full items-center justify-center rounded-[8px] border-2 border-dashed border-[rgba(219,222,225,0.6)] bg-white xl:max-w-[420px]">
            <SkeletonBlock className="h-6 w-36" />
          </div>
        </div>
      </div>
    </section>
  );
}
