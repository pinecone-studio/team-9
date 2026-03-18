"use client";

import { History, type LucideIcon } from "lucide-react";
import type {
  EmployeeDirectoryRequest,
} from "@/shared/graphql/employee-directory-dialog-utils";
import {
  formatDateTimeLabel,
  normalizeRequestActor,
} from "@/shared/graphql/employee-directory-dialog-utils";

type EmployeeDirectoryDialogRecentActionsProps = {
  employeeName: string;
  requests: EmployeeDirectoryRequest[];
};

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 text-[#0A0A0A]">
      <Icon className="h-4 w-4" />
      <h3 className="text-[14px] leading-5 font-medium">{title}</h3>
    </div>
  );
}

function getRequestActionLead(status: string) {
  if (status === "approved") {
    return "Benefit request approved ";
  }

  if (status === "rejected") {
    return "Benefit request rejected ";
  }

  if (status === "cancelled") {
    return "Benefit request cancelled ";
  }

  return "Benefit request submitted ";
}

export default function EmployeeDirectoryDialogRecentActions({
  employeeName,
  requests,
}: EmployeeDirectoryDialogRecentActionsProps) {
  const latestRequests = requests.slice(0, 5);

  return (
    <section className="space-y-4 border-t border-[#E5E5E5] pt-6">
      <SectionTitle icon={History} title="Recent User Actions" />
      {latestRequests.length === 0 ? (
        <div className="rounded-[8px] border border-dashed border-[#E5E5E5] px-4 py-6 text-center text-[14px] leading-5 text-[#737373]">
          No user actions recorded yet.
        </div>
      ) : (
        <div className="space-y-3">
          {latestRequests.map((request, index) => {
            const actorName = normalizeRequestActor(request, employeeName);
            const actionLead = getRequestActionLead(request.status.toLowerCase());
            const timestamp =
              request.reviewed_by && request.status !== "pending"
                ? request.updated_at
                : request.created_at;

            return (
              <article className="flex items-start gap-[10px]" key={request.id}>
                <div className="flex w-[6px] shrink-0 flex-col items-center self-stretch">
                  <span className="mt-1 h-[6px] w-[6px] rounded-full bg-[rgba(115,115,115,0.4)]" />
                  {index < latestRequests.length - 1 ? (
                    <span className="mt-1 w-px flex-1 bg-[#E5E5E5]" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <p className="text-[14px] leading-[18px] text-[#0A0A0A]">
                    {actionLead}
                    <span className="font-medium">{request.benefit.title}</span>
                  </p>
                  <p className="mt-[2px] text-[12px] leading-4 text-[#737373]">
                    {formatDateTimeLabel(timestamp)} by {actorName}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
