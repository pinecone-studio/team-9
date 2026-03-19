"use client";

import { useEffect } from "react";
import { Gift, X } from "lucide-react";

import {
  formatDetailDateTimeWithAt,
  formatDetailYesNo,
} from "@/app/(hr)/requests/components/request-detail-formatters";
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

  useEffect(() => {
    if (!request) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverscrollBehavior = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscrollBehavior;
    };
  }, [request]);

  if (!request) {
    return null;
  }

  const isApproved = entry.result === "Approved";
  const isCancelled = entry.result === "Cancelled";
  const isActivated = isApproved && entry.event === "Benefit Activation Approved";
  const isDeactivated = isCancelled && entry.event === "Benefit Request Cancelled";
  const decisionTitle = isActivated
    ? "Benefit Activated"
    : isDeactivated
      ? "Benefit Deactivated"
      : entry.event;
  const resultBadgeLabel = isActivated
    ? "Activated"
    : isDeactivated
      ? "Archived"
      : entry.result;
  const reviewerName = request.reviewed_by?.name?.trim() || entry.reviewedBy || "Unassigned reviewer";
  const reviewerRole =
    request.approval_role === "finance_manager" ? "Finance Manager" : "HR Admin";
  const decisionNotes = request.reviewComment?.trim() || (
    isApproved
      ? "No decision notes were saved for this request."
      : "No rejection reason was saved for this request."
  );
  const timelineEntries = [
    {
      colorClassName: "bg-[#2B7FFF]",
      id: "submitted",
      label: "Request Submitted",
      timestamp: formatDetailDateTimeWithAt(request.created_at),
    },
    ...(isApproved && request.contractAcceptedAt
      ? [{
          colorClassName: "bg-[#2B7FFF]",
          id: "contract-accepted",
          label: "Contract Accepted",
          timestamp: formatDetailDateTimeWithAt(request.contractAcceptedAt),
        }]
      : []),
    {
      colorClassName: isApproved ? "bg-[#00C950]" : "bg-[#FB2C36]",
      id: "reviewed",
      label: "Reviewed",
      timestamp: formatDetailDateTimeWithAt(request.updated_at),
    },
  ];

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
          isActivated || isDeactivated
            ? "max-w-[512px] px-[23.8px] py-[23.8px]"
            : "max-w-[506px] px-[25px] py-[30px]"
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
              {decisionTitle}
            </h2>
          </div>
          <p className="text-[14px] leading-5 text-[#737373]">
            Full details for this action.
          </p>
        </div>

        <div className="flex w-full flex-col gap-6">
          <Section title="Action Overview">
            <Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Timestamp" value={formatDetailDateTimeWithAt(request.updated_at)} />
                <Field label="Event Type" value={decisionTitle} />
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
                    {resultBadgeLabel}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] leading-4 text-[#737373]">
                    {isApproved || isDeactivated ? "Performed By" : "Reviewed By"}
                  </span>
                  <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
                    {isApproved || isDeactivated ? entry.performedBy.name : reviewerName}
                  </span>
                  <span className="text-[12px] leading-4 text-[#737373]">
                    {isApproved || isDeactivated ? entry.performedBy.role : reviewerRole}
                  </span>
                </div>
                {isApproved && !isActivated && !isDeactivated ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] leading-4 text-[#737373]">Reviewed By</span>
                    <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
                      {reviewerName}
                    </span>
                    <span className="text-[12px] leading-4 text-[#737373]">{reviewerRole}</span>
                  </div>
                ) : null}
              </div>
            </Card>
          </Section>

          {!isActivated && !isDeactivated ? (
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
                {isApproved && !isActivated && !isDeactivated ? (
                  <Field label="Vendor" value={request.benefit.vendorName || "-"} />
                ) : null}
                <Field
                  label="Requires Contract"
                  value={formatDetailYesNo(request.benefit.requiresContract)}
                />
                {isActivated ? (
                  <Field
                    label="Subsidy Percentage"
                    value={request.benefit.subsidyPercentage || "—"}
                  />
                ) : null}
              </div>
            </Card>
          </Section>

          {!isActivated && !isDeactivated ? (
            <Section title="Request Timeline">
              <Card>
                <div className="flex flex-col gap-4">
                  {timelineEntries.map((timelineEntry) => (
                    <TimelineItem
                      colorClassName={timelineEntry.colorClassName}
                      key={timelineEntry.id}
                      label={timelineEntry.label}
                      timestamp={timelineEntry.timestamp}
                    />
                  ))}
                </div>
              </Card>
            </Section>
          ) : null}

          {!isActivated && !isDeactivated ? (
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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] px-[15.8px] py-[15.8px]">
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

function TimelineItem({
  colorClassName,
  label,
  timestamp,
}: {
  colorClassName: string;
  label: string;
  timestamp: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-2 w-2 shrink-0 rounded-full ${colorClassName}`} />
      <div className="flex flex-col">
        <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{label}</span>
        <span className="text-[12px] leading-4 text-[#737373]">{timestamp}</span>
      </div>
    </div>
  );
}
