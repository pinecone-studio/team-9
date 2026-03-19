"use client";

import { useEffect } from "react";
import { ChevronRight, Gift, X } from "lucide-react";

import {
  formatDetailDateTimeWithAt,
  formatDetailYesNo,
} from "@/app/(hr)/requests/components/request-detail-formatters";
import type { AuditLogEntry } from "./audit-log-types";

type AuditLogBenefitApprovalDialogProps = {
  entry: AuditLogEntry;
  onClose: () => void;
};

export default function AuditLogBenefitApprovalDialog({
  entry,
  onClose,
}: AuditLogBenefitApprovalDialogProps) {
  const detail = entry.benefitApprovalDetail;

  useEffect(() => {
    if (!detail) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverscrollBehavior = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscrollBehavior;
    };
  }, [detail]);

  if (!detail) {
    return null;
  }

  const isApproved = entry.result === "Approved";
  const isUpdate = detail.actionType === "update";
  const isArchived = isApproved && detail.actionType === "delete";
  const isRejectedUpdate = isUpdate && !isApproved;
  const dialogEventLabel = isArchived ? "Benefit Archived" : entry.event;
  const resultBadgeLabel = isArchived ? "Archived" : entry.result;
  const showAttachedRules =
    isApproved && !isUpdate && !isArchived && detail.attachedRules.length > 0;
  const showApproverRole = !isUpdate && !isArchived;
  const showDescription = !isUpdate && !isArchived;
  const showVendor = !isRejectedUpdate && !isArchived;
  const showSubsidyPercentage = !isArchived;
  const showSubmissionDetails = !isArchived;
  const showDecisionSection = !isArchived;
  const changeSummaryItems =
    isUpdate
      ? (
          isRejectedUpdate
            ? [
                detail.previousMonthlyCap &&
                detail.monthlyCap &&
                detail.previousMonthlyCap !== detail.monthlyCap
                  ? {
                      currentValue: detail.monthlyCap,
                      label: "Monthly Amount",
                      previousValue: detail.previousMonthlyCap,
                    }
                  : null,
              ]
            : [
                detail.previousSubsidyPercentage &&
                detail.previousSubsidyPercentage !== detail.subsidyPercentage
                  ? {
                      currentValue: detail.subsidyPercentage,
                      label: "Subsidy Percentage",
                      previousValue: detail.previousSubsidyPercentage,
                    }
                  : null,
                detail.previousMonthlyCap &&
                detail.monthlyCap &&
                detail.previousMonthlyCap !== detail.monthlyCap
                  ? {
                      currentValue: detail.monthlyCap,
                      label: "Monthly Cap",
                      previousValue: detail.previousMonthlyCap,
                    }
                  : null,
              ]
        ).filter(
          (
            item,
          ): item is {
            currentValue: string;
            label: string;
            previousValue: string;
          } => Boolean(item),
        )
      : [];
  const decisionNotes = detail.reviewComment?.trim() || (
    isApproved
      ? "No decision notes were saved for this request."
      : "No rejection reason was saved for this request."
  );

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-hidden bg-black/50 px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        aria-modal="true"
        className={`hidden-scrollbar relative mx-auto flex max-h-[calc(100vh-48px)] w-full flex-col items-start gap-4 overflow-y-auto overscroll-none rounded-[10px] border border-[#E5E5E5] bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] ${
          isArchived ? "max-w-[512px] px-[23.8px] py-[23.8px]" : "max-w-[506px] px-[25px] py-[30px]"
        }`}
        role="dialog"
      >
        <button
          aria-label="Close dialog"
          className="absolute top-5 right-5 rounded-[8px] p-2 text-[#737373] transition-colors hover:bg-[#F5F5F5]"
          onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex w-full flex-col gap-2 pr-10">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-[#737373]" />
            <h2 className="text-[18px] leading-[18px] font-semibold text-[#0A0A0A]">
              {dialogEventLabel}
            </h2>
          </div>
          <p className="text-[14px] leading-5 text-[#737373]">Full details for this action.</p>
        </div>

        <div className="flex w-full flex-col gap-6">
          <Section title="Action Overview">
            <Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Timestamp" value={formatDetailDateTimeWithAt(detail.decisionAt)} />
                <Field label="Event Type" value={dialogEventLabel} />
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
                    {resultBadgeLabel}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] leading-4 text-[#737373]">Performed By</span>
                  <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
                    {entry.performedBy.name}
                  </span>
                  <span className="text-[12px] leading-4 text-[#737373]">{entry.performedBy.role}</span>
                </div>
                {!isArchived ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] leading-4 text-[#737373]">Reviewed By</span>
                    <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
                      {detail.reviewedBy.name}
                    </span>
                    <span className="text-[12px] leading-4 text-[#737373]">{detail.reviewedBy.role}</span>
                  </div>
                ) : null}
              </div>
            </Card>
          </Section>

          <Section title="Benefit Details">
            <Card>
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Benefit Name" value={detail.name} />
                  <Field label="Category" value={detail.category} />
                  {showVendor ? <Field label="Vendor" value={detail.vendorName} /> : null}
                  <Field
                    label="Requires Contract"
                    value={formatDetailYesNo(detail.requiresContract)}
                  />
                  {showSubsidyPercentage ? (
                    <Field label="Subsidy Percentage" value={detail.subsidyPercentage} />
                  ) : null}
                  {showApproverRole ? (
                    <Field label="Approver Role" value={detail.approverRole} />
                  ) : null}
                </div>
                {showDescription ? (
                  <Field label="Description" value={detail.description} />
                ) : null}
                {showAttachedRules ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] leading-4 text-[#737373]">Attached Rules</span>
                    <div className="flex flex-wrap gap-1.5">
                      {detail.attachedRules.map((rule) => (
                        <span
                          className="inline-flex items-center justify-center rounded-[8px] border border-[#E5E5E5] px-[7.8px] py-[2px] text-[12px] leading-4 font-medium text-[#0A0A0A]"
                          key={rule}
                        >
                          {rule}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </Card>
          </Section>

          {showSubmissionDetails ? (
            <Section title="Submission Details">
              <Card>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Submitted By" value={detail.submittedBy.name} />
                  <Field label="Submitted At" value={formatDetailDateTimeWithAt(detail.submittedAt)} />
                  <Field
                    label={isApproved ? "Approved At" : "Rejected At"}
                    value={formatDetailDateTimeWithAt(detail.decisionAt)}
                  />
                </div>
              </Card>
            </Section>
          ) : null}

          {changeSummaryItems.length > 0 ? (
            <Section title="Change Summary">
              <div className="flex flex-col gap-2">
                {changeSummaryItems.map((item) => (
                  <ChangeSummaryCard
                    currentValue={item.currentValue}
                    key={item.label}
                    label={item.label}
                    previousValue={item.previousValue}
                  />
                ))}
              </div>
            </Section>
          ) : null}

          {showDecisionSection ? (
            <Section title={isApproved ? "Decision Notes" : "Rejection Reason"}>
              <div
                className={`w-full rounded-[10px] border px-[15.8px] py-[15.8px] ${
                  isApproved
                    ? "border-[#E5E5E5] bg-[rgba(245,245,245,0.3)]"
                    : "border-[#FFC9C9] bg-[#FEF2F2]"
                }`}
              >
                <p
                  className={`text-[14px] leading-5 ${
                    isApproved ? "text-[#0A0A0A]" : "text-[#C10007]"
                  }`}
                >
                  {decisionNotes}
                </p>
              </div>
            </Section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ChangeSummaryCard({
  currentValue,
  label,
  previousValue,
}: {
  currentValue: string;
  label: string;
  previousValue: string;
}) {
  return (
    <Card className="px-[11.8px] py-[11.8px]">
      <div className="flex flex-col gap-2">
        <span className="text-[12px] leading-4 text-[#737373]">{label}</span>
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-[4px] border border-[#FFC9C9] bg-[#FEF2F2] px-[7.8px] py-[7.8px] text-[14px] leading-5 text-[#C10007] line-through">
            {previousValue}
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-[#737373]" />
          <div className="flex-1 rounded-[4px] border border-[#B9F8CF] bg-[#F0FDF4] px-[7.8px] py-[7.8px] text-[14px] leading-5 text-[#008236]">
            {currentValue}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Section({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="flex w-full flex-col gap-3">
      <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">{title}</h3>
      {children}
    </section>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] px-[15.8px] py-[15.8px] ${className}`.trim()}>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] leading-4 text-[#737373]">{label}</span>
      <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{value}</span>
    </div>
  );
}
