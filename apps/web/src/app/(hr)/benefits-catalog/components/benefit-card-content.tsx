import { Clock3 } from "lucide-react";

import type { BenefitCard as BenefitCardData } from "../benefit-data";
import { ActiveIcon, EditIcon, EligibleIcon } from "./benefit-card-icons";

function renderBenefitValue(subsidyPercent?: number | null, vendorName?: string | null) {
  const subsidyLabel =
    typeof subsidyPercent === "number" && Number.isFinite(subsidyPercent)
      ? `${subsidyPercent}% subsidy`
      : "No subsidy";

  return (
    <div className="flex w-full flex-wrap items-center gap-x-2 gap-y-1 text-[14px] leading-[18px] font-normal text-[#737373]">
      <span>{subsidyLabel}</span>
      <span>{`by ${vendorName?.trim() || "No vendor"}`}</span>
    </div>
  );
}

type PendingBenefitCardContentProps = {
  description: string;
  onCancelRequest?: (requestId: string) => void;
  onOpenRequest?: (requestId: string) => void;
  pendingRequestId: string;
  subsidyPercent?: number | null;
  title: string;
  vendorName?: string | null;
};

export function PendingBenefitCardContent({
  description,
  onCancelRequest,
  onOpenRequest,
  pendingRequestId,
  subsidyPercent,
  title,
  vendorName,
}: PendingBenefitCardContentProps) {
  return (
    <>
      <div className="flex w-full flex-col gap-3">
        <div className="flex min-h-[22px] w-full items-start justify-between gap-3">
          <h3 className="line-clamp-1 min-w-0 flex-1 text-[16px] leading-[21px] font-semibold text-[#060B10]">
            {title}
          </h3>
          <button
            className="inline-flex h-[22px] shrink-0 items-center justify-center gap-1.5 rounded-[4px] border border-[#FFC761] bg-[#FEF3C6] px-2 py-[2px] text-[12px] leading-4 font-medium text-[#973C00]"
            onClick={(event) => {
              event.stopPropagation();
              onOpenRequest?.(pendingRequestId);
            }}
            type="button"
          >
            <Clock3 className="h-3 w-3" />
            <span>Pending</span>
          </button>
        </div>

        <p className="line-clamp-2 min-h-[36px] max-w-[360px] text-[14px] leading-[18px] font-normal text-[#51565B]">
          {description}
        </p>

        {renderBenefitValue(subsidyPercent, vendorName)}
      </div>

      <button
        className="inline-flex h-[30px] w-[128px] items-center justify-center rounded-[4px] border border-[#FFC761] bg-white text-[14px] leading-[18px] font-medium text-[#EF4444]"
        onClick={(event) => {
          event.stopPropagation();
          onCancelRequest?.(pendingRequestId);
        }}
        type="button"
      >
        Cancel Request
      </button>
    </>
  );
}

type StandardBenefitCardContentProps = {
  activeEmployees: number;
  benefitForEdit: BenefitCardData;
  description: string;
  eligibleEmployees: number;
  isInactive: boolean;
  onEdit?: (benefit: BenefitCardData) => void;
  subsidyPercent?: number | null;
  title: string;
  vendorName?: string | null;
};

export function StandardBenefitCardContent({
  activeEmployees,
  benefitForEdit,
  description,
  eligibleEmployees,
  isInactive,
  onEdit,
  subsidyPercent,
  title,
  vendorName,
}: StandardBenefitCardContentProps) {
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex min-h-[26px] w-full items-start justify-between gap-3">
          <h3
            className={`line-clamp-1 min-w-0 flex-1 text-[16px] leading-[21px] font-semibold ${
              isInactive ? "text-[rgba(6,11,16,0.5)]" : "text-[#060B10]"
            }`}
          >
            {title}
          </h3>
          <button
            className="box-border flex h-[26px] shrink-0 items-center justify-center gap-1 rounded-[4px] border border-[#E5E5E5] bg-white px-[15px] pl-[10px]"
            onClick={() => onEdit?.(benefitForEdit)}
            type="button"
          >
            <EditIcon />
            <span className="text-[14px] leading-[18px] font-medium text-black">edit</span>
          </button>
        </div>

        <p
          className={`line-clamp-2 min-h-[36px] max-w-[360px] text-[14px] leading-[18px] font-normal ${
            isInactive ? "text-[rgba(81,86,91,0.6)]" : "text-[#51565B]"
          }`}
        >
          {description}
        </p>

        {renderBenefitValue(subsidyPercent, vendorName)}
      </div>

      {isInactive ? (
        <p className="text-[14px] leading-5 font-medium italic text-[#E7000B]">
          Inactive - Benefit temporarily disabled
        </p>
      ) : (
        <div className="box-border flex w-full items-end border-t border-[#EDEFF0] pt-[14px]">
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
    </>
  );
}
