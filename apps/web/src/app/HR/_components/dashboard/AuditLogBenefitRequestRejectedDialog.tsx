"use client";

import { Gift } from "lucide-react";

import {
  formatDetailDateTimeWithAt,
  formatDetailYesNo,
} from "@/app/(hr)/requests/components/request-detail-formatters";
import {
  Card,
  DecisionTextCard,
  Field,
  Section,
  TimelineItem,
} from "./audit-log-dialog-primitives";
import { AuditLogDialogShell } from "./audit-log-dialog-shell";
import type { AuditLogBenefitRequestDetail } from "./audit-log-types";

type AuditLogBenefitRequestRejectedDialogProps = {
  onClose: () => void;
  request: AuditLogBenefitRequestDetail;
};

export default function AuditLogBenefitRequestRejectedDialog({
  onClose,
  request,
}: AuditLogBenefitRequestRejectedDialogProps) {
  const reviewerName = request.reviewed_by?.name?.trim() || "Unassigned reviewer";
  const reviewerRole =
    request.approval_role === "finance_manager" ? "Finance Manager" : "HR Admin";
  const rejectionReason =
    request.reviewComment?.trim() || "No rejection reason was saved for this request.";

  return (
    <AuditLogDialogShell icon={Gift} onClose={onClose} title="Benefit Request Rejected">
      <Section title="Action Overview">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Timestamp" value={formatDetailDateTimeWithAt(request.updated_at)} />
            <Field label="Event Type" value="Benefit Request Rejected" />
            <div className="flex flex-col gap-[6px]">
              <span className="text-[12px] leading-4 text-[#737373]">Result</span>
              <span className="inline-flex w-fit items-center justify-center rounded-[8px] bg-[#FFE2E2] px-[7.8px] py-[1.8px] text-[12px] leading-4 font-medium text-[#9F0712]">
                Rejected
              </span>
            </div>
            <ReviewerField name={reviewerName} role={reviewerRole} />
          </div>
        </Card>
      </Section>

      <Section title="Submission Details">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Submitted By" value={request.employee.name} />
            <Field label="Submitted At" value={formatDetailDateTimeWithAt(request.created_at)} />
          </div>
        </Card>
      </Section>

      <Section title="Employee Details">
        <Card>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Name" value={request.employee.name} />
            <Field label="Role" value={request.employee.position} />
            <Field label="Department" value={request.employee.department} />
          </div>
        </Card>
      </Section>

      <Section title="Benefit Details">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Benefit Name" value={request.benefit.title} />
            <Field label="Category" value={request.benefit.category} />
            <Field label="Requires Contract" value={formatDetailYesNo(request.benefit.requiresContract)} />
          </div>
        </Card>
      </Section>

      <Section title="Request Timeline">
        <Card>
          <div className="flex flex-col gap-3">
            <TimelineItem
              colorClassName="bg-[#2B7FFF]"
              label="Request Submitted"
              timestamp={formatDetailDateTimeWithAt(request.created_at)}
            />
            <TimelineItem
              colorClassName="bg-[#FB2C36]"
              label="Reviewed"
              timestamp={formatDetailDateTimeWithAt(request.updated_at)}
            />
          </div>
        </Card>
      </Section>

      <Section title="Rejection Reason">
        <DecisionTextCard isPositive={false} text={rejectionReason} />
      </Section>
    </AuditLogDialogShell>
  );
}

function ReviewerField({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] leading-4 text-[#737373]">Reviewed By</span>
      <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{name}</span>
      <span className="text-[12px] leading-4 text-[#737373]">{role}</span>
    </div>
  );
}
