import { formatJsonLikeValue } from "./approval-request-utils";

export function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | null | undefined;
}) {
  const normalizedValue =
    typeof value === "boolean" ? (value ? "Yes" : "No") : (value ?? "-");

  return (
    <div className="grid grid-cols-[180px_minmax(0,1fr)] gap-4 border-b border-[#F1F5F9] py-3 last:border-b-0">
      <span className="text-[13px] leading-5 font-medium text-[#475569]">{label}</span>
      <span className="min-w-0 text-[14px] leading-5 text-[#0F172A]">
        {String(normalizedValue)}
      </span>
    </div>
  );
}

export function RuleAssignments({
  assignments,
}: {
  assignments: Array<{
    errorMessage?: string;
    operator?: string;
    priority?: number;
    ruleId?: string;
    value?: string;
  }>;
}) {
  if (assignments.length === 0) {
    return (
      <div className="rounded-[10px] border border-dashed border-[#CBD5E1] px-4 py-5 text-center text-[14px] leading-5 text-[#64748B]">
        No rule assignments were included in this request.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {assignments.map((assignment, index) => (
        <div
          className="rounded-[10px] border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
          key={`${assignment.ruleId ?? "rule"}-${index}`}
        >
          <div className="flex flex-wrap items-center gap-2 text-[14px] leading-5 font-medium text-[#0F172A]">
            <span>Rule {index + 1}</span>
            {assignment.priority ? (
              <span className="rounded-full bg-white px-2 py-0.5 text-[12px] leading-4 text-[#475569]">
                Priority {assignment.priority}
              </span>
            ) : null}
          </div>
          <div className="mt-2 grid gap-1 text-[13px] leading-5 text-[#64748B]">
            <span>Rule ID: {assignment.ruleId ?? "-"}</span>
            <span>Operator: {assignment.operator ?? "-"}</span>
            <span>Value: {formatJsonLikeValue(assignment.value)}</span>
            <span>Error message: {assignment.errorMessage ?? "-"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
