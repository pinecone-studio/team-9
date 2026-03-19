import type { ApprovalRequestQuery } from "./approval-requests.graphql";
import {
  ChangeSummaryRow,
  DetailSection,
  SubmissionDetailsCard,
} from "./ApprovalRequestDetailSections";
import { AuditLogSection } from "./ApprovalRequestAuditLogSection";
import {
  RuleAppliedBenefitsSection,
  RuleImpactSection,
  RuleOverviewSection,
} from "./ApprovalRequestRuleSections";
import ApprovalRequestStatusBadge from "./ApprovalRequestStatusBadge";
import { useResolvedPersonName } from "./RequestPeopleContext";
import {
  formatApprovalRole,
  parseApprovalPayload,
  parseApprovalSnapshot,
} from "./approval-request-utils";
import {
  formatRuleTypeLabel,
  getRuleChangeRows,
  getRuleFieldLabel,
  getRuleTechnicalExpression,
  parseLinkedBenefits,
  parseRuleJsonScalar,
  type RuleShape,
} from "./approval-request-rule-utils";
import {
  formatDetailDateTime,
  formatDetailDateTimeWithAt,
} from "./request-detail-formatters";

type RequestRecord = NonNullable<ApprovalRequestQuery["approvalRequest"]>;

export default function ApprovalRequestRuleDetails({
  request,
}: {
  request: RequestRecord;
}) {
  const parsedPayload = parseApprovalPayload(request);
  const snapshot = parseApprovalSnapshot(request) as RuleShape | null;
  const currentRule =
    parsedPayload.entityType === "rule"
      ? ({
          defaultOperator: parsedPayload.rule?.defaultOperator,
          defaultUnit: parsedPayload.rule?.defaultUnit,
          defaultValue: parsedPayload.rule?.defaultValue,
          description: parsedPayload.rule?.description,
          name: parsedPayload.rule?.name,
          ruleType: parsedPayload.rule?.ruleType,
        } satisfies RuleShape)
      : ({} satisfies RuleShape);
  const previousRule = request.action_type === "update" ? snapshot : null;
  const linkedBenefits = parseLinkedBenefits(snapshot?.linked_benefits_json);
  const requirementValue = parseRuleJsonScalar(currentRule.defaultValue);
  const technicalExpression = getRuleTechnicalExpression(
    currentRule.ruleType,
    currentRule.defaultOperator,
    requirementValue,
  );
  const changeRows = getRuleChangeRows(currentRule, previousRule);
  const requesterName = useResolvedPersonName(request.requested_by);
  const reviewedByName = useResolvedPersonName(request.reviewed_by);
  const reviewerName =
    reviewedByName !== "-" ? reviewedByName : formatApprovalRole(request.target_role);
  const isCreate = request.action_type === "create";
  const affectedEmployees =
    typeof snapshot?.usage_count === "number" && snapshot.usage_count > 0
      ? snapshot.usage_count * 12
      : "-";
  const ruleUsageCount =
    linkedBenefits.length > 0
      ? linkedBenefits.length
      : typeof snapshot?.usage_count === "number"
        ? snapshot.usage_count
        : 0;

  const auditEntries = [
    {
      actor: "Employee",
      id: "submitted",
      label: "Request submitted",
      timestamp: request.created_at,
    },
    {
      actor: "System",
      id: "eligibility",
      label: "Eligibility validated",
      timestamp: request.created_at,
    },
    request.status === "pending"
      ? {
          actor: "System",
          id: "route",
          label: `Routed to ${formatApprovalRole(request.target_role)}`,
          timestamp: request.created_at,
        }
      : null,
  ].filter((entry): entry is { actor: string; id: string; label: string; timestamp: string } => Boolean(entry));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-[26px] items-center justify-center rounded-[4px] border border-[#E5E5E5] bg-white px-2 text-[14px] leading-5 font-medium text-[#0A0A0A]">
          Rule
        </span>
        <span
          className={`inline-flex h-[26px] items-center justify-center rounded-[4px] px-3 text-[12px] leading-4 font-medium ${
            isCreate ? "bg-[#DCFCE7] text-[#008236]" : "bg-[#F5F5F5] text-[#171717]"
          }`}
        >
          {isCreate ? "New Rule" : "Change"}
        </span>
      </div>

      <RuleOverviewSection
        condition={currentRule.description?.trim() || previousRule?.description || "-"}
        description={currentRule.description?.trim() || previousRule?.description || "-"}
        measurement={currentRule.defaultUnit?.trim() || previousRule?.defaultUnit || "-"}
        requirementValue={requirementValue}
        ruleName={currentRule.name?.trim() || previousRule?.name || "Untitled Rule"}
        ruleType={formatRuleTypeLabel(currentRule.ruleType || previousRule?.rule_type)}
        technicalExpression={technicalExpression}
        valueFieldLabel={getRuleFieldLabel(currentRule.ruleType || previousRule?.rule_type)}
      />

      {!isCreate && changeRows.length > 0 ? (
        <DetailSection title="Change Summary">
          <div className="flex flex-col gap-2">
            {changeRows.map((row) => (
              <ChangeSummaryRow
                key={row.label}
                label={row.label}
                nextValue={row.nextValue}
                previousValue={row.previousValue}
              />
            ))}
          </div>
        </DetailSection>
      ) : null}

      <RuleImpactSection
        affectedEmployees={affectedEmployees}
        ruleUsageCount={ruleUsageCount}
      />

      <RuleAppliedBenefitsSection
        linkedBenefits={linkedBenefits}
        ruleUsageCount={ruleUsageCount}
      />

      <DetailSection title="Submission Details">
        <SubmissionDetailsCard
          approverName={reviewerName}
          approverSubtitle={formatApprovalRole(request.target_role)}
          requesterName={requesterName}
          requesterSubtitle={formatApprovalRole(request.target_role)}
          statusBadge={<ApprovalRequestStatusBadge pendingLabel="Pending" status={request.status} variant="pill" />}
          submittedAt={formatDetailDateTime(request.created_at)}
        />
      </DetailSection>

      <div className="h-px w-full bg-[#E5E5E5]" />

      <AuditLogSection
        entries={auditEntries}
        formatTimestamp={formatDetailDateTimeWithAt}
      />
    </div>
  );
}
