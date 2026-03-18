import type { ApprovalRequestQuery } from "./approval-requests.graphql";
import {
  formatApprovalRequestAction,
  formatApprovalRequestName,
  formatApprovalRole,
  formatApprovalStatus,
  parseApprovalPayload,
} from "./approval-request-utils";

type RequestRecord = NonNullable<ApprovalRequestQuery["approvalRequest"]>;

export function getApprovalRequestDialogCopy(request: RequestRecord | null) {
  if (!request) {
    return {
      fallbackMeta: null,
      subtitle: null,
      title: "Review Request",
    };
  }

  const parsedPayload = parseApprovalPayload(request);
  const isBenefitCreate =
    request.entity_type === "benefit" &&
    request.action_type === "create" &&
    !(parsedPayload.entityType === "benefit" && parsedPayload.employeeRequest);
  const isBenefitConfigurationUpdate =
    request.entity_type === "benefit" &&
    request.action_type === "update" &&
    !(parsedPayload.entityType === "benefit" && parsedPayload.employeeRequest);
  const isRuleConfigurationChange = request.entity_type === "rule";

  if (isBenefitCreate) {
    return {
      fallbackMeta: null,
      subtitle: "Review the benefit details and approve or reject it.",
      title: "Review New Benefit",
    };
  }

  if (
    isBenefitConfigurationUpdate ||
    (isRuleConfigurationChange && request.action_type === "update")
  ) {
    return {
      fallbackMeta: null,
      subtitle: "Approve or reject this eligibility rule change.",
      title: "Review Configuration Change",
    };
  }

  if (isRuleConfigurationChange && request.action_type === "create") {
    return {
      fallbackMeta: null,
      subtitle: "Review the rule details and approve or reject it.",
      title: "Review New Rule",
    };
  }

  return {
    fallbackMeta: [
      formatApprovalRequestName(request),
      `Target role: ${formatApprovalRole(request.target_role)}`,
      `Status: ${formatApprovalStatus(request.status)}`,
    ],
    subtitle: null,
    title: `${formatApprovalRequestAction(request)} ${
      request.entity_type === "benefit" ? "Benefit" : "Rule"
    }`,
  };
}
