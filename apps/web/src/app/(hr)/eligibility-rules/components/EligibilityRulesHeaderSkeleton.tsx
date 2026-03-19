function DashboardCardSkeleton() {
  return (
    <div className="flex min-h-[160px] animate-pulse flex-col justify-center gap-4 rounded-[8px] bg-black/10 p-6 backdrop-blur-[2px]">
      <div className="flex items-center gap-[6px]">
        <div className="h-6 w-6 rounded bg-white/30" />
        <div className="h-5 w-28 rounded bg-white/30" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-9 w-20 rounded bg-white/30" />
        <div className="h-4 w-40 rounded bg-white/20" />
      </div>
    </div>
  );
}

export default function EligibilityRulesHeaderSkeleton() {
  return (
    <section className="mx-auto flex w-full max-w-[1300px] flex-col items-center gap-[46px] px-4 pt-[18px] sm:px-0">
      <div className="relative flex w-full flex-col items-center gap-8 overflow-hidden rounded-[16px] px-[30px] py-[50px] shadow-[0_24px_48px_rgba(25,43,107,0.22)]">
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
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(66,130,255,0.08),rgba(18,27,83,0.18))]" />
        <div className="absolute inset-0 rounded-[16px] border border-[#2EA8FF]" />
        <div className="relative flex w-full max-w-[560px] animate-pulse flex-col items-center gap-[5px]">
          <div className="h-[31px] w-52 rounded bg-white/30" />
          <div className="h-[18px] w-44 rounded bg-white/20" />
        </div>

        <div className="relative grid w-full gap-5 xl:grid-cols-3">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
      </div>

      <div className="flex w-full flex-col items-stretch gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-[30px]">
        <div className="flex h-auto w-full flex-wrap items-center justify-center gap-[6px] rounded-[10px] bg-[#F5F5F5] p-[3px] xl:h-9 xl:w-auto xl:flex-nowrap">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              className="flex h-[29px] min-w-[118px] animate-pulse items-center justify-center gap-[6px] rounded-[8px] px-2 py-1"
              key={index}
            >
              <div className="h-5 w-16 rounded bg-[#E5E7EB]" />
              <div className="h-[22px] w-7 rounded-[8px] bg-[#E5E7EB]" />
            </div>
          ))}
        </div>

        <div className="flex h-9 w-full animate-pulse items-center gap-2 rounded-[4px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.9)] px-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] xl:max-w-[589px]">
          <div className="h-4 w-4 rounded bg-[#E5E7EB]" />
          <div className="h-[18px] w-40 rounded bg-[#E5E7EB]" />
        </div>
      </div>
    </section>
  );
}
