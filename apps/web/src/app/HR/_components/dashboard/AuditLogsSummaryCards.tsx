import { CircleCheckBig, CircleX, ListFilter, Upload } from "lucide-react";

import type { AuditLogSummary } from "./audit-log-types";
import HeroMetricCard from "./HeroMetricCard";

type AuditLogsSummaryCardsProps = {
  summary: AuditLogSummary;
};

export default function AuditLogsSummaryCards({
  summary,
}: AuditLogsSummaryCardsProps) {
  const cards = [
    {
      icon: ListFilter,
      subtitle: "All user actions recorded",
      title: "Total Actions",
      value: summary.totalActions,
    },
    {
      icon: Upload,
      subtitle: "New requests and changes submitted",
      title: "Submitted",
      value: summary.submitted,
    },
    {
      icon: CircleCheckBig,
      subtitle: "Actions approved by reviewers",
      title: "Approved",
      value: summary.approved,
    },
    {
      icon: CircleX,
      subtitle: "Actions rejected by reviewers",
      title: "Rejected",
      value: summary.rejected,
    },
  ];

  return (
    <section className="relative mt-[55px] overflow-hidden rounded-[16px] border border-[#2EA8FF] px-6 py-8 shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
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
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(104,168,255,0.42)_0%,rgba(54,114,234,0.54)_42%,rgba(14,31,104,0.84)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(210,237,255,0.5),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(147,197,253,0.18),transparent_22%),linear-gradient(135deg,rgba(255,255,255,0.18),transparent_36%,rgba(255,255,255,0.08)_62%,transparent_100%)]" />

      <div className="relative flex flex-col gap-8">
        <div className="mx-auto flex max-w-[560px] flex-col items-center gap-2 text-center text-white">
          <h2 className="text-[24px] leading-[31px] font-semibold">Audit Logs</h2>
          <p className="text-[14px] leading-5 text-white/90">
            Track system activity, approvals, overrides, and eligibility decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <HeroMetricCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
