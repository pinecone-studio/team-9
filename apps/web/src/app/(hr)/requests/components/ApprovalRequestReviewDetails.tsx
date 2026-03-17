import type { ApprovalRequestQuery } from "./approval-requests.graphql";
import { DetailRow, RuleAssignments } from "./ApprovalRequestReviewShared";
import {
  BenefitSnapshotSection,
  RuleSnapshotSection,
} from "./ApprovalRequestSnapshotSections";
import {
  formatJsonLikeValue,
  parseApprovalPayload,
  parseApprovalSnapshot,
} from "./approval-request-utils";

type RequestRecord = NonNullable<ApprovalRequestQuery["approvalRequest"]>;

export default function ApprovalRequestReviewDetails({
  request,
}: {
  request: RequestRecord;
}) {
  const parsedPayload = parseApprovalPayload(request);
  const snapshot = parseApprovalSnapshot(request);

  if (parsedPayload.entityType === "benefit") {
    const benefit = parsedPayload.benefit;
    const employeeRequest = parsedPayload.employeeRequest;
    const snapshotEmployeeRequest =
      snapshot &&
      "employeeRequest" in snapshot &&
      typeof snapshot.employeeRequest === "object" &&
      snapshot.employeeRequest !== null
        ? (snapshot.employeeRequest as Record<string, unknown>)
        : null;
    const previousBenefit =
      snapshot && "benefit" in snapshot
        ? (snapshot.benefit as Record<string, unknown> | undefined)
        : undefined;
    const previousRules =
      snapshot && "ruleAssignments" in snapshot
        ? (snapshot.ruleAssignments as Array<Record<string, unknown>> | undefined)
        : undefined;
    const isEmployeeActivationRequest = Boolean(employeeRequest);

    return (
      <div className="flex flex-col gap-6">
        {isEmployeeActivationRequest ? (
          <section className="rounded-[12px] border border-[#E2E8F0] bg-white p-5">
            <div className="mb-3">
              <h3 className="text-[16px] leading-6 font-semibold text-[#0F172A]">
                Employee Activation Request
              </h3>
            </div>
            <DetailRow
              label="Employee"
              value={employeeRequest?.employeeName || employeeRequest?.employeeEmail}
            />
            <DetailRow label="Employee ID" value={employeeRequest?.employeeId} />
            <DetailRow label="Benefit ID" value={employeeRequest?.benefitId} />
            <DetailRow
              label="Requested Status"
              value={employeeRequest?.requestedStatus}
            />
            <DetailRow
              label="Previous Status"
              value={
                typeof snapshotEmployeeRequest?.previousStatus === "string"
                  ? snapshotEmployeeRequest.previousStatus
                  : "-"
              }
            />
          </section>
        ) : null}
        <section className="rounded-[12px] border border-[#E2E8F0] bg-white p-5">
          <div className="mb-3">
            <h3 className="text-[16px] leading-6 font-semibold text-[#0F172A]">
              Proposed Benefit Details
            </h3>
          </div>
          <DetailRow label="Name" value={benefit?.name} />
          <DetailRow label="Description" value={benefit?.description} />
          <DetailRow label="Category ID" value={benefit?.categoryId} />
          <DetailRow label="Subsidy Percent" value={benefit?.subsidyPercent} />
          <DetailRow label="Vendor Name" value={benefit?.vendorName} />
          <DetailRow label="Core Benefit" value={benefit?.isCore} />
          <DetailRow label="Requires Contract" value={benefit?.requiresContract} />
          <DetailRow
            label="Approval Role"
            value={
              benefit?.approvalRole === "finance_manager" ? "Finance Manager" : "HR Admin"
            }
          />
        </section>
        {previousBenefit ? <BenefitSnapshotSection snapshot={previousBenefit} /> : null}
        {!isEmployeeActivationRequest ? (
          <>
            <section className="rounded-[12px] border border-[#E2E8F0] bg-white p-5">
              <div className="mb-3">
                <h3 className="text-[16px] leading-6 font-semibold text-[#0F172A]">
                  Proposed Rule Assignments
                </h3>
              </div>
              <RuleAssignments assignments={parsedPayload.ruleAssignments} />
            </section>
            {previousRules && previousRules.length > 0 ? (
              <section className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
                <div className="mb-3">
                  <h3 className="text-[16px] leading-6 font-semibold text-[#0F172A]">
                    Current Rule Snapshot
                  </h3>
                </div>
                <RuleAssignments
                  assignments={previousRules.map((rule) => ({
                    errorMessage: String(rule.errorMessage ?? ""),
                    operator: String(rule.operator ?? ""),
                    priority: typeof rule.priority === "number" ? rule.priority : undefined,
                    ruleId: String(rule.ruleId ?? ""),
                    value: String(rule.value ?? ""),
                  }))}
                />
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    );
  }

  const rule = parsedPayload.rule;
  const previousRule = snapshot as Record<string, unknown> | null;

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[12px] border border-[#E2E8F0] bg-white p-5">
        <div className="mb-3">
          <h3 className="text-[16px] leading-6 font-semibold text-[#0F172A]">
            Proposed Rule Details
          </h3>
        </div>
        <DetailRow label="Name" value={rule?.name} />
        <DetailRow label="Description" value={rule?.description} />
        <DetailRow label="Category ID" value={rule?.categoryId} />
        <DetailRow label="Rule Type" value={rule?.ruleType} />
        <DetailRow label="Value Type" value={rule?.valueType} />
        <DetailRow label="Allowed Operators" value={rule?.allowedOperators?.join(", ")} />
        <DetailRow label="Default Operator" value={rule?.defaultOperator} />
        <DetailRow label="Default Value" value={formatJsonLikeValue(rule?.defaultValue)} />
        <DetailRow label="Default Unit" value={rule?.defaultUnit} />
        <DetailRow label="Options" value={formatJsonLikeValue(rule?.optionsJson)} />
        <DetailRow label="Active" value={rule?.isActive} />
      </section>
      {previousRule ? <RuleSnapshotSection snapshot={previousRule} /> : null}
    </div>
  );
}
