function DashboardSkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} />;
}

function DashboardHeroCardSkeleton() {
  return (
    <div className="flex h-[144px] w-full flex-col justify-center gap-4 rounded-[8px] border border-white/20 bg-black/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-white/25" />
        <div className="h-4 w-28 rounded-full bg-white/30" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-9 w-16 rounded-full bg-white/40" />
        <div className="h-3 w-32 rounded-full bg-white/25" />
      </div>
    </div>
  );
}

function DashboardBenefitsTableSkeleton() {
  return (
    <section className="box-border flex h-[351px] w-full flex-col items-start gap-5 rounded-[12px] border border-[#DBDEE1] bg-white py-[22px]">
      <div className="flex h-[47px] w-full items-center justify-between gap-2 px-6">
        <div className="flex h-[47px] w-[355px] flex-col items-start gap-2">
          <DashboardSkeletonBlock className="h-[21px] w-40" />
          <DashboardSkeletonBlock className="h-[18px] w-72" />
        </div>
        <DashboardSkeletonBlock className="h-9 w-[120px] rounded-[8px]" />
      </div>
      <div className="h-[240px] w-full overflow-hidden">
        <div className="h-full w-full overflow-hidden">
          <div className="grid h-[41px] grid-cols-[200px_167px_78px_351px_157px_94px_183px] items-center border-y border-[#DBDEE1]">
            {Array.from({ length: 7 }).map((_, index) => (
              <DashboardSkeletonBlock
                className={`h-4 ${
                  index === 0
                    ? "ml-6 w-24"
                    : index === 3
                      ? "w-28"
                      : index === 6
                        ? "mr-6 ml-auto w-16"
                        : "w-20"
                }`}
                key={`benefit-header-${index}`}
              />
            ))}
          </div>
          <div className="flex flex-col">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="grid h-[50px] grid-cols-[200px_167px_78px_351px_157px_94px_183px] items-center border-b border-[#DBDEE1] px-2"
                key={`benefit-row-${index}`}
              >
                <DashboardSkeletonBlock className="ml-4 h-4 w-32" />
                <DashboardSkeletonBlock className="h-4 w-20" />
                <DashboardSkeletonBlock className="h-4 w-12" />
                <div className="flex items-center gap-1">
                  <DashboardSkeletonBlock className="h-[22px] w-[64px] rounded-[4px]" />
                  <DashboardSkeletonBlock className="h-[22px] w-[96px] rounded-[4px]" />
                </div>
                <DashboardSkeletonBlock className="h-4 w-24" />
                <DashboardSkeletonBlock className="h-5 w-16 rounded-full" />
                <div className="mr-4 ml-auto flex items-center gap-2">
                  <DashboardSkeletonBlock className="h-8 w-[75px] rounded-[8px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardEligibilityOverviewSkeleton() {
  return (
    <section className="box-border flex h-[147px] w-full flex-col items-start gap-5 rounded-[12px] border border-[#DBDEE1] bg-white px-6 py-[21px]">
      <div className="flex h-[47px] w-full flex-col items-start gap-2">
        <DashboardSkeletonBlock className="h-[21px] w-52" />
        <DashboardSkeletonBlock className="h-[18px] w-40" />
      </div>
      <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:gap-[31px]">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="flex w-full flex-col gap-2" key={`eligibility-skeleton-${index}`}>
            <div className="flex items-center justify-between">
              <DashboardSkeletonBlock className="h-4 w-28" />
              <DashboardSkeletonBlock className="h-4 w-10" />
            </div>
            <DashboardSkeletonBlock className="h-[10px] w-full rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardPanelSkeleton() {
  return (
    <section className="box-border flex h-[490px] w-full flex-col rounded-[14px] border border-[#E5E5E5] bg-white py-6 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex w-full flex-col gap-2 px-6">
        <DashboardSkeletonBlock className="h-4 w-44" />
        <DashboardSkeletonBlock className="h-5 w-64" />
      </div>
      <div className="mt-6 flex w-full flex-col gap-4 px-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="flex items-start gap-3" key={`panel-row-${index}`}>
            <DashboardSkeletonBlock className="h-8 w-8 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <DashboardSkeletonBlock className="h-4 w-full" />
              <DashboardSkeletonBlock className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function DashboardHeroSkeleton() {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="relative flex h-[358px] w-full animate-pulse flex-col justify-between overflow-hidden rounded-[16px] border border-[#2EA8FF] bg-[linear-gradient(135deg,#70A9FF,#1E3A8A)] px-[30px] py-[50px]">
        <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-[5px] text-center">
          <div className="h-8 w-72 rounded-full bg-white/40" />
          <div className="h-4 w-56 rounded-full bg-white/30" />
        </div>
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <DashboardHeroCardSkeleton key={index} />
          ))}
        </div>
      </div>
      <DashboardBenefitsTableSkeleton />
      <DashboardEligibilityOverviewSkeleton />
      <div className="grid w-full grid-cols-1 gap-5 xl:grid-cols-2">
        <DashboardPanelSkeleton />
        <DashboardPanelSkeleton />
      </div>
    </div>
  );
}
