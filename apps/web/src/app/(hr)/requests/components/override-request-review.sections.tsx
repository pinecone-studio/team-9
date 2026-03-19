import { Shield } from "lucide-react";

import type { ReturnTypeOverrideViewModel } from "./override-request-review.types";

function StatusBadge({ status }: { status: string }) {
  const isPending = status === "Pending";
  return <span className={`inline-flex h-[22px] items-center rounded-[4px] px-2 py-[2px] text-[12px] leading-4 font-medium ${isPending ? "bg-[#FEF3C6] text-[#973C00]" : "bg-[#DCFCE7] text-[#016630]"}`}>{status}</span>;
}

function SectionCard({ children, title }: { children: React.ReactNode; title: string }) {
  return <section className="flex flex-col gap-3"><h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">{title}</h3><div className="rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] p-[15.8px]">{children}</div></section>;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return <div className="flex flex-col gap-0.5"><span className="text-[12px] leading-4 text-[#737373]">{label}</span><span className="text-[14px] leading-5 text-[#0A0A0A]">{value}</span></div>;
}

export function OverrideRequestReviewContent({
  loading,
  viewModel,
}: {
  loading: boolean;
  viewModel: ReturnTypeOverrideViewModel | null;
}) {
  if (loading || !viewModel) {
    return <div className="h-[400px] animate-pulse rounded-[10px] bg-slate-100" />;
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="inline-flex h-[22px] w-fit items-center gap-2 rounded-[8px] border border-[#FEE685] bg-[#FFFBEB] px-2 py-[2px] text-[12px] leading-4 font-medium text-[#BB4D00]">
        <Shield className="h-3 w-3 stroke-[1.8]" />
        Override Request
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
      <SectionCard title="Benefit to Override">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          <DetailItem label="Benefit" value={viewModel.benefitName} />
          <DetailItem label="Category" value={viewModel.benefitCategory} />
          <div className="flex flex-col gap-[6px]">
            <span className="text-[12px] leading-4 text-[#737373]">Current Status</span>
            <span className="inline-flex h-[21.6px] w-fit items-center rounded-[8px] border border-[#FFC9C9] bg-[#FEF2F2] px-[7.8px] py-[1.8px] text-[12px] leading-4 font-medium text-[#C10007]">
              {viewModel.currentStatus}
            </span>
          </div>
          <DetailItem label="Blocking Reason" value={viewModel.blockingReason} />
        </div>
      </SectionCard>
      <SectionCard title="Override Details">
        <div className="flex flex-col gap-4">
          <DetailItem label="Justification" value={viewModel.justification} />
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <DetailItem label="Override Type" value={viewModel.overrideType} />
            <DetailItem label="Expiry Date" value={viewModel.expiryDate} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
