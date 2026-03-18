import type { ContractKpiCard } from "./contracts-content.helpers";

export default function ContractsKpiCard({
  icon: Icon,
  iconClassName,
  label,
  value,
}: ContractKpiCard) {
  return (
    <article className="box-border flex h-[74px] flex-1 items-start rounded-[14px] border border-[#E5E5E5] bg-white py-3 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex h-12 w-full items-center justify-between px-4">
        <div className="flex h-12 flex-col items-start">
          <p className="h-4 text-[12px] leading-4 font-medium text-[#737373]">{label}</p>
          <p className="h-8 text-[24px] leading-8 font-semibold text-[#0A0A0A]">{value}</p>
        </div>
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </div>
    </article>
  );
}
