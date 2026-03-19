"use client";

import { ChevronRight } from "lucide-react";

export type ChangeSummaryItem = {
  currentValue: string;
  label: string;
  previousValue: string;
};

export function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="flex w-full flex-col gap-3">
      <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">{title}</h3>
      {children}
    </section>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] px-[15.8px] py-[15.8px] ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] leading-4 text-[#737373]">{label}</span>
      <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{value}</span>
    </div>
  );
}

export function TimelineItem({
  colorClassName,
  label,
  timestamp,
}: {
  colorClassName: string;
  label: string;
  timestamp: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-2 w-2 shrink-0 rounded-full ${colorClassName}`} />
      <div className="flex flex-col">
        <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{label}</span>
        <span className="text-[12px] leading-4 text-[#737373]">{timestamp}</span>
      </div>
    </div>
  );
}

export function ChangeSummaryCard({
  currentValue,
  label,
  previousValue,
}: ChangeSummaryItem) {
  return (
    <Card className="px-[11.8px] py-[11.8px]">
      <div className="flex flex-col gap-2">
        <span className="text-[12px] leading-4 text-[#737373]">{label}</span>
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-[4px] border border-[#FFC9C9] bg-[#FEF2F2] px-[7.8px] py-[7.8px] text-[14px] leading-5 text-[#C10007] line-through">
            {previousValue}
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-[#737373]" />
          <div className="flex-1 rounded-[4px] border border-[#B9F8CF] bg-[#F0FDF4] px-[7.8px] py-[7.8px] text-[14px] leading-5 text-[#008236]">
            {currentValue}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function DecisionTextCard({
  isPositive,
  text,
}: {
  isPositive: boolean;
  text: string;
}) {
  return (
    <div
      className={`w-full rounded-[10px] border px-[15.8px] py-[15.8px] ${
        isPositive
          ? "border-[#E5E5E5] bg-[rgba(245,245,245,0.3)]"
          : "border-[#FFC9C9] bg-[#FEF2F2]"
      }`}
    >
      <p className={`text-[14px] leading-5 ${isPositive ? "text-[#0A0A0A]" : "text-[#C10007]"}`}>
        {text}
      </p>
    </div>
  );
}
