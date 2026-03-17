import { Search } from "lucide-react";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} />;
}

type ContractsSearchProps = {
  loading: boolean;
  onChange: (value: string) => void;
  value: string;
};

export default function ContractsSearch({ loading, onChange, value }: ContractsSearchProps) {
  if (loading) {
    return (
      <div className="flex h-9 w-full items-center">
        <SkeletonBlock className="h-9 w-full max-w-96 rounded-[8px]" />
      </div>
    );
  }

  return (
    <div className="flex h-9 w-full items-center">
      <label className="relative block h-9 w-full max-w-96">
        <input
          className="h-9 w-full rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] py-2 pr-3 pl-9 text-[14px] leading-[18px] text-[#737373] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by benefit or vendor..."
          type="text"
          value={value}
        />
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#737373]" />
      </label>
    </div>
  );
}
