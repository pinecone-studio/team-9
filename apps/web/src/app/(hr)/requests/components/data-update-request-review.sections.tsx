import { Clock3, Pencil } from "lucide-react";

import type { DataUpdateReviewViewModel } from "./data-update-request-review.types";

function DetailItem({ label, value }: { label: string; value: string }) {
  return <div className="flex flex-col gap-0.5"><span className="text-[12px] leading-4 text-[#737373]">{label}</span><span className="text-[14px] leading-5 text-[#0A0A0A]">{value}</span></div>;
}

function StatusBadge({ status }: { status: string }) {
  return <span className="inline-flex h-[22px] items-center gap-[6px] rounded-[4px] bg-[#FEF3C6] px-2 py-[2px] text-[12px] leading-4 font-medium text-[#973C00]"><Clock3 className="h-3 w-3" />{status}</span>;
}

function SectionCard({ children, title }: { children: React.ReactNode; title: string }) {
  return <section className="flex flex-col gap-3"><h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">{title}</h3><div className="rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] p-[15.8px]">{children}</div></section>;
}

function ChangeCard({
  label,
  nextValue,
  previousValue,
}: {
  label: string;
  nextValue: string;
  previousValue: string;
}) {
  return (
    <div className="rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] px-[11.8px] py-[11.8px]">
      <p className="text-[12px] leading-4 text-[#737373]">{label}</p>
      <div className="mt-1 flex items-center gap-2 text-[14px] leading-5">
        <span className="text-[#737373] line-through">{previousValue}</span>
        <span className="text-[#737373]">→</span>
        <span className="font-medium text-[#0A0A0A]">{nextValue}</span>
      </div>
    </div>
  );
}

export function DataUpdateRequestReviewContent({
  loading,
  viewModel,
}: {
  loading: boolean;
  viewModel: DataUpdateReviewViewModel | null;
}) {
  if (loading || !viewModel) {
    return <div className="h-[320px] animate-pulse rounded-[10px] bg-slate-100" />;
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="inline-flex h-[22px] w-fit items-center gap-2 rounded-[8px] border border-[#BEDBFF] bg-[#EFF6FF] px-2 py-[2px] text-[12px] leading-4 font-medium text-[#1447E6]">
        <Pencil className="h-3 w-3" />
        Data Update Request
      </div>
      <div className="rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] p-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          <DetailItem label="Submitted By" value={viewModel.submittedBy} />
          <DetailItem label="Assigned To" value={viewModel.reviewerName} />
          <DetailItem label="" value={viewModel.submittedByRole} />
          <DetailItem label="" value={viewModel.reviewerRole} />
          <DetailItem label="Submitted At" value={viewModel.submittedAt} />
          <div className="flex flex-col gap-[6px]">
            <span className="text-[12px] leading-4 text-[#737373]">Status</span>
            <StatusBadge status={viewModel.statusLabel} />
          </div>
        </div>
      </div>
      <div className="h-px w-full bg-[#E5E5E5]" />
      <SectionCard title="Employee">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          <DetailItem label="Name" value={viewModel.employeeName} />
          <DetailItem label="Role" value={viewModel.employeeRole} />
          <DetailItem label="Department" value={viewModel.employeeDepartment} />
          <DetailItem label="Employment Status" value={viewModel.employmentStatus} />
        </div>
      </SectionCard>
      <section className="flex flex-col gap-3">
        <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Requested Changes</h3>
        <div className="flex flex-col gap-2">
          {viewModel.requestedChanges.map((change) => (
            <ChangeCard key={change.label} label={change.label} nextValue={change.nextValue} previousValue={change.previousValue} />
          ))}
        </div>
      </section>
    </div>
  );
}
