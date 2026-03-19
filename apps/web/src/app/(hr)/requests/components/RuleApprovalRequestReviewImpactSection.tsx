import type { ReactNode } from "react";
import { Scale, Sprout, TriangleAlert, Users } from "lucide-react";

import { DetailCard, DetailSection } from "./ApprovalRequestDetailSections";
import type { RuleApprovalReviewImpactPreview } from "./useRuleApprovalRequestReviewViewModel";

function formatSignedValue(value: number) {
  return value > 0 ? `+${value}` : String(value);
}

function getDeltaLabel(value: number) {
  if (value < 0) return "Newly restricted";
  if (value > 0) return "Newly eligible";
  return "No net change";
}

function getDeltaValueClassName(value: number) {
  if (value < 0) return "text-[#E17100]";
  if (value > 0) return "text-[#008236]";
  return "text-[#0A0A0A]";
}

function getEffectValueClassName(effect: string) {
  if (effect === "Expanded") return "text-[#008236]";
  if (effect === "Restrictive") return "text-[#0A0A0A]";
  return "text-[#737373]";
}

function StatItem(props: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  const { icon, label, value, valueClassName = "text-[#0A0A0A]" } = props;

  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0 text-[#737373]">{icon}</div>
      <div className="flex flex-col">
        <span className={`text-[14px] leading-5 font-medium ${valueClassName}`}>
          {value}
        </span>
        <span className="text-[12px] leading-4 text-[#737373]">{label}</span>
      </div>
    </div>
  );
}

export default function RuleApprovalRequestReviewImpactSection({
  impact,
}: {
  impact: RuleApprovalReviewImpactPreview;
}) {
  return (
    <DetailSection title="Impact Preview">
      <DetailCard>
        <div className="grid gap-4 sm:grid-cols-2">
          <StatItem
            icon={<Users className="h-5 w-5" />}
            label="Affected employees"
            value={impact.affectedEmployees}
          />
          <StatItem
            icon={<TriangleAlert className="h-5 w-5 text-[#E17100]" />}
            label={getDeltaLabel(impact.newlyRestrictedEmployees)}
            value={formatSignedValue(impact.newlyRestrictedEmployees)}
            valueClassName={getDeltaValueClassName(impact.newlyRestrictedEmployees)}
          />
          <StatItem
            icon={<Sprout className="h-5 w-5" />}
            label="Benefits using this rule"
            value={impact.benefitsUsingRule}
          />
          <StatItem
            icon={<Scale className="h-5 w-5" />}
            label="Eligibility change"
            value={impact.eligibilityEffect}
            valueClassName={`${getEffectValueClassName(impact.eligibilityEffect)} capitalize`}
          />
        </div>
      </DetailCard>
    </DetailSection>
  );
}
