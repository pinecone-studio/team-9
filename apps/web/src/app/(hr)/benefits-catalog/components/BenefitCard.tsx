import type { BenefitCard as BenefitCardData } from "../benefit-data";
import { formatRelativeTimestamp } from "@/app/(hr)/requests/components/approval-request-time-formatters";
import { ActiveIcon, EditIcon, EligibleIcon } from "./benefit-card-icons";

type BenefitCardProps = BenefitCardData & {
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
  onEdit,
  onOpenRequest,
  pendingRequest,
  requiresContract,
  subsidyPercent,
  title,
  vendorName,
}: BenefitCardProps) {
  const isInactive = !enabled;
  const isEditDisabled = Boolean(pendingRequest);
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
      className={`box-border flex min-h-[184px] w-full min-w-0 flex-col justify-between rounded-[8px] p-4 xl:max-w-[420px] ${
        isInactive
          ? "border-2 border-dashed border-[rgba(219,222,225,0.6)] bg-[#FAFAFA]"
          : pendingRequest
            ? "border border-[#FACC15] bg-[#FFFDF5]"
          : "border border-[#DBDEE1] bg-white"
      }`}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex min-h-[26px] w-full items-start justify-between gap-3">
          <h3
            className={`min-w-0 flex-1 text-[16px] leading-[21px] font-semibold break-words ${
              isInactive ? "text-[rgba(6,11,16,0.5)]" : "text-[#060B10]"
            }`}
          >
            {title}
          </h3>
          <button
            className={`box-border flex h-[26px] items-center justify-center gap-1 rounded-[4px] border px-[15px] pl-[10px] ${
              isEditDisabled
                ? "cursor-not-allowed border-[#F3E8A3] bg-[#FFF8DB] text-[#A16207]"
                : "border-[#E5E5E5] bg-white"
            }`}
            disabled={isEditDisabled}
            onClick={() => {
              if (isEditDisabled) {
                return;
              }
              onEdit?.(benefitForEdit);
            }}
            type="button"
            title={isEditDisabled ? "Pending requesttei benefit-g approval hiitelt dahin uurchluh bolomjgui." : undefined}
          >
            <EditIcon />
            <span className={`text-[14px] leading-[18px] font-medium ${
              isEditDisabled ? "text-[#A16207]" : "text-black"
            }`}>edit</span>
          </button>
        </div>

        {pendingRequest ? (
          <button
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-3 py-1 text-left text-[12px] leading-4 font-medium text-[#92400E]"
            onClick={() => onOpenRequest?.(pendingRequest.id)}
            type="button"
          >
            <span>Pending {pendingRequest.actionType} approval</span>
            <span className="text-[#A16207]">
              {formatRelativeTimestamp(pendingRequest.createdAt)}
            </span>
          </button>
        ) : null}

        <p
          className={`max-w-[360px] text-[14px] leading-[18px] font-normal ${
            isInactive ? "text-[rgba(81,86,91,0.6)]" : "text-[#51565B]"
          }`}
        >
          {description}
        </p>

        <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-1 text-[14px] leading-[18px] font-normal text-[#737373]">
          <span>
            {typeof subsidyPercent === "number" && Number.isFinite(subsidyPercent)
              ? `${subsidyPercent}% subsidy`
              : "No subsidy"}
          </span>
          <span>{`by ${vendorName?.trim() || "No vendor"}`}</span>
        </div>
      </div>

      {isInactive ? (
        <p className="text-[14px] leading-5 font-medium italic text-[#E7000B]">
          Inactive - Benefit temporarily disabled
        </p>
      ) : (
        <div className="mt-4 box-border flex w-full items-end border-t border-[#EDEFF0] pt-[14px]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex items-center gap-1">
              <ActiveIcon />
              <span className="text-[12px] leading-4 font-medium text-[#51565B]">
                {activeEmployees} Active
              </span>
            </span>
            <span className="flex items-center gap-1">
              <EligibleIcon />
              <span className="text-[12px] leading-4 font-medium text-[#51565B]">
                {eligibleEmployees} Eligible
              </span>
            </span>
          </div>
        </div>
      )}
    </article>
  );
}
