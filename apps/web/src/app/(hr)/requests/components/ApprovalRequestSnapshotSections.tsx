import { DetailRow } from "./ApprovalRequestReviewShared";
import { formatJsonLikeValue } from "./approval-request-utils";

export function BenefitSnapshotSection({
  snapshot,
}: {
  snapshot: Record<string, unknown>;
}) {
  return (
    <section className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
      <div className="mb-3">
        <h3 className="text-[16px] leading-6 font-semibold text-[#0F172A]">
          Current Benefit Snapshot
        </h3>
      </div>
      <DetailRow label="Name" value={String(snapshot.name ?? "-")} />
      <DetailRow label="Description" value={String(snapshot.description ?? "-")} />
      <DetailRow label="Category" value={String(snapshot.category ?? snapshot.categoryId ?? "-")} />
      <DetailRow label="Subsidy Percent" value={String(snapshot.subsidyPercent ?? "-")} />
      <DetailRow label="Vendor Name" value={String(snapshot.vendorName ?? "-")} />
      <DetailRow label="Core Benefit" value={Boolean(snapshot.isCore)} />
      <DetailRow label="Requires Contract" value={Boolean(snapshot.requiresContract)} />
      <DetailRow
        label="Approval Role"
        value={snapshot.approvalRole === "finance_manager" ? "Finance Manager" : "HR Admin"}
      />
    </section>
  );
}

export function RuleSnapshotSection({
  snapshot,
}: {
  snapshot: Record<string, unknown>;
}) {
  return (
    <section className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-5">
      <div className="mb-3">
        <h3 className="text-[16px] leading-6 font-semibold text-[#0F172A]">
          Current Rule Snapshot
        </h3>
      </div>
      <DetailRow label="Name" value={String(snapshot.name ?? "-")} />
      <DetailRow label="Description" value={String(snapshot.description ?? "-")} />
      <DetailRow label="Category" value={String(snapshot.category_name ?? snapshot.category_id ?? "-")} />
      <DetailRow label="Rule Type" value={String(snapshot.rule_type ?? "-")} />
      <DetailRow label="Value Type" value={String(snapshot.value_type ?? "-")} />
      <DetailRow label="Allowed Operators" value={String(snapshot.allowed_operators_json ?? "-")} />
      <DetailRow label="Default Operator" value={String(snapshot.default_operator ?? "-")} />
      <DetailRow label="Default Value" value={formatJsonLikeValue(String(snapshot.default_value ?? ""))} />
      <DetailRow label="Default Unit" value={String(snapshot.default_unit ?? "-")} />
      <DetailRow label="Options" value={formatJsonLikeValue(String(snapshot.options_json ?? ""))} />
      <DetailRow label="Active" value={Boolean(snapshot.is_active)} />
    </section>
  );
}
