import type { LucideIcon } from "lucide-react";

type HeroMetricCardProps = {
  className?: string;
  icon: LucideIcon;
  subtitle: string;
  title: string;
  value: number;
};

export default function HeroMetricCard({
  className,
  icon: Icon,
  subtitle,
  title,
  value,
}: HeroMetricCardProps) {
  return (
    <article
      className={`box-border flex h-full min-h-[144px] w-full flex-col justify-center gap-4 rounded-[14px] border border-white/20 bg-[rgba(255,255,255,0.08)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[12px] ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 text-white">
        <Icon className="h-5 w-5" />
        <p className="text-[14px] leading-5 font-medium text-white">{title}</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[40px] leading-[36px] font-bold text-white">{value}</p>
        <p className="text-[12px] leading-4 font-medium text-white/90">{subtitle}</p>
      </div>
    </article>
  );
}
