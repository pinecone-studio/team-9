import { Search } from "lucide-react";

type BenefitsCatalogHeaderProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export default function BenefitsCatalogHeader({
  searchQuery,
  onSearchChange,
}: BenefitsCatalogHeaderProps) {
  return (
    <section className="mx-auto mt-[46px] flex w-full max-w-[534px] flex-col items-center gap-[31px] px-4 sm:px-0">
      <div className="flex h-[54px] w-full flex-col items-center gap-[5px] self-stretch p-0">
        <h1 className="flex h-[31px] w-full items-center justify-center text-center text-[24px] leading-[31px] font-semibold text-black">
          Benefits Catalog
        </h1>
        <p className="flex h-[18px] w-full items-center justify-center text-center text-[14px] leading-[18px] font-normal text-[#555555]">
          Manage company benefits and their configurations
        </p>
      </div>

      <div className="flex w-full items-center p-0">
        <div className="flex h-8 w-full items-center gap-2 rounded-[4px] border border-[#E2E5E8] bg-[rgba(255,255,255,0.002)] px-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Search className="h-4 w-4 shrink-0 text-[#51565B]" />
          <input
            aria-label="Search benefits"
            className="h-[18px] w-full border-none bg-transparent text-[14px] leading-[18px] font-normal text-[#51565B] outline-none placeholder:text-[#51565B]"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search benefits..."
            type="text"
            value={searchQuery}
          />
        </div>
      </div>
    </section>
  );
}
