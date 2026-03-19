import type { AuditLogsPageDataQuery } from "./audit-logs.graphql";
import { buildApprovalRequestEntries } from "./audit-log-approval-entry-builder";
import { buildBenefitRequestEntries } from "./audit-log-benefit-request-entry-builder";
import { buildPeopleIndex } from "./audit-log-people";

export function buildAuditLogEntries(data?: AuditLogsPageDataQuery) {
  const peopleIndex = buildPeopleIndex(data?.employees);

  return [...(data?.benefitRequests ?? []).flatMap((request) => buildBenefitRequestEntries(request, peopleIndex))]
    .concat(
      (data?.approvalRequests ?? []).flatMap((request) =>
        buildApprovalRequestEntries(request, peopleIndex),
      ),
    )
    .sort(
      (left, right) =>
        new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime(),
    );
}
