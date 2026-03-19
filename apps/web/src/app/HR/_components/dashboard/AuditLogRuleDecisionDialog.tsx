"use client";

import { Asterisk } from "lucide-react";

import { formatDetailDateTimeWithAt } from "@/app/(hr)/requests/components/request-detail-formatters";
import {
  Card,
  ChangeSummaryCard,
  DecisionTextCard,
  Field,
  Section,
} from "./audit-log-dialog-primitives";
import { AuditLogDialogShell } from "./audit-log-dialog-shell";
import { getRuleDecisionDialogState } from "./audit-log-dialog-view-models";
import type { AuditLogEntry } from "./audit-log-types";

type AuditLogRuleDecisionDialogProps = {
  entry: AuditLogEntry;
  onClose: () => void;
};

export default function AuditLogRuleDecisionDialog({
  entry,
  onClose,
}: AuditLogRuleDecisionDialogProps) {
  const detail = entry.ruleApprovalDetail;

  if (!detail) {
    return null;
  }

  const state = getRuleDecisionDialogState(entry, detail);

  return (
    <AuditLogDialogShell
      compact={state.isArchived}
      icon={Asterisk}
      onClose={onClose}
      title={state.dialogEventLabel}
    >
      <Section title="Action Overview">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Timestamp" value={formatDetailDateTimeWithAt(entry.occurredAt)} />
            <Field label="Event Type" value={state.dialogEventLabel} />
            <ResultBadge isApproved={state.isApproved} isArchived={state.isArchived} label={state.resultBadgeLabel} />
            <PersonField label="Performed By" person={entry.performedBy} />
            {!state.isArchived ? <PersonField label="Reviewed By" person={detail.reviewedBy} /> : null}
          </div>
        </Card>
      </Section>

      <Section title="Rule Details">
        <Card>
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Rule Name" value={detail.name} />
              <Field label="Category" value={detail.category} />
              <Field label="Source Field" value={detail.sourceField} />
              <Field label="Requirement Value" value={detail.requirementValue} />
            </div>
            <Field label="Blocking Message" value={detail.blockingMessage} />
            {state.showTargetBenefits ? <TargetBenefits benefits={detail.targetBenefits} /> : null}
          </div>
        </Card>
      </Section>

      {state.showSubmissionDetails ? (
        <Section title="Submission Details">
          <Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Submitted By" value={detail.submittedBy.name} />
              <Field label="Submitted At" value={formatDetailDateTimeWithAt(detail.submittedAt)} />
              <Field
                label={state.isApproved ? "Approved At" : "Rejected At"}
                value={formatDetailDateTimeWithAt(detail.decisionAt)}
              />
            </div>
          </Card>
        </Section>
      ) : null}

      {state.showChangeSummary ? (
        <Section title="Change Summary">
          <div className="flex flex-col gap-2">
            {state.changeSummaryItems.map((item) => (
              <ChangeSummaryCard {...item} key={item.label} />
            ))}
          </div>
        </Section>
      ) : null}

      {state.showNotesSection ? (
        <Section title={state.isApproved ? "Decision Notes" : "Rejection Reason"}>
          <DecisionTextCard
            isPositive={state.isApproved}
            text={detail.reviewComment?.trim() || state.notesFallback}
          />
        </Section>
      ) : null}
    </AuditLogDialogShell>
  );
}

function PersonField({
  label,
  person,
}: {
  label: string;
  person: { name: string; role: string };
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] leading-4 text-[#737373]">{label}</span>
      <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{person.name}</span>
      <span className="text-[12px] leading-4 text-[#737373]">{person.role}</span>
    </div>
  );
}

function ResultBadge({
  isApproved,
  isArchived,
  label,
}: {
  isApproved: boolean;
  isArchived: boolean;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      <span className="text-[12px] leading-4 text-[#737373]">Result</span>
      <span
        className={`inline-flex w-fit items-center justify-center rounded-[8px] px-[7.8px] py-[1.8px] text-[12px] leading-4 font-medium ${
          isArchived
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

function TargetBenefits({ benefits }: { benefits: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] leading-4 text-[#737373]">Target Benefits</span>
      <div className="flex flex-wrap gap-1.5">
        {benefits.length > 0 ? (
          benefits.map((benefit) => (
            <span
              className="inline-flex items-center justify-center rounded-[8px] border border-[#E5E5E5] px-[7.8px] py-[2px] text-[12px] leading-4 font-medium text-[#0A0A0A]"
              key={benefit}
            >
              {benefit}
            </span>
          ))
        ) : (
          <span className="text-[14px] leading-5 text-[#737373]">No linked benefits</span>
        )}
      </div>
    </div>
  );
}
