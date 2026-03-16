import type { BenefitCard as BenefitCardData } from "../benefit-data";

type BenefitCardProps = BenefitCardData & {
  onEdit?: (benefit: BenefitCardData) => void;
};

function ActiveIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[14px] w-[14px] shrink-0"
      fill="none"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.66667 0C2.98667 0 0 2.98667 0 6.66667C0 10.3467 2.98667 13.3333 6.66667 13.3333C10.3467 13.3333 13.3333 10.3467 13.3333 6.66667C13.3333 2.98667 10.3467 0 6.66667 0ZM6.66667 12C3.72667 12 1.33333 9.60667 1.33333 6.66667C1.33333 3.72667 3.72667 1.33333 6.66667 1.33333C9.60667 1.33333 12 3.72667 12 6.66667C12 9.60667 9.60667 12 6.66667 12ZM9.72667 3.72L5.33333 8.11333L3.60667 6.39333L2.66667 7.33333L5.33333 10L10.6667 4.66667L9.72667 3.72Z"
        fill="#51565B"
      />
    </svg>
  );
}

function EligibleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[11px] w-[15px] shrink-0"
      fill="none"
      viewBox="0 0 15 11"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.4467 6.08667C11.36 6.70667 12 7.54667 12 8.66667V10.6667H14.6667V8.66667C14.6667 7.21333 12.2867 6.35333 10.4467 6.08667Z"
        fill="#51565B"
      />
      <path
        d="M9.33333 5.33333C10.8067 5.33333 12 4.14 12 2.66667C12 1.19333 10.8067 0 9.33333 0C9.02 0 8.72667 0.0666665 8.44667 0.16C9 0.846667 9.33333 1.72 9.33333 2.66667C9.33333 3.61333 9 4.48667 8.44667 5.17333C8.72667 5.26667 9.02 5.33333 9.33333 5.33333Z"
        fill="#51565B"
      />
      <path
        d="M5.33333 5.33333C6.80667 5.33333 8 4.14 8 2.66667C8 1.19333 6.80667 0 5.33333 0C3.86 0 2.66667 1.19333 2.66667 2.66667C2.66667 4.14 3.86 5.33333 5.33333 5.33333ZM5.33333 1.33333C6.06667 1.33333 6.66667 1.93333 6.66667 2.66667C6.66667 3.4 6.06667 4 5.33333 4C4.6 4 4 3.4 4 2.66667C4 1.93333 4.6 1.33333 5.33333 1.33333Z"
        fill="#51565B"
      />
      <path
        d="M5.33333 6C3.55333 6 0 6.89333 0 8.66667V10.6667H10.6667V8.66667C10.6667 6.89333 7.11333 6 5.33333 6ZM9.33333 9.33333H1.33333V8.67333C1.46667 8.19333 3.53333 7.33333 5.33333 7.33333C7.13333 7.33333 9.2 8.19333 9.33333 8.66667V9.33333Z"
        fill="#51565B"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3 w-3 shrink-0"
      fill="none"
      viewBox="0 0 12 12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.37333 4.01333L7.98667 4.62667L1.94667 10.6667H1.33333V10.0533L7.37333 4.01333ZM9.77333 0C9.60667 0 9.43333 0.0666666 9.30667 0.193333L8.08667 1.41333L10.5867 3.91333L11.8067 2.69333C12.0667 2.43333 12.0667 2.01333 11.8067 1.75333L10.2467 0.193333C10.1133 0.06 9.94667 0 9.77333 0ZM7.37333 2.12667L0 9.5V12H2.5L9.87333 4.62667L7.37333 2.12667Z"
        fill="black"
      />
    </svg>
  );
}

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
  requiresContract,
  subsidyPercent,
  title,
  vendorName,
}: BenefitCardProps) {
  const isInactive = !enabled;
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
          : "border border-[#DBDEE1] bg-white"
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex h-[26px] w-full items-center justify-between">
          <h3
            className={`text-[16px] leading-[21px] font-semibold ${
              isInactive ? "text-[rgba(6,11,16,0.5)]" : "text-[#060B10]"
            }`}
          >
            {title}
          </h3>
          <button
            className="box-border flex h-[26px] items-center justify-center gap-1 rounded-[4px] border border-[#E5E5E5] bg-white px-[15px] pl-[10px]"
            onClick={() => onEdit?.(benefitForEdit)}
            type="button"
          >
            <EditIcon />
            <span className="text-[14px] leading-[18px] font-medium text-black">edit</span>
          </button>
        </div>

        <p
          className={`min-h-[36px] max-w-[360px] text-[14px] leading-[18px] font-normal ${
            isInactive ? "text-[rgba(81,86,91,0.6)]" : "text-[#51565B]"
          }`}
        >
          {description}
        </p>

        <div className="flex h-[18px] w-full items-center gap-2 text-[14px] leading-[18px] font-normal text-[#737373]">
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
        <div className="box-border flex h-[30px] w-full items-end border-t border-[#EDEFF0] pt-[14px]">
          <div className="flex items-center gap-5">
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
