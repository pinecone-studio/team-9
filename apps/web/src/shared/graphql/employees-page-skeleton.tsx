"use client";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} />;
}

export default function EmployeesPageSkeleton() {
  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[16px] bg-[linear-gradient(180deg,#5E7BFF,#3141AE)] px-[30px] py-[50px]">
        <div className="flex flex-col gap-10">
          <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-[5px]">
            <SkeletonBlock className="h-[31px] w-36 bg-white/35" />
            <SkeletonBlock className="h-[18px] w-[280px] bg-white/25" />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="rounded-[8px] border border-white/12 bg-[rgba(0,0,0,0.1)] p-6 backdrop-blur-[4px]"
                key={index}
              >
                <SkeletonBlock className="h-6 w-32 bg-white/25" />
                <SkeletonBlock className="mt-4 h-9 w-16 bg-white/35" />
                <SkeletonBlock className="mt-2 h-4 w-36 bg-white/20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col gap-4 px-6 pt-6 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <SkeletonBlock className="h-5 w-40" />
            <SkeletonBlock className="mt-2 h-4 w-72" />
          </div>
          <SkeletonBlock className="h-9 w-full md:w-[256px]" />
        </div>

        <div className="border-t border-[#E5E5E5] px-6 py-4">
          <div className="grid grid-cols-6 gap-6 pb-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBlock className="h-4 w-20" key={`header-${index}`} />
            ))}
          </div>
          <div className="space-y-4 pt-2">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div className="grid grid-cols-6 gap-6" key={`row-${rowIndex}`}>
                <SkeletonBlock className="h-5 w-24" />
                <SkeletonBlock className="h-5 w-20" />
                <SkeletonBlock className="h-5 w-20" />
                <SkeletonBlock className="h-5 w-16" />
                <SkeletonBlock className="h-5 w-20" />
                <SkeletonBlock className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
