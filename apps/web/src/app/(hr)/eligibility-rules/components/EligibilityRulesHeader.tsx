import { Search, SlidersHorizontal } from "lucide-react";

export default function EligibilityRulesHeader() {
  return (
    <section className="mx-auto mt-[49px] flex w-full max-w-[534px] flex-col items-center gap-[31px] px-4 sm:px-0">
      <div className="flex h-[54px] w-[288px] max-w-full flex-col items-center gap-[5px] p-0">
        <h1 className="flex h-[31px] w-[288px] max-w-full items-center justify-center text-center text-[24px] leading-[31px] font-semibold text-black">
          Eligibility Rules
        </h1>
        <p className="flex h-[18px] w-[288px] max-w-full items-center justify-center text-center text-[14px] leading-[18px] font-normal text-[#555555]">
          Configure benefit eligibility rules
        </p>
      </div>

      <div className="flex w-full flex-col items-stretch gap-3 p-0 sm:h-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex h-8 w-full flex-1 items-center gap-2 rounded-[4px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:max-w-[448px]">
          <Search className="h-4 w-4 shrink-0 text-[#51565B]" />
          <input
            aria-label="Search rules"
            className="h-[18px] w-full border-none bg-transparent text-[14px] leading-[18px] font-normal text-[#51565B] outline-none placeholder:text-[#51565B]"
            placeholder="Search rules..."
            type="text"
          />
        </div>

        <button
          className="flex h-8 w-full shrink-0 items-center justify-center gap-[6px] rounded-[6px] border border-[#DBDEE1] bg-[#F9FAFB] px-[10px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:w-[79px]"
          type="button"
        >
          <SlidersHorizontal className="h-4 w-4 text-black" />
          <span className="flex h-5 w-[35px] items-center justify-center text-center text-[14px] leading-5 font-medium text-[#060B10]">
            Filter
          </span>
        </button>
      </div>
    </section>
  );
}
