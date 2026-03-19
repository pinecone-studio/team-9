import {
  ChangeSummaryRow,
  DetailCard,
  DetailSection,
} from "./ApprovalRequestDetailSections";
import type { RuleApprovalReviewChangeItem } from "./useRuleApprovalRequestReviewViewModel";

export default function RuleApprovalRequestReviewChangeSummarySection({
  items,
}: {
  items: RuleApprovalReviewChangeItem[];
}) {
  return (
    <DetailSection title="Change Summary">
      {items.length > 0 ? (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <ChangeSummaryRow
              key={item.id}
              label={item.label}
              nextValue={item.nextValue}
              previousValue={item.previousValue}
            />
          ))}
        </div>
      ) : (
        <DetailCard className="p-4">
          <p className="text-[14px] leading-5 text-[#737373]">
            No configuration fields were modified for this request.
          </p>
        </DetailCard>
      )}
    </DetailSection>
  );
}
