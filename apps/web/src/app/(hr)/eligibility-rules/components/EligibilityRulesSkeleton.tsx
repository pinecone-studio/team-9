import { sectionMeta } from "../rule-sections";

function RuleCardSkeleton() {
  return (
    <div className="flex h-[250px] w-full animate-pulse flex-col justify-between overflow-hidden rounded-[8px] bg-white xl:max-w-[420px]">
      <div className="flex flex-col gap-4 px-5 pt-5">
        <div className="space-y-2">
          <div className="h-[18px] w-2/5 rounded bg-[#E8EDF2]" />
          <div className="h-4 w-4/5 rounded bg-[#EEF2F6]" />
        </div>
        <div className="h-[72px] w-full rounded-[6px] border border-[#E5E7EB] bg-[#F7F9FB]" />
        <div className="h-[27px] w-[123px] rounded-[6px] bg-[#EFF2F5]" />
      </div>
      <div className="flex h-[41px] items-center justify-between border-t border-[rgba(222,226,228,0.5)] bg-[rgba(239,242,245,0.2)] px-5">
        <div className="h-4 w-14 rounded bg-[#EEF2F6]" />
        <div className="h-4 w-24 rounded bg-[#EEF2F6]" />
      </div>
    </div>
  );
}

export default function EligibilityRulesSkeleton() {
  return (
    <section className="mx-auto mt-[34px] flex w-full max-w-[1300px] flex-col items-start gap-[34px] px-4 pb-20 sm:px-0">
      {sectionMeta.map((section, index) => (
        <div key={section.title} className="flex w-full flex-col items-start gap-6">
          {index > 0 ? <div className="h-px w-full bg-[rgba(219,222,225,0.87)]" /> : null}
          <div className="flex w-full flex-col gap-2">
            <div className="flex h-6 w-full items-center gap-[10px]">
              <div className="flex h-6 items-center gap-2 p-0">
                <section.icon className="h-6 w-6 text-[#CBD5E1]" />
                <div className="h-5 w-32 animate-pulse rounded bg-[#E8EDF2]" />
              </div>
              <div className="h-6 w-8 animate-pulse rounded-[6px] border border-[#DBDEE1] bg-[#F8FAFC]" />
            </div>
            <div className="h-5 w-[min(760px,85%)] animate-pulse rounded bg-[#EEF2F6]" />
          </div>
          <div className="flex w-full flex-wrap items-center gap-5">
            <div className="w-full lg:w-[calc(50%-10px)] xl:w-[420px]">
              <RuleCardSkeleton />
            </div>
            <div className="w-full lg:w-[calc(50%-10px)] xl:w-[420px]">
              <RuleCardSkeleton />
            </div>
            <div className="w-full lg:w-[calc(50%-10px)] xl:w-[420px]">
              <div className="flex h-[250px] w-full animate-pulse flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-[rgba(219,222,225,0.6)] bg-white xl:max-w-[420px]">
                <div className="h-10 w-28 rounded bg-[#EEF2F6]" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
