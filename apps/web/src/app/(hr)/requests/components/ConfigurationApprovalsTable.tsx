import type { ApprovalRequestRecord } from "./approval-requests.graphql";
import { resolveRequestPersonName, useRequestPeople } from "./RequestPeopleContext";
import {
  AssigneeLabel,
  DataTableHeader,
  DataTableRow,
  DataTableShell,
  EntityTypeBadge,
  isAssignedToCurrentRole,
  PrimaryCell,
} from "./RequestsTableShared";
import {
  formatApprovalRequestName,
  formatRequestChangeSummary,
} from "./approval-request-utils";
import { formatTableDateTime } from "./request-table-formatters";

type ConfigurationApprovalsTableProps = {
  currentUserRole: string;
  onReview: (requestId: string) => void;
  requests: ApprovalRequestRecord[];
};

function getChangeSummaryTextClass(request: ApprovalRequestRecord) {
  if (request.action_type === "create") {
    return "text-[#00A63E]";
  }

  if (request.action_type === "delete") {
    return "text-[#C10007]";
  }

  return "text-[#737373]";
}

export default function ConfigurationApprovalsTable({
  currentUserRole,
  onReview,
  requests,
}: ConfigurationApprovalsTableProps) {
  const people = useRequestPeople();

  return (
    <DataTableShell
      tableClassName="w-[1250px] min-w-[1250px]"
      colgroup={
        <colgroup>
          <col className="w-[194px]" />
          <col className="w-[324px]" />
          <col className="w-[244px]" />
          <col className="w-[196px]" />
          <col className="w-[334px]" />
          <col className="w-[168px]" />
        </colgroup>
      }
    >
      <DataTableHeader
        labels={[
          "Request Type",
          "Item Name",
          "Change Summary",
          "Submitted By",
          "Submitted At",
          "Assigned To",
        ]}
      />
      <tbody>
        {requests.map((request) => {
          const reviewerName = request.reviewed_by
            ? resolveRequestPersonName(people, request.reviewed_by)
            : null;
          const changeSummary = formatRequestChangeSummary(request);
          const highlighted = isAssignedToCurrentRole({
            currentUserRole,
            reviewTarget: request.target_role,
            status: request.status,
          });

          return (
            <DataTableRow
              dimmed={request.status !== "pending"}
              highlighted={highlighted}
              key={request.id}
              onSelect={() => onReview(request.id)}
            >
              <td className="px-3 py-[12px]">
                <EntityTypeBadge request={request} />
              </td>
              <td className="px-3 py-[12px]">
                <div className="w-[280px]">
                  <PrimaryCell title={formatApprovalRequestName(request)} />
                </div>
              </td>
              <td
                className={`px-3 py-[12px] font-sans text-[16px] leading-6 font-normal ${getChangeSummaryTextClass(request)}`}
              >
                <span className="inline-flex w-[220px] truncate items-center">
                  {changeSummary}
                </span>
              </td>
              <td className="px-3 py-[12px] font-sans text-[16px] leading-6 font-normal text-[#737373]">
                {resolveRequestPersonName(people, request.requested_by)}
              </td>
              <td className="px-3 py-[12px] font-sans text-[16px] leading-6 font-normal text-[#A3A3A3]">
                <span className="inline-flex w-[300px] items-center">
                  {formatTableDateTime(request.created_at)}
                </span>
              </td>
              <td className="px-3 py-[12px]">
                <AssigneeLabel
                  currentUserRole={currentUserRole}
                  reviewerName={reviewerName}
                  reviewTarget={request.target_role}
                  status={request.status}
                />
              </td>
            </DataTableRow>
          );
        })}
      </tbody>
    </DataTableShell>
  );
}
