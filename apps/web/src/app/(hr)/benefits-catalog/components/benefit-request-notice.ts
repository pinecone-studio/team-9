import type { ApprovalRoleValue } from "./add-benefit-dialog.graphql";

export function getBenefitRequestNoticeMessage(role: ApprovalRoleValue) {
  const targetLabel = role === "finance_manager" ? "Finance" : "HR";
  return `Tanii huselt ${targetLabel}-ruu ilgeegdlee. Ta yvuulsan huseltee Requests hesgees harna.`;
}
