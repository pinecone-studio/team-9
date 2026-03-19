import type { ApprovalRequestRecord } from "./approval-requests.graphql";
import { parseApprovalPayload } from "./approval-request-parsers";
import { resolveRequestPerson, resolveRequestPersonName, useRequestPeople } from "./RequestPeopleContext";
import {
  AssigneeLabel,
  DataTableHeader,
  DataTableRow,
  DataTableShell,
  isAssignedToCurrentRole,
  OverrideTypeBadge,
  PrimaryCell,
  RequestStatusBadge,
} from "./RequestsTableShared";
import { formatTableDateTime } from "./request-table-formatters";

type OverrideRequestsTableProps = {
  currentUserRole: string;
  onReview: (requestId: string) => void;
  requests: ApprovalRequestRecord[];
};

export default function OverrideRequestsTable({
  currentUserRole,
  onReview,
  requests,
}: OverrideRequestsTableProps) {
  const people = useRequestPeople();

  return (
    <DataTableShell
      tableClassName="w-[1298px] min-w-[1298px]"
      colgroup={
        <colgroup>
          <col className="w-[180px]" />
          <col className="w-[215px]" />
          <col className="w-[230px]" />
          <col className="w-[150px]" />
          <col className="w-[273px]" />
          <col className="w-[110px]" />
          <col className="w-[140px]" />
        </colgroup>
      }
    >
      <DataTableHeader
        labels={[
          "Request Type",
          "Employee",
          "Details",
          "Submitted By",
          "Submitted At",
          "Assigned To",
          "Status",
        ]}
      />
      <tbody>
        {requests.map((request) => {
          const payload = parseApprovalPayload(request);
          const employeeRequest =
            payload.entityType === "benefit" ? payload.employeeRequest : null;
          const employeePerson = resolveRequestPerson(
            people,
            employeeRequest?.employeeId ?? employeeRequest?.employeeEmail,
          );
          const reviewerName = request.reviewed_by
            ? resolveRequestPersonName(people, request.reviewed_by)
            : null;
          const highlighted = isAssignedToCurrentRole({
            currentUserRole,
            reviewTarget: request.target_role,
            status: request.status,
          });
          const details =
            payload.entityType === "benefit"
              ? payload.benefit?.name?.trim() || "Untitled Benefit"
              : "Override request";

          return (
            <DataTableRow
              dimmed={request.status !== "pending"}
              highlighted={highlighted}
              key={request.id}
              onSelect={() => onReview(request.id)}
            >
              <td className="px-2 py-[9px]">
                <OverrideTypeBadge />
              </td>
              <td className="px-2 py-[9px]">
                <div className="w-[199px]">
                  <PrimaryCell
                    subtitle={employeePerson?.position}
                    title={employeePerson?.name ?? "Unknown Employee"}
                  />
                </div>
              </td>
              <td className="px-2 py-[9.39px] font-sans text-[14px] leading-5 font-normal text-[#737373]">
                <span className="inline-flex w-[214px] truncate items-center">{details}</span>
              </td>
              <td className="px-2 py-[9.39px] font-sans text-[14px] leading-5 font-normal text-[#737373]">
                {resolveRequestPersonName(people, request.requested_by)}
              </td>
              <td className="py-[9.39px] pr-2 pl-0 font-sans text-[14px] leading-5 font-normal text-[#737373]">
                <span className="inline-flex w-[160px] items-center">
                  {formatTableDateTime(request.created_at)}
                </span>
              </td>
              <td className="py-[9.39px] pr-4 pl-0">
                <AssigneeLabel
                  currentUserRole={currentUserRole}
                  reviewerName={reviewerName}
                  reviewTarget={request.target_role}
                  status={request.status}
                />
              </td>
              <td className="py-[8.8px] pr-4 pl-0">
                <div className="w-[124px]">
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
