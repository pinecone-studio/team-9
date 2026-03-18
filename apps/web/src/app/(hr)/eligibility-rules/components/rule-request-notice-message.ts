import type { ApprovalRoleValue } from "./RuleApprovalSection";

export function getRuleRequestNoticeMessage(role: ApprovalRoleValue) {
  const targetLabel = role === "finance_manager" ? "Finance" : "HR";
  return `Tanii huselt ${targetLabel}-ruu ilgeegdlee. Ta yvuulsan huseltee Requests hesgees harna.`;
}
