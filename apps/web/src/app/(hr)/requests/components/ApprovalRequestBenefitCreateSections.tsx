import {
  CheckCircle2,
  Eye,
  FileText,
  StickyNote,
  Users,
} from "lucide-react";

import {
  DetailCard,
  DetailSection,
  LabeledValue,
} from "./ApprovalRequestDetailSections";

export function BenefitCreateOverviewSection({
  approverName,
  approverRole,
  benefitName,
  category,
  contractStatusLabel,
  description,
  requiresContract,
  subsidy,
  vendorName,
}: {
  approverName: string;
  approverRole: string;
  benefitName: string;
  category: string;
  contractStatusLabel: string;
  description: string;
  requiresContract: string;
  subsidy: string;
  vendorName: string;
}) {
  return (
    <DetailSection title="Configuration Overview">
      <DetailCard>
        <div className="flex flex-col gap-4">
          <LabeledValue
            label="Benefit Name"
            value={benefitName}
            valueClassName="text-[18px] leading-7 font-semibold text-[#0A0A0A]"
          />
          <div className="flex flex-col gap-1">
            <div className="text-[12px] leading-4 text-[#737373]">Description</div>
            <p className="text-[14px] leading-5 text-[#0A0A0A]">{description}</p>
          </div>
          <div className="grid gap-y-4 border-t border-[#E5E5E5] py-4 md:grid-cols-3">
            <LabeledValue label="Category" value={category} />
            <LabeledValue label="Subsidy" value={subsidy} />
            <LabeledValue label="Vendor" value={vendorName} />
          </div>
          <div className="grid gap-y-4 border-t border-[#E5E5E5] pt-3 md:grid-cols-2">
            <LabeledValue label="Core Benefit" value="No" />
            <LabeledValue label="Requires Contract" value={requiresContract} />
          </div>
          <div className="border-t border-[#E5E5E5] pt-3">
            <div className="text-[12px] leading-4 text-[#737373]">Contract Status</div>
            <div className="mt-2">
              <span className="inline-flex items-center gap-[6px] rounded-[4px] bg-[#DCFCE7] px-2 py-[2px] text-[12px] leading-4 font-medium text-[#016630]">
                <StickyNote className="h-3 w-3" />
                {contractStatusLabel}
              </span>
            </div>
          </div>
          <div className="grid gap-y-4 border-t border-[#E5E5E5] pt-3 md:grid-cols-2">
            <LabeledValue label="Approver Role" value={approverRole} />
            <LabeledValue label="Specific Approver" value={approverName} />
          </div>
        </div>
      </DetailCard>
    </DetailSection>
  );
}

export function BenefitCreateContractSection({
  fileName,
}: {
  fileName: string;
}) {
  return (
    <DetailSection title="Contract File">
      <DetailCard className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <FileText className="h-8 w-8 shrink-0 text-[#737373]" />
          <div className="min-w-0">
            <div className="truncate text-[14px] leading-5 font-medium text-[#0A0A0A]">
              {fileName}
            </div>
            <div className="text-[12px] leading-4 text-[#737373]">
              Uploaded with this request
            </div>
          </div>
        </div>
        <button
          className="inline-flex h-8 shrink-0 items-center gap-2 rounded-[4px] border border-[#E5E5E5] bg-white px-3 text-[14px] leading-5 font-medium text-[#0A0A0A] opacity-60"
          disabled
          type="button"
        >
          <Eye className="h-4 w-4" />
          View
        </button>
      </DetailCard>
    </DetailSection>
  );
}

export function BenefitCreateEligibilitySection({
  attachedRuleNames,
  attachedRulesLabel,
}: {
  attachedRuleNames: string[];
  attachedRulesLabel: string;
}) {
  return (
    <DetailSection
      action={<span className="text-[12px] leading-4 text-[#737373]">{attachedRulesLabel}</span>}
      title="Eligibility Rules"
    >
      <DetailCard>
        <div className="flex flex-wrap gap-2">
          {attachedRuleNames.length > 0 ? (
            attachedRuleNames.map((name, index) => (
              <span
                className="inline-flex items-center rounded-[8px] bg-[#F5F5F5] px-3 py-1.5 text-[14px] leading-5 font-medium text-[#171717]"
                key={`${name}-${index}`}
              >
                {name}
              </span>
            ))
          ) : (
            <span className="text-[14px] leading-5 text-[#737373]">
              No eligibility rules were attached to this request.
            </span>
          )}
        </div>
      </DetailCard>
    </DetailSection>
  );
}

export function BenefitCreateImpactSection({
  affectedEmployees,
  newlyEligible,
}: {
  affectedEmployees: number | string;
  newlyEligible: string;
}) {
  return (
    <DetailSection title="Impact Preview">
      <DetailCard>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-[#737373]" />
            <LabeledValue
              label="Affected Employees"
              value={affectedEmployees}
              valueClassName="text-[18px] leading-7 font-semibold text-[#0A0A0A]"
            />
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#00A63E]" />
            <LabeledValue
              label="Newly Eligible"
              value={newlyEligible}
              valueClassName="text-[18px] leading-7 font-semibold text-[#00A63E]"
            />
          </div>
        </div>
        <div className="mt-4 border-t border-[#E5E5E5] pt-3 text-[14px] leading-5 text-[#737373]">
          This benefit will become available to employees who meet the attached eligibility rules.
        </div>
      </DetailCard>
    </DetailSection>
  );
}
