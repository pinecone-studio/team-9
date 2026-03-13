import type { ComponentType } from "react";

type FlagTone = "critical" | "warning";

export type EmployeeFlag = {
  label: string;
  tone: FlagTone;
};

type OverviewCardProps = {
  caption: string;
  icon: ComponentType<{ className?: string }>;
  subtitle: string;
  title: string;
};

const flaggedEmployeesByName: Record<string, EmployeeFlag[]> = {
  "Bataa M.": [{ label: "OKR missing", tone: "warning" }],
  "Oyunaa T.": [{ label: "Attendance exceeded", tone: "critical" }],
};

export function normalizeStatus(status: string) {
  return status.trim().toLowerCase();
}

export function getStatusBadgeTone(status: string) {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "active") {
    return "bg-[#DCFCE7] text-[#016630]";
  }

  if (normalizedStatus === "probation") {
    return "bg-[#FEF3C6] text-[#973C00]";
  }

  if (normalizedStatus === "leave") {
    return "bg-[#DBEAFE] text-[#193CB8]";
  }

  return "bg-[#F4F4F5] text-[#52525B]";
}

export function getFlags(name: string, status: string): EmployeeFlag[] {
  const seededFlags = flaggedEmployeesByName[name] ?? [];
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus !== "probation") {
    return seededFlags;
  }

  const hasProbationFlag = seededFlags.some(
    (flag) => flag.label.toLowerCase() === "on probation",
  );

  if (hasProbationFlag) {
    return seededFlags;
  }

  return [...seededFlags, { label: "On probation", tone: "warning" }];
}

export function getFlagTone(flagTone: FlagTone) {
  if (flagTone === "critical") {
    return "border-[#FFA2A2] bg-[#FEF2F2] text-[#C10007]";
  }

  return "border-[#FFD230] bg-[#FFFBEB] text-[#BB4D00]";
}

export function OverviewCard({
  caption,
  icon: Icon,
  subtitle,
  title,
}: OverviewCardProps) {
  return (
    <article className="flex min-h-[146px] flex-col justify-center rounded-[8px] border border-[#DBDEE1] bg-white px-6 py-5">
      <div className="flex items-center gap-2 text-[#737373]">
        <Icon className="h-5 w-5" />
        <p className="text-[14px] leading-5 font-medium">{title}</p>
      </div>
      <p className="mt-4 text-[48px] leading-[0.9] font-bold text-[#0A0A0A]">
        {caption}
      </p>
      <p className="mt-2 text-[12px] leading-4 text-[#737373]">{subtitle}</p>
    </article>
  );
}
