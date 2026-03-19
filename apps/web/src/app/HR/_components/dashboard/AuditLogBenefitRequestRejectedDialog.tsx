"use client";

import { useEffect } from "react";
import { Gift, X } from "lucide-react";

import {
  formatDetailDateTimeWithAt,
  formatDetailYesNo,
} from "@/app/(hr)/requests/components/request-detail-formatters";
import type { AuditLogBenefitRequestDetail } from "./audit-log-types";

type AuditLogBenefitRequestRejectedDialogProps = {
  onClose: () => void;
  request: AuditLogBenefitRequestDetail;
};

export default function AuditLogBenefitRequestRejectedDialog({
  onClose,
  request,
}: AuditLogBenefitRequestRejectedDialogProps) {
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverscrollBehavior = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscrollBehavior;
    };
  }, []);

  const reviewerName = request.reviewed_by?.name?.trim() || "Unassigned reviewer";
  const reviewerRole =
    request.approval_role === "finance_manager" ? "Finance Manager" : "HR Admin";
  const rejectionReason =
    request.reviewComment?.trim() ||
    "No rejection reason was saved for this request.";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-hidden bg-black/50 px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        aria-modal="true"
        className="hidden-scrollbar relative mx-auto flex max-h-[calc(100vh-48px)] w-full max-w-[506px] flex-col items-start gap-4 overflow-y-auto overscroll-none rounded-[10px] border border-[#E5E5E5] bg-white px-[25px] py-[30px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
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
              Benefit Request Rejected
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
                <Field
                  label="Timestamp"
                  value={formatDetailDateTimeWithAt(request.updated_at)}
                />
                <Field label="Event Type" value="Benefit Request Rejected" />
                <div className="flex flex-col gap-[6px]">
                  <span className="text-[12px] leading-4 text-[#737373]">Result</span>
                  <span className="inline-flex w-fit items-center justify-center rounded-[8px] bg-[#FFE2E2] px-[7.8px] py-[1.8px] text-[12px] leading-4 font-medium text-[#9F0712]">
                    Rejected
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] leading-4 text-[#737373]">Reviewed By</span>
                  <span className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
                    {reviewerName}
                  </span>
                  <span className="text-[12px] leading-4 text-[#737373]">{reviewerRole}</span>
                </div>
              </div>
            </Card>
          </Section>

          <Section title="Submission Details">
            <Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Submitted By" value={request.employee.name} />
                <Field
                  label="Submitted At"
                  value={formatDetailDateTimeWithAt(request.created_at)}
                />
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
                <Field
                  label="Requires Contract"
                  value={formatDetailYesNo(request.benefit.requiresContract)}
                />
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
            <div className="w-full rounded-[10px] border border-[#FFC9C9] bg-[#FEF2F2] px-[15.8px] py-[15.8px]">
              <p className="text-[14px] leading-5 text-[#C10007]">{rejectionReason}</p>
            </div>
          </Section>
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
