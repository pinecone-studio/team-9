import { Clock3 } from "lucide-react";

export type BenefitRequestStatusBadge = {
  bgClassName: string;
  iconClassName: string;
  label: string;
  textClassName: string;
};

export function BenefitRequestStatusPill({
  statusBadge,
}: {
  statusBadge: BenefitRequestStatusBadge;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-[6px] rounded-[999px] px-3 py-1 text-[13px] leading-5 font-medium ${statusBadge.bgClassName} ${statusBadge.textClassName}`}
    >
      <Clock3 className={`h-3 w-3 ${statusBadge.iconClassName}`} />
      {statusBadge.label}
    </span>
  );
}

export function SnapshotItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="min-w-0">
        <div className="text-[12px] leading-4 text-[#737373]">{label}</div>
        <div className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{value}</div>
      </div>
    </div>
  );
}
