import type { BenefitRequestRecord } from "./benefit-requests.graphql";

function formatBenefitAssignee(role: BenefitRequestRecord["approval_role"]) {
  return role === "finance_manager" ? "Finance" : "HR";
}

export function BenefitRequestAssignee({
  currentUserRole,
  request,
}: {
  currentUserRole: string;
  request: BenefitRequestRecord;
}) {
  const reviewerName = request.reviewed_by?.name?.trim();
  const isCurrentRolePending =
    request.status === "pending" &&
    request.approval_role.trim().toLowerCase() === currentUserRole.trim().toLowerCase();
  const label = reviewerName || formatBenefitAssignee(request.approval_role);

  return (
    <span
      className={`inline-flex max-w-full truncate font-sans text-[14px] leading-5 ${
        isCurrentRolePending ? "font-normal text-[#155DFC]" : "font-normal text-[#0A0A0A]"
      }`}
    >
      {label}
    </span>
  );
}

export function BenefitPrimaryCell({
  subtitle,
  title,
}: {
  subtitle: string | null | undefined;
  title: string;
}) {
  return (
    <div className="flex flex-col items-start gap-0 font-sans">
      <span className="w-full truncate text-[14px] leading-5 font-medium text-[#0A0A0A]">
        {title}
      </span>
      <span className="w-full truncate text-[12px] leading-4 font-normal text-[#737373]">
        {subtitle?.trim() || "-"}
      </span>
    </div>
  );
}
