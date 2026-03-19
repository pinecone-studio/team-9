import { useBenefitCreateRuleDetailsQuery } from "@/shared/apollo/generated";
import type { ApprovalRequestQuery } from "./approval-requests.graphql";
import {
  DetailSection,
  SubmissionDetailsCard,
} from "./ApprovalRequestDetailSections";
import {
  BenefitCreateContractSection,
  BenefitCreateEligibilitySection,
  BenefitCreateImpactSection,
  BenefitCreateOverviewSection,
} from "./ApprovalRequestBenefitCreateSections";
import ApprovalRequestStatusBadge from "./ApprovalRequestStatusBadge";
import {
  resolveRequestPerson,
  useRequestPeople,
  useResolvedPersonName,
} from "./RequestPeopleContext";
import {
  formatApprovalRole,
  parseApprovalPayload,
} from "./approval-request-utils";
import {
  type BenefitCreateContractUpload,
  type BenefitCreateRuleAssignment,
  type BenefitCreateShape,
  parseBenefitCreatePayloadRecord,
} from "./approval-request-benefit-create-data";
import {
  formatDetailDate,
  formatDetailDateTime,
  formatDetailSubsidy,
  formatDetailYesNo,
} from "./request-detail-formatters";

type RequestRecord = NonNullable<ApprovalRequestQuery["approvalRequest"]>;

export default function ApprovalRequestBenefitCreateDetails({
  request,
}: {
  request: RequestRecord;
}) {
  const parsedPayload = parseApprovalPayload(request);
  const rawPayload = parseBenefitCreatePayloadRecord(request.payload_json);
  const benefit =
    parsedPayload.entityType === "benefit"
      ? (parsedPayload.benefit as BenefitCreateShape | null)
      : null;
  const ruleAssignments =
    parsedPayload.entityType === "benefit"
      ? (parsedPayload.ruleAssignments as BenefitCreateRuleAssignment[])
      : [];
  const contractUpload =
    parsedPayload.entityType === "benefit" && "contractUpload" in rawPayload
      ? (rawPayload.contractUpload as BenefitCreateContractUpload | null)
      : null;
  const { data } = useBenefitCreateRuleDetailsQuery({
    fetchPolicy: "cache-first",
  });
  const people = useRequestPeople();

  const ruleNameMap = new Map((data?.ruleDefinitions ?? []).map((rule) => [rule.id, rule.name]));
  const attachedRuleNames = ruleAssignments.map((rule, index) => {
    const resolved = rule.ruleId ? ruleNameMap.get(rule.ruleId) : null;
    return resolved || `Rule ${index + 1}`;
  });
  const affectedEmployees = data?.employees?.length ?? null;
  const requesterName = useResolvedPersonName(request.requested_by);
  const reviewerName = useResolvedPersonName(request.reviewed_by);
  const requester = resolveRequestPerson(people, request.requested_by);
  const reviewer = resolveRequestPerson(people, request.reviewed_by);
  const specificApprover = reviewerName !== "-" ? reviewerName : formatApprovalRole(request.target_role);
  const contractStatusLabel = contractUpload ? "Contract Attached" : "No Contract";
  const contractFileLabel = contractUpload?.fileName || "contract.pdf";
  const rulesAttachedLabel = `${attachedRuleNames.length} rule${attachedRuleNames.length === 1 ? "" : "s"} attached`;
  const newlyEligibleLabel = affectedEmployees !== null ? `+${affectedEmployees}` : "-";
  const benefitName = benefit?.name?.trim() || "Untitled Benefit";
  const description = benefit?.description?.trim() || "-";
  const category = benefit?.category?.trim() || "-";
  const coreBenefitLabel = formatDetailYesNo(benefit?.isCore);
  const subsidy = formatDetailSubsidy(benefit?.subsidyPercent);
  const vendorName = benefit?.vendorName?.trim() || "-";
  const requiresContract = formatDetailYesNo(benefit?.requiresContract);
  const contractFileMeta = contractUpload
    ? `Uploaded by ${requesterName} on ${formatDetailDate(request.created_at)}`
    : "";
  const requesterSubtitle = requester?.position?.trim() || "Requester";
  const approverSubtitle =
    reviewer?.position?.trim() || formatApprovalRole(request.target_role);

  return (
    <div className="flex flex-col gap-6 font-[family-name:var(--font-geist-sans)]">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-[26px] items-center justify-center rounded-[8px] border border-[#E5E5E5] bg-white px-[9px] text-[14px] leading-5 font-medium capitalize text-[#0A0A0A]">
          Benefit
        </span>
        <span className="inline-flex h-[26px] items-center justify-center rounded-[8px] bg-[#DCFCE7] px-[13px] text-[12px] leading-4 font-medium text-[#008236]">
          New Benefit
        </span>
      </div>

      <BenefitCreateOverviewSection
        approverName={specificApprover}
        approverRole={formatApprovalRole(request.target_role)}
        benefitName={benefitName}
        category={category}
        coreBenefitLabel={coreBenefitLabel}
        contractStatusLabel={contractStatusLabel}
        description={description}
        requiresContract={requiresContract}
        subsidy={subsidy}
        vendorName={vendorName}
      />

      {contractUpload ? (
        <BenefitCreateContractSection
          fileMeta={contractFileMeta}
          fileName={contractFileLabel}
        />
      ) : null}

      <BenefitCreateEligibilitySection
        attachedRuleNames={attachedRuleNames}
        attachedRulesLabel={rulesAttachedLabel}
      />

      <BenefitCreateImpactSection
        affectedEmployees={affectedEmployees ?? "-"}
        newlyEligible={newlyEligibleLabel}
      />

      <DetailSection title="Submission Details">
        <SubmissionDetailsCard
          approverName={specificApprover}
          approverSubtitle={approverSubtitle}
          requesterName={requesterName}
          requesterSubtitle={requesterSubtitle}
          statusBadge={<ApprovalRequestStatusBadge status={request.status} variant="soft" />}
          submittedAt={formatDetailDateTime(request.created_at)}
        />
      </DetailSection>
    </div>
  );
}
