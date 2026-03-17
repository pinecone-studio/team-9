import type { LucideIcon } from "lucide-react";
import { Clock3, FileCheck2, HandHeart, Users } from "lucide-react";

type DashboardKpiCardsProps = {
  activeContracts: number;
  pendingRequests: number;
  totalBenefits: number;
  totalEmployees: number;
};

type StatCard = {
  icon: LucideIcon;
  subtitle: string;
  title: string;
  value: number;
};

function KpiCard({ icon: Icon, subtitle, title, value }: StatCard) {
  return (
    <article className="box-border flex h-[146px] w-full flex-col justify-center gap-4 rounded-[8px] border border-[#DBDEE1] bg-white p-6">
      <div className="flex h-6 w-full items-center gap-1.5 text-[#737373]">
        <Icon className="h-6 w-6" />
        <p className="text-[14px] leading-5 font-medium">{title}</p>
      </div>
      <div className="flex w-full flex-col items-start gap-1">
        <p className="text-[40px] leading-[36px] font-bold text-[#0A0A0A]">
          {value}
        </p>
        <p className="text-[12px] leading-4 text-[#737373]">{subtitle}</p>
      </div>
    </article>
  );
}

export default function DashboardKpiCards({
  activeContracts,
  pendingRequests,
  totalBenefits,
  totalEmployees,
}: DashboardKpiCardsProps) {
  const cards: StatCard[] = [
    {
      icon: Users,
      subtitle: "employees in system",
      title: "Total Employees",
      value: totalEmployees,
    },
    {
      icon: HandHeart,
      subtitle: "benefits configured",
      title: "Total Benefits",
      value: totalBenefits,
    },
    {
      icon: FileCheck2,
      subtitle: "in the system",
      title: "Active Contracts",
      value: activeContracts,
    },
    {
      icon: Clock3,
      subtitle: "awaiting review",
      title: "Pending Requests",
      value: pendingRequests,
    },
  ];

  return (
    <section className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <KpiCard key={card.title} {...card} />
      ))}
    </section>
  );
}
