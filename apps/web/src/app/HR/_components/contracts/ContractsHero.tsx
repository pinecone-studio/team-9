import type { ContractKpiCard } from "./contracts-types";

function KpiCard({ icon: Icon, label, value }: ContractKpiCard) {
  return (
    <article className="flex min-h-[94px] w-full flex-col justify-center rounded-[8px] border border-white/22 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(9,16,57,0.12))] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_20px_rgba(8,15,58,0.08)] backdrop-blur-[4px]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-[12px] leading-4 font-medium text-white/84">{label}</p>
          <p className="text-[22px] leading-8 font-semibold text-white sm:text-[24px] md:text-[26px]">
            {value}
          </p>
        </div>
        <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center text-white/95">
          <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
      </div>
    </article>
  );
}

function ContractsKpiCardSkeleton() {
  return (
    <article className="flex min-h-[94px] w-full animate-pulse flex-col justify-center rounded-[8px] border border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(9,16,57,0.18))] px-5 py-4 backdrop-blur-[4px]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="h-3 w-28 rounded-full bg-white/35" />
          <div className="h-8 w-16 rounded-full bg-white/45" />
        </div>
        <div className="h-[30px] w-[30px] rounded-full bg-white/30" />
      </div>
    </article>
  );
}

type ContractsHeroProps = {
  cards: ContractKpiCard[];
  loading: boolean;
};

export default function ContractsHero({ cards, loading }: ContractsHeroProps) {
  return (
    <section className="relative flex min-h-[292px] w-full flex-col justify-between overflow-hidden rounded-[16px] border border-[#2EA8FF] px-[22px] py-[26px] shadow-[0_0_0_1px_rgba(46,168,255,0.2)] sm:px-[30px] md:px-[30px] md:py-[32px]">
      <div className="absolute inset-[3px] rounded-[12px] border border-white/8" />
      <video autoPlay className="absolute inset-0 h-full w-full object-cover" loop muted playsInline preload="auto">
        <source src="/contracts-hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,20,66,0.18),rgba(6,14,48,0.28))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.14),transparent_22%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_18%)]" />

      <div className="relative flex flex-1 flex-col items-center justify-between gap-8">
        <div className="flex max-w-[560px] flex-col items-center gap-[6px] pt-1 text-center">
          <h2 className="text-[24px] leading-[31px] font-semibold text-white">Contracts</h2>
          <p className="max-w-[560px] text-[13px] leading-[18px] text-white/86 md:text-[14px]">
            Manage vendor agreements, track contract versions, and monitor employee acceptance.
          </p>
        </div>

        <div className="grid w-full items-end gap-3 self-stretch md:grid-cols-2 xl:grid-cols-4 xl:gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <ContractsKpiCardSkeleton key={`contracts-kpi-skeleton-${index}`} />
              ))
            : cards.map((card) => <KpiCard key={card.label} {...card} />)}
        </div>
      </div>
    </section>
  );
}
