import type { KeyboardEvent } from "react";

import type { BenefitRequestRecord } from "./benefit-requests.graphql";
import {
  DataTableHeader,
  DataTableShell,
  RequestStatusBadge,
} from "./RequestsTableShared";
import {
  BenefitPrimaryCell,
  BenefitRequestAssignee,
} from "./BenefitRequestsTableParts";
import { formatTableDateTime } from "./request-table-formatters";

type BenefitRequestsTableProps = {
  currentUserRole: string;
  onReview: (requestId: string) => void;
  requests: BenefitRequestRecord[];
};

function handleRowKeyDown(
  event: KeyboardEvent<HTMLTableRowElement>,
  onSelect: () => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onSelect();
  }
}

export default function BenefitRequestsTable({
  currentUserRole,
  onReview,
  requests,
}: BenefitRequestsTableProps) {
  return (
    <DataTableShell
      tableClassName="mx-auto w-[1230.41px] min-w-[1230.41px]"
      colgroup={
        <colgroup>
          <col className="w-[194.46px]" />
          <col className="w-[299.8px]" />
          <col className="w-[286.13px]" />
          <col className="w-[241.39px]" />
          <col className="w-[208.63px]" />
        </colgroup>
      }
    >
      <DataTableHeader
        labels={["Employee", "Benefit", "Submitted At", "Assigned To", "Status"]}
      />

      <tbody>
        {requests.map((request) => {
          const isResolved = request.status !== "pending";

          return (
            <tr
              className={`h-[54px] cursor-pointer border-b border-[#E5E5E5] align-middle transition-colors hover:bg-[#FAFBFC] focus-visible:outline-none ${
                isResolved ? "opacity-60" : ""
              }`}
              key={request.id}
              onClick={() => onReview(request.id)}
              onKeyDown={(event) => handleRowKeyDown(event, () => onReview(request.id))}
              tabIndex={0}
            >
              <td className="px-2 py-[9px]">
                <BenefitPrimaryCell
                  subtitle={request.employee.position}
                  title={request.employee.name}
                />
              </td>
              <td className="px-2 py-[9px]">
                <BenefitPrimaryCell
                  subtitle={request.benefit.category}
                  title={request.benefit.title}
                />
              </td>
              <td className="py-[16.39px] pr-2 pl-0 font-sans text-[14px] leading-5 font-normal text-[#737373]">
                <span className="inline-flex w-[160px] items-center">
                  {formatTableDateTime(request.created_at)}
                </span>
              </td>
              <td className="py-[16.39px] pr-4 pl-0">
                <div className="w-[225.39px]">
                  <BenefitRequestAssignee
                    currentUserRole={currentUserRole}
                    request={request}
                  />
                </div>
              </td>
              <td className="py-[15.8px] pr-4 pl-0">
                <div className="w-[192.63px]">
                  <RequestStatusBadge status={request.status} />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </DataTableShell>
  );
}
