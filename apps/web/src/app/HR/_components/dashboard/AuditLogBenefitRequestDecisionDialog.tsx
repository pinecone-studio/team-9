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
import { getBenefitRequestDecisionDialogState } from "./audit-log-dialog-view-models";
import type { AuditLogEntry } from "./audit-log-types";

type AuditLogBenefitRequestDecisionDialogProps = {
  entry: AuditLogEntry;
  onClose: () => void;
};

export default function AuditLogBenefitRequestDecisionDialog({
  entry,
  onClose,
}: AuditLogBenefitRequestDecisionDialogProps) {
  const request = entry.benefitRequestDetail;

  if (!request) {
    return null;
  }

  const state = getBenefitRequestDecisionDialogState(entry, request);
  const usesPerformedBy = state.isApproved || state.isDeactivated;

  return (
    <AuditLogDialogShell
      compact={state.isActivated || state.isDeactivated}
      icon={Gift}
      onClose={onClose}
      title={state.decisionTitle}
    >
      <Section title="Action Overview">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Timestamp" value={formatDetailDateTimeWithAt(request.updated_at)} />
            <Field label="Event Type" value={state.decisionTitle} />
            <ResultBadge isApproved={state.isApproved} isDeactivated={state.isDeactivated} label={state.resultBadgeLabel} />
            <ReviewField
              label={usesPerformedBy ? "Performed By" : "Reviewed By"}
              name={usesPerformedBy ? entry.performedBy.name : state.reviewerName}
              role={usesPerformedBy ? entry.performedBy.role : state.reviewerRole}
            />
            {state.isApproved && !state.isActivated && !state.isDeactivated ? (
              <ReviewField label="Reviewed By" name={state.reviewerName} role={state.reviewerRole} />
            ) : null}
          </div>
        </Card>
      </Section>

      {!state.isActivated && !state.isDeactivated ? (
        <Section title="Employee Details">
          <Card>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Name" value={request.employee.name} />
              <Field label="Role" value={request.employee.position} />
              <Field label="Department" value={request.employee.department} />
            </div>
          </Card>
        </Section>
      ) : null}

      <Section title="Benefit Details">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Benefit Name" value={request.benefit.title} />
            <Field label="Category" value={request.benefit.category} />
            {state.isApproved && !state.isActivated && !state.isDeactivated ? (
              <Field label="Vendor" value={request.benefit.vendorName || "-"} />
            ) : null}
            <Field label="Requires Contract" value={formatDetailYesNo(request.benefit.requiresContract)} />
            {state.isActivated ? (
              <Field label="Subsidy Percentage" value={request.benefit.subsidyPercentage || "—"} />
            ) : null}
          </div>
        </Card>
      </Section>

      {!state.isActivated && !state.isDeactivated ? (
        <Section title="Request Timeline">
          <Card>
            <div className="flex flex-col gap-4">
              {state.timelineEntries.map((timelineEntry) => (
                <TimelineItem {...timelineEntry} key={timelineEntry.id} />
              ))}
            </div>
          </Card>
        </Section>
      ) : null}

      {!state.isActivated && !state.isDeactivated ? (
        <Section title={state.isApproved ? "Decision Notes" : "Rejection Reason"}>
          <DecisionTextCard isPositive={state.isApproved} text={state.decisionNotes} />
        </Section>
      ) : null}
    </AuditLogDialogShell>
  );
}

function ReviewField({
  label,
  name,
  role,
}: {
  label: string;
  name: string;
  role: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] leading-4 text-[#737373]">{label}</span>
      <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{name}</span>
      <span className="text-[12px] leading-4 text-[#737373]">{role}</span>
    </div>
  );
}

function ResultBadge({
  isApproved,
  isDeactivated,
  label,
}: {
  isApproved: boolean;
  isDeactivated: boolean;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      <span className="text-[12px] leading-4 text-[#737373]">Result</span>
      <span
        className={`inline-flex w-fit items-center justify-center rounded-[8px] px-[7.8px] py-[1.8px] text-[12px] leading-4 font-medium ${
          isDeactivated
            ? "bg-[#F3F4F6] text-[#1E2939]"
            : isApproved
              ? "bg-[#DCFCE7] text-[#016630]"
              : "bg-[#FFE2E2] text-[#9F0712]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
