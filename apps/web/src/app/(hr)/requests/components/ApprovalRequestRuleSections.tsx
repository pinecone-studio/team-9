import {
  Building2,
  CheckCircle2,
  Users,
} from "lucide-react";

import {
  DetailCard,
  DetailSection,
  LabeledValue,
} from "./ApprovalRequestDetailSections";

export function RuleOverviewSection({
  condition,
  description,
  measurement,
  requirementValue,
  ruleName,
  ruleType,
  technicalExpression,
  valueFieldLabel,
}: {
  condition: string;
  description: string;
  measurement: string;
  requirementValue: string;
  ruleName: string;
  ruleType: string;
  technicalExpression: string;
  valueFieldLabel: string;
}) {
  return (
    <DetailSection title="Configuration Overview">
      <DetailCard>
        <div className="flex flex-col gap-4">
          <LabeledValue
            label="Rule Name"
            value={ruleName}
            valueClassName="text-[18px] leading-7 font-semibold text-[#0A0A0A]"
          />
          <div className="flex flex-col gap-1">
            <div className="text-[12px] leading-4 text-[#737373]">Description</div>
            <p className="text-[14px] leading-5 text-[#0A0A0A]">{description}</p>
          </div>
          <div className="grid gap-y-4 border-t border-[#E5E5E5] py-4 md:grid-cols-2">
            <LabeledValue label="Rule Type" value={ruleType} />
            <LabeledValue label="Field HR Should Check" value={valueFieldLabel} />
            <LabeledValue label="Requirement Value" value={requirementValue} />
            <LabeledValue label="Measurement" value={measurement} />
          </div>
          <div className="border-t border-[#E5E5E5] pt-3">
            <div className="text-[12px] leading-4 text-[#737373]">Condition</div>
            <div className="mt-1 text-[14px] leading-5 text-[#0A0A0A]">{condition}</div>
          </div>
          <div className="border-t border-[#E5E5E5] pt-3">
            <div className="text-[12px] leading-4 text-[#737373]">Technical Expression</div>
            <div className="mt-1 rounded-[4px] border border-[#E5E5E5] bg-white px-3 py-2 font-mono text-[14px] leading-5 text-[#0A0A0A]">
              {technicalExpression}
            </div>
          </div>
        </div>
      </DetailCard>
    </DetailSection>
  );
}

export function RuleImpactSection({
  affectedEmployees,
  eligibilityEffect = "Restrictive",
  ruleUsageCount,
  summary = "This rule will restrict eligibility for employees who do not meet the required condition.",
}: {
  affectedEmployees: number | string;
  eligibilityEffect?: string;
  ruleUsageCount: number;
  summary?: string;
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
            <Building2 className="h-5 w-5 text-[#737373]" />
            <LabeledValue
              label="Benefits will use Rule"
              value={ruleUsageCount}
              valueClassName="text-[18px] leading-7 font-semibold text-[#0A0A0A]"
            />
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#737373]" />
            <LabeledValue
              label="Eligibility Effect"
              value={eligibilityEffect}
              valueClassName="text-[18px] leading-7 font-semibold capitalize text-[#0A0A0A]"
            />
          </div>
        </div>
        <div className="mt-4 border-t border-[#E5E5E5] pt-3 text-[14px] leading-5 text-[#737373]">
          {summary}
        </div>
      </DetailCard>
    </DetailSection>
  );
}

export function RuleAppliedBenefitsSection({
  linkedBenefits,
  ruleUsageCount,
}: {
  linkedBenefits: Array<{ id?: string; name?: string }>;
  ruleUsageCount: number;
}) {
  return (
    <DetailSection
      action={
        <span className="text-[12px] leading-4 text-[#737373]">
          {`${ruleUsageCount} benefit${ruleUsageCount === 1 ? "" : "s"} use this rule`}
        </span>
      }
      title="Applied Benefits"
    >
      <DetailCard>
        <div className="flex flex-wrap gap-2">
          {linkedBenefits.length > 0 ? (
            linkedBenefits.map((benefit, index) => (
              <span
                className="inline-flex items-center rounded-[8px] bg-[#F5F5F5] px-3 py-1.5 text-[14px] leading-5 font-medium text-[#171717]"
                key={`${benefit.id ?? benefit.name ?? "benefit"}-${index}`}
              >
                {benefit.name}
              </span>
            ))
          ) : (
            <span className="text-[14px] leading-5 text-[#737373]">
              Linked benefits will appear here when available.
            </span>
          )}
        </div>
      </DetailCard>
    </DetailSection>
  );
}
