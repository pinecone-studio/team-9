"use client";

import { useRef, useState } from "react";

import type { RuleApprovalRequestReviewQuery } from "./approval-requests.graphql";
import RuleApprovalRequestReviewChangeSummarySection from "./RuleApprovalRequestReviewChangeSummarySection";
import RuleApprovalRequestReviewImpactSection from "./RuleApprovalRequestReviewImpactSection";
import RuleApprovalRequestReviewOverviewSection from "./RuleApprovalRequestReviewOverviewSection";
import RuleApprovalRequestReviewSubmissionSection from "./RuleApprovalRequestReviewSubmissionSection";
import RuleApprovalRequestReviewTabs from "./RuleApprovalRequestReviewTabs";
import { useRuleApprovalRequestReviewViewModel } from "./useRuleApprovalRequestReviewViewModel";

type RuleReviewRecord = NonNullable<
  RuleApprovalRequestReviewQuery["ruleApprovalRequestReview"]
>;

type RuleApprovalReviewTab = "change" | "rule";

export default function RuleApprovalRequestReviewBody({
  review,
}: {
  review: RuleReviewRecord;
}) {
  const [activeTab, setActiveTab] = useState<RuleApprovalReviewTab>("rule");
  const { changeSummary, impactPreview } =
    useRuleApprovalRequestReviewViewModel(review);
  const ruleSectionRef = useRef<HTMLElement | null>(null);
  const changeSectionRef = useRef<HTMLElement | null>(null);

  function handleSelectTab(tab: RuleApprovalReviewTab) {
    setActiveTab(tab);
    const targetSection =
      tab === "rule" ? ruleSectionRef.current : changeSectionRef.current;

    targetSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex flex-col gap-6">
      <RuleApprovalRequestReviewTabs
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
      />

      <section ref={ruleSectionRef}>
        <RuleApprovalRequestReviewOverviewSection
          appliedBenefits={review.appliedBenefits}
          overview={review.overview}
        />
      </section>

      <section ref={changeSectionRef}>
        <RuleApprovalRequestReviewChangeSummarySection items={changeSummary} />
      </section>

      <RuleApprovalRequestReviewImpactSection impact={impactPreview} />
      <RuleApprovalRequestReviewSubmissionSection
        request={review.request}
        submissionDetails={review.submissionDetails}
      />
    </div>
  );
}
