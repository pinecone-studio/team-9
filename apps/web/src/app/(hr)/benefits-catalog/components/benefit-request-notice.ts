import type { ApprovalRoleValue } from "./add-benefit-dialog.graphql";

export function getBenefitRequestNoticeMessage(
  role: ApprovalRoleValue,
  actionLabel = "huselt",
) {
  const targetLabel = role === "finance_manager" ? "Finance" : "HR";
  return `Tanii ${actionLabel} ${targetLabel}-iin approval ruu ilgeegdlee. Ta yvuulsan huseltee Requests hesgees harna.`;
}
