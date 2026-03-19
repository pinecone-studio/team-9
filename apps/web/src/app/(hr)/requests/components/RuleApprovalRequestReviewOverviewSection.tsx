import type { RuleApprovalRequestReviewQuery } from "./approval-requests.graphql";
import {
  DetailCard,
  DetailSection,
  LabeledValue,
} from "./ApprovalRequestDetailSections";

type ReviewRecord = NonNullable<
  RuleApprovalRequestReviewQuery["ruleApprovalRequestReview"]
>;

type RuleApprovalRequestReviewOverviewSectionProps = {
  appliedBenefits: ReviewRecord["appliedBenefits"];
  overview: ReviewRecord["overview"];
};

export default function RuleApprovalRequestReviewOverviewSection({
  appliedBenefits,
  overview,
}: RuleApprovalRequestReviewOverviewSectionProps) {
  return (
    <DetailSection title="Configuration Overview">
      <DetailCard>
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] leading-7 font-semibold text-[#0A0A0A]">
            {overview.ruleName}
          </h3>
          <LabeledValue label="Rule Type" value={overview.ruleTypeLabel} />
          <div className="flex flex-col gap-1">
            <div className="text-[12px] leading-4 text-[#737373]">Condition</div>
            <div className="rounded-[4px] border border-[#E5E5E5] bg-white px-3 py-2 font-mono text-[14px] leading-5 text-[#0A0A0A]">
              {overview.technicalExpression}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-[12px] leading-4 text-[#737373]">
              Blocking Message
            </div>
            <p className="text-[14px] leading-5 text-[#0A0A0A]">
              {overview.description}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-[12px] leading-4 text-[#737373]">
              Target Benefits
            </div>
            <div className="flex flex-wrap gap-2">
              {appliedBenefits.length > 0 ? (
                appliedBenefits.map((benefit) => (
                  <span
                    className="inline-flex items-center rounded-[4px] border border-[#E5E5E5] px-[10px] py-1 text-[12px] leading-4 font-medium text-[#0A0A0A]"
                    key={benefit.id}
                  >
                    {benefit.name}
                  </span>
                ))
              ) : (
                <span className="text-[14px] leading-5 text-[#737373]">
                  No linked benefits were found for this rule.
                </span>
              )}
            </div>
          </div>
        </div>
      </DetailCard>
    </DetailSection>
  );
}
