import type { LucideIcon } from "lucide-react";
import { Clock3, FileCheck2, HandHeart, Users } from "lucide-react";

import HeroMetricCard from "./HeroMetricCard";

type DashboardKpiCardsProps = {
  activeContracts: number;
  greeting: string;
  pendingRequests: number;
  subtitle: string;
  totalBenefits: number;
  totalEmployees: number;
};

type StatCard = {
  icon: LucideIcon;
  subtitle: string;
  title: string;
  value: number;
};

export default function DashboardKpiCards({
  activeContracts,
  greeting,
  pendingRequests,
  subtitle,
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
      subtitle: "benefits available to employees",
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
    <section className="relative flex h-[358px] w-full flex-col justify-between overflow-hidden rounded-[16px] px-[30px] py-[50px]">
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

      <div className="relative mx-auto flex w-full max-w-[560px] flex-col items-center gap-[5px] text-center">
        <h2 className="w-full text-[24px] leading-[31px] font-semibold text-white">{greeting}</h2>
        <p className="w-full text-[14px] leading-[18px] text-white">{subtitle}</p>
      </div>

      <div className="relative grid w-full grid-cols-1 gap-5 self-stretch md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <HeroMetricCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
