import { AlertTriangle, CheckCircle2, Clock3, CircleSlash } from "lucide-react";

import type { RequestDialogBadgeTone } from "./employee-request-dialog.helpers";

type EmployeeBenefitDialogStatusBadgeProps = {
  label: string;
  tone: RequestDialogBadgeTone;
};

export default function EmployeeBenefitDialogStatusBadge({
  label,
  tone,
}: EmployeeBenefitDialogStatusBadgeProps) {
  const className = getToneClassName(tone);

  return (
    <span
      className={[
        "inline-flex items-center gap-[6px] rounded-[8px] border px-3 py-2 text-[12px] font-medium leading-4",
        className,
      ].join(" ")}
    >
      {renderIcon(tone)}
      <span>{label}</span>
    </span>
  );
}

function getToneClassName(tone: RequestDialogBadgeTone) {
  if (tone === "approved") {
    return "border-[#86EFAC] bg-[#DCFCE7] text-[#15803D]";
  }

  if (tone === "pending") {
    return "border-[#FDE68A] bg-[#FEF3C7] text-[#973C00]";
  }

  if (tone === "cancelled") {
    return "border-[#D4D4D8] bg-[#F5F5F5] text-[#52525B]";
  }

  return "border-[#FFA2A2] bg-[#FEF2F2] text-[#C10007]";
}

function renderIcon(tone: RequestDialogBadgeTone) {
  if (tone === "approved") {
    return <CheckCircle2 className="h-3.5 w-3.5" />;
  }

  if (tone === "pending") {
    return <Clock3 className="h-3.5 w-3.5" />;
  }

  if (tone === "cancelled") {
    return <CircleSlash className="h-3.5 w-3.5" />;
  }

  return <AlertTriangle className="h-3.5 w-3.5" />;
}
