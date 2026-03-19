import type { ApprovalRequestRecord } from "./approval-requests.graphql";
import { formatRequestChangeSummary } from "./approval-request-summary-formatters";
import { parseApprovalPayload } from "./approval-request-parsers";
import { resolveRequestPerson, resolveRequestPersonName, useRequestPeople } from "./RequestPeopleContext";
import {
  AssigneeLabel,
  DataUpdateTypeBadge,
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

function formatOverrideDetails(request: ApprovalRequestRecord) {
  if (request.action_type === "update") {
    return formatRequestChangeSummary(request).replace("modified", "changed");
  }

  const payload = parseApprovalPayload(request);
  if (payload.entityType === "benefit") {
    return payload.benefit?.name?.trim() || "Untitled Benefit";
  }

  return "Override request";
}

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
          <col className="w-[168.76px]" />
          <col className="w-[162.29px]" />
          <col className="w-[212.06px]" />
          <col className="w-[147.86px]" />
          <col className="w-[239.35px]" />
          <col className="w-[125.61px]" />
          <col className="w-[174.46px]" />
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
          const requesterName = resolveRequestPersonName(people, request.requested_by);
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
          const details = formatOverrideDetails(request);
          const isDataUpdate = request.action_type === "update";

          return (
            <DataTableRow
              dimmed={request.status !== "pending"}
              highlighted={highlighted}
              key={request.id}
              onSelect={() => onReview(request.id)}
            >
              <td className="px-2 py-[9px]">
                {isDataUpdate ? <DataUpdateTypeBadge /> : <OverrideTypeBadge />}
              </td>
              <td className="px-2 py-[9px]">
                <div className="w-[146px]">
                  <PrimaryCell
                    subtitle={employeePerson?.position ?? (employeePerson ? null : requesterName)}
                    title={employeePerson?.name ?? employeeRequest?.employeeName?.trim() ?? requesterName}
                  />
                </div>
              </td>
              <td className="px-2 py-[9.39px] font-sans text-[14px] leading-5 font-normal text-[#737373]">
                <span className="inline-flex w-[204px] truncate items-center">{details}</span>
              </td>
              <td className="px-2 py-[9.39px] font-sans text-[14px] leading-5 font-normal text-[#737373]">
                {requesterName}
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
