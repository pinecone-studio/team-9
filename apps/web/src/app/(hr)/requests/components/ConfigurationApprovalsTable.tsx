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
  RequestStatusBadge,
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
      tableClassName="w-[1298px] min-w-[1298px]"
      colgroup={
        <colgroup>
          <col className="w-[138.55px]" />
          <col className="w-[231.85px]" />
          <col className="w-[174.3px]" />
          <col className="w-[147.48px]" />
          <col className="w-[238.98px]" />
          <col className="w-[125.26px]" />
          <col className="w-[173.99px]" />
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
          "Status",
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
              <td className="px-2 py-[9px]">
                <EntityTypeBadge request={request} />
              </td>
              <td className="px-2 py-[9px]">
                <div className="w-[215px]">
                  <PrimaryCell title={formatApprovalRequestName(request)} />
                </div>
              </td>
              <td
                className={`px-2 py-[9.39px] font-sans text-[14px] leading-5 font-normal ${getChangeSummaryTextClass(request)}`}
              >
                <span className="inline-flex w-[158px] truncate items-center">
                  {changeSummary}
                </span>
              </td>
              <td className="px-2 py-[9.39px] font-sans text-[14px] leading-5 font-normal text-[#737373]">
                {resolveRequestPersonName(people, request.requested_by)}
              </td>
              <td className="py-[9.39px] pr-2 pl-0 font-sans text-[14px] leading-5 font-normal text-[#737373]">
                <span className="inline-flex w-[170px] items-center">
                  {formatTableDateTime(request.created_at)}
                </span>
              </td>
              <td className="py-[9.39px] pr-2 pl-0">
                <AssigneeLabel
                  currentUserRole={currentUserRole}
                  reviewerName={reviewerName}
                  reviewTarget={request.target_role}
                  status={request.status}
                />
              </td>
              <td className="py-[8.8px] pr-2 pl-0">
                <div className="w-[150px]">
                  <RequestStatusBadge status={request.status} />
                </div>
              </td>
            </DataTableRow>
          );
        })}
      </tbody>
    </DataTableShell>
  );
}
