import { CalendarDays, Users } from "lucide-react";

import type { ApprovalRequestQuery } from "./approval-requests.graphql";
import {
  ChangeSummaryRow,
  DetailCard,
  DetailSection,
  LabeledValue,
  SubmissionDetailsCard,
} from "./ApprovalRequestDetailSections";
import ApprovalRequestStatusBadge from "./ApprovalRequestStatusBadge";
import { useResolvedPersonName } from "./RequestPeopleContext";
import {
  formatApprovalRole,
  parseApprovalPayload,
  parseApprovalSnapshot,
} from "./approval-request-utils";
import {
  type BenefitUpdateRuleAssignment,
  type BenefitUpdateShape,
  getBenefitUpdateChangeRows,
} from "./approval-request-benefit-update-utils";
import {
  formatDetailDateTime,
  formatDetailSubsidy,
} from "./request-detail-formatters";

type RequestRecord = NonNullable<ApprovalRequestQuery["approvalRequest"]>;

export default function ApprovalRequestBenefitUpdateDetails({
  request,
}: {
  request: RequestRecord;
}) {
  const parsedPayload = parseApprovalPayload(request);
  const snapshot = parseApprovalSnapshot(request) as
    | {
        benefit?: BenefitUpdateShape;
        ruleAssignments?: BenefitUpdateRuleAssignment[];
      }
    | null;

  const benefit =
    parsedPayload.entityType === "benefit"
      ? (parsedPayload.benefit as BenefitUpdateShape | null)
      : null;
  const previousBenefit = snapshot?.benefit ?? null;
  const nextRules =
    parsedPayload.entityType === "benefit"
      ? (parsedPayload.ruleAssignments as BenefitUpdateRuleAssignment[])
      : [];
  const archiveComment =
    parsedPayload.entityType === "benefit" ? parsedPayload.archiveComment : null;
  const previousRules = snapshot?.ruleAssignments ?? [];
  const changeRows = getBenefitUpdateChangeRows(
    benefit,
    previousBenefit,
    nextRules,
    previousRules,
  );
  const requesterName = useResolvedPersonName(request.requested_by);
  const reviewerLabel = useResolvedPersonName(request.reviewed_by);
  const assignedApprover =
    reviewerLabel !== "-" ? reviewerLabel : formatApprovalRole(request.target_role);
  const isDelete = request.action_type === "delete";
  const impactedEmployeeCount =
    previousRules.length > 0 || nextRules.length > 0 ? nextRules.length : changeRows.length;
  const estimatedChangeLabel =
    changeRows.length > 0 ? `+${changeRows.length} update${changeRows.length === 1 ? "" : "s"}` : "No estimate";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center justify-center overflow-hidden rounded-[8px] border border-[#E5E5E5] bg-white px-[9px] py-[3px] text-[14px] leading-5 font-medium capitalize text-[#0A0A0A]">
          Benefit
        </span>
        <span className={`inline-flex h-[26px] items-center justify-center overflow-hidden px-[13px] py-[3px] text-[12px] leading-4 font-medium ${
          isDelete
            ? "rounded-[8px] bg-[#FEF2F2] text-[#C10007]"
            : "rounded-[41px] bg-[#F5F5F5] text-[#171717]"
        }`}>
          {isDelete ? "Archive" : "Change"}
        </span>
      </div>

      <DetailSection title="Configuration Overview">
        <DetailCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h4 className="text-[18px] leading-7 font-semibold text-[#0A0A0A]">
                {benefit?.name?.trim() || "Untitled Benefit"}
              </h4>
              <p className="text-[14px] leading-5 text-[#737373]">
                {benefit?.description?.trim() || "-"}
              </p>
            </div>
            <div className="grid gap-x-6 gap-y-4 border-t border-[#E5E5E5] py-3 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <LabeledValue
                  label="Category"
                  value={benefit?.category || previousBenefit?.category || benefit?.categoryId || "-"}
                />
                <LabeledValue label="Vendor" value={benefit?.vendorName?.trim() || "-"} />
              </div>
              <div className="flex flex-col gap-4">
                <LabeledValue
                  label="Subsidy"
                  value={formatDetailSubsidy(benefit?.subsidyPercent)}
                />
                <LabeledValue label="Approver" value={formatApprovalRole(request.target_role)} />
              </div>
            </div>
          </div>
        </DetailCard>
      </DetailSection>

      {archiveComment ? (
        <DetailSection title="Archive Comment">
          <DetailCard>
            <p className="text-[14px] leading-5 text-[#0A0A0A]">{archiveComment}</p>
          </DetailCard>
        </DetailSection>
      ) : null}

      {!isDelete ? (
        <DetailSection title="Change Summary">
          <div className="flex flex-col gap-3">
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

      <DetailSection title="Impact Preview">
        <DetailCard>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-[#737373]" />
              <div>
                <div className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  {isDelete ? "Archive benefit" : impactedEmployeeCount}
                </div>
                <div className="text-[12px] leading-4 text-[#737373]">
                  {isDelete ? "Requested action" : "Affected employees"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-[#737373]" />
              <div>
                <div className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  {isDelete ? formatDetailDateTime(request.created_at) : estimatedChangeLabel}
                </div>
                <div className="text-[12px] leading-4 text-[#737373]">
                  {isDelete ? "Requested on" : "Est. cost change"}
                </div>
              </div>
            </div>
          </div>
        </DetailCard>
      </DetailSection>

      <DetailSection title="Submission Details">
        <SubmissionDetailsCard
          approverName={assignedApprover}
          approverSubtitle={request.reviewed_by ? "Reviewer" : formatApprovalRole(request.target_role)}
          requesterName={requesterName}
          requesterSubtitle="Requester"
          statusBadge={<ApprovalRequestStatusBadge status={request.status} variant="pill" />}
          submittedAt={formatDetailDateTime(request.created_at)}
        />
      </DetailSection>
    </div>
  );
}
