import {
  AlertCircle,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileText,
  UserRound,
} from "lucide-react";

import { StatusBadge } from "./RequestsUi";
import type { BenefitReviewDetail } from "./benefit-review-details";

const snapshotIcons = [
  UserRound,
  Building2,
  BadgeCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
];

export default function BenefitRequestReviewDialogContent({
  detail,
}: {
  detail: BenefitReviewDetail;
}) {
  return (
    <div className="flex-1 space-y-5 overflow-y-auto pr-1">
      <section className="grid grid-cols-1 gap-4 rounded-[10px] border border-[#E5E5E5] bg-[#F5F5F54D] p-4 sm:grid-cols-2">
        <div className="space-y-3">
          <KeyValue label="Employee" primary={detail.employee} secondary={detail.position} />
          <KeyValue label="Category" primary={detail.category} />
          <div className="space-y-1.5">
            <p className="text-[12px] leading-4 text-[#737373]">Status</p>
            <StatusBadge status={detail.status} />
          </div>
        </div>
        <div className="space-y-3">
          <KeyValue label="Benefit" primary={detail.title} />
          <KeyValue label="Submitted" primary={detail.submittedAt} />
          <KeyValue label="Approval Route" primary={detail.approvalRoute} />
        </div>
      </section>

      <SectionTitle title="Employee Snapshot" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {detail.snapshot.map((item, index) => {
          const Icon = snapshotIcons[index % snapshotIcons.length];
          return (
            <div className="flex items-center gap-2" key={`${item.label}-${item.value}`}>
              <Icon className="h-4 w-4 text-[#737373]" />
              <div>
                <p className="text-[12px] leading-4 text-[#737373]">{item.label}</p>
                <p className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Divider />
      <SectionTitle title="Eligibility Checks" />
      <div className="flex flex-wrap gap-x-7 gap-y-2">
        {detail.eligibilityChecks.map((item) => (
          <div className="flex items-center gap-2" key={item}>
            <CheckCircle2 className="h-4 w-4 text-[#00C950]" />
            <span className="text-[14px] leading-5 text-[#0A0A0A]">{item}</span>
          </div>
        ))}
      </div>

      <Divider />
      <SectionTitle title="Contract" />
      <section className="rounded-[10px] border border-[#E5E5E5] p-3">
        <KeyLine label="Status" value={detail.contract.status} valueClassName="text-[#00A63E]" />
        <KeyLine label="Version" value={detail.contract.version} />
        <KeyLine label="Accepted at" value={detail.contract.acceptedAt} />
        <button
          className="mt-3 inline-flex h-8 w-full items-center justify-center gap-2 rounded-[8px] border border-[#E5E5E5] bg-white text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
          type="button"
        >
          <FileText className="h-4 w-4" />
          View Contract
        </button>
      </section>

      <Divider />
      <SectionTitle title="Approval Progress" />
      <div className="flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FEF3C6]">
          <AlertCircle className="h-3.5 w-3.5 text-[#BB4D00]" />
        </div>
        <span className="text-[14px] leading-5 text-[#737373]">{detail.progress}</span>
      </div>

      <Divider />
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-[#0A0A0A]" />
        <SectionTitle title="Audit Log" />
      </div>
      <div className="space-y-1">
        {detail.auditLog.map((item, index) => (
          <div className="flex items-start gap-3" key={`${item.event}-${index}`}>
            <div className="mt-2 h-1.5 w-1.5 rounded-full bg-[#73737366]" />
            <div className="pb-2">
              <p className="text-[14px] leading-5 text-[#0A0A0A]">{item.event}</p>
              <p className="text-[12px] leading-4 text-[#737373]">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-[#E5E5E5]" />;
}

function KeyLine({
  label,
  value,
  valueClassName = "text-[#0A0A0A]",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-[14px] leading-5 text-[#737373]">{label}</span>
      <span className={`text-[14px] leading-5 font-medium ${valueClassName}`}>{value}</span>
    </div>
  );
}

function KeyValue({
  label,
  primary,
  secondary,
}: {
  label: string;
  primary: string;
  secondary?: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[12px] leading-4 text-[#737373]">{label}</p>
      <p className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{primary}</p>
      {secondary ? <p className="text-[14px] leading-5 text-[#737373]">{secondary}</p> : null}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">{title}</h3>;
}
