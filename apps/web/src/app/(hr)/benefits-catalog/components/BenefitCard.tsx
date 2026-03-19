import type { BenefitCard as BenefitCardData } from "../benefit-data";
import {
  PendingBenefitCardContent,
  StandardBenefitCardContent,
} from "./benefit-card-content";

type BenefitCardProps = BenefitCardData & {
  onCancelRequest?: (requestId: string) => void;
  onEdit?: (benefit: BenefitCardData) => void;
  onOpenRequest?: (requestId: string) => void;
};

export default function BenefitCard({
  activeEmployees,
  approvalRole,
  badges,
  category,
  categoryId,
  description,
  enabled,
  id,
  icon: Icon,
  isCore,
  eligibleEmployees,
  onCancelRequest,
  onEdit,
  onOpenRequest,
  pendingRequest,
  requiresContract,
  subsidyPercent,
  title,
  vendorName,
}: BenefitCardProps) {
  const isInactive = !enabled;
  const isPending = Boolean(pendingRequest);
  const benefitForEdit: BenefitCardData = {
    activeEmployees,
    approvalRole,
    badges,
    category,
    categoryId,
    description,
    enabled,
    eligibleEmployees,
    icon: Icon,
    id,
    isCore,
    pendingRequest,
    requiresContract,
    subsidyPercent,
    title,
    vendorName,
  };

  return (
    <article
      className={`box-border flex h-[184px] w-full min-w-0 flex-col justify-between rounded-[8px] p-4 xl:max-w-[420px] ${
        isInactive
          ? "border-2 border-dashed border-[rgba(219,222,225,0.6)] bg-[#FAFAFA]"
          : isPending
            ? "cursor-pointer border-2 border-[#FFD000] bg-[#FDFCF2]"
            : "border border-[#DBDEE1] bg-white"
      }`}
      onClick={
        isPending && pendingRequest
          ? () => onOpenRequest?.(pendingRequest.id)
          : undefined
      }
      onKeyDown={
        isPending && pendingRequest
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpenRequest?.(pendingRequest.id);
              }
            }
          : undefined
      }
      role={isPending && pendingRequest ? "button" : undefined}
      tabIndex={isPending && pendingRequest ? 0 : undefined}
    >
      {isPending && pendingRequest ? (
        <PendingBenefitCardContent
          description={description}
          onCancelRequest={onCancelRequest}
          onOpenRequest={onOpenRequest}
          pendingRequestId={pendingRequest.id}
          subsidyPercent={subsidyPercent}
          title={title}
          vendorName={vendorName}
        />
      ) : (
        <StandardBenefitCardContent
          activeEmployees={activeEmployees}
          benefitForEdit={benefitForEdit}
          description={description}
          eligibleEmployees={eligibleEmployees}
          isInactive={isInactive}
          onEdit={onEdit}
          subsidyPercent={subsidyPercent}
          title={title}
          vendorName={vendorName}
        />
      )}
    </article>
  );
}
