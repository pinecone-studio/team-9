import {
  getBadgeClass,
  splitSubsidyLabel,
  StatusBadgeIcon,
} from "./benefit-card-ui";
import type { EmployeeBenefitCard } from "./employee-types";

type BenefitCardItemProps = {
  card: EmployeeBenefitCard;
  isSubmitting: boolean;
  onRequest: (card: EmployeeBenefitCard) => void;
};

export function BenefitCardItem({
  card,
  isSubmitting,
  onRequest,
}: BenefitCardItemProps) {
  const [subsidyText, providerText] = splitSubsidyLabel(card.subsidyLabel);

  return (
    <article
      className={[
        "box-border flex min-h-[184px] w-full flex-col justify-between",
        "rounded-[8px] border border-[#DBDEE1] bg-white p-4",
        card.accent,
      ].join(" ")}
      key={card.id}
    >
      <div className="flex w-full items-center justify-between gap-[23px]">
        <h3 className="text-[16px] font-semibold leading-[21px] text-[#060B10]">
          {card.title}
        </h3>
        <span
          className={[
            "inline-flex h-[22px] items-center justify-center gap-[6px] rounded-[4px] px-2 py-[2px]",
            "text-[12px] font-medium leading-4",
            getBadgeClass(card.status),
          ].join(" ")}
        >
          <StatusBadgeIcon status={card.status} />
          <span className="flex items-center text-center">{card.status}</span>
        </span>
      </div>
      <p className="text-[14px] font-normal leading-[18px] text-[#51565B]">
        {card.description}
      </p>
      {card.dots.length > 0 && card.passed ? (
        <div className="flex h-4 w-full items-center gap-[9px]">
          <div className="flex h-2 w-fit items-center gap-[2px]">
            {card.dots.map((dot, dotIndex) => (
              <span
                className="inline-flex h-2 w-2 rounded-full"
                key={`${card.id}-dot-${dotIndex}`}
                style={{ backgroundColor: dot }}
              />
            ))}
          </div>
          <span className="flex items-center text-[12px] font-normal leading-4 text-[#737373]">
            {card.passed}
          </span>
        </div>
      ) : (
        <p className="h-4 text-[14px] font-normal leading-[18px] text-[#DC2626]">
          {card.note ?? ""}
        </p>
      )}
      <div className="flex h-7 w-full items-center justify-between">
        <p className="flex items-center gap-2 text-[14px] font-normal leading-[18px] text-[#737373]">
          <span>{subsidyText}</span>
          {providerText ? <span>{providerText}</span> : null}
        </p>
        {card.note && card.dots.length > 0 && (
          <span className="ml-3 text-right text-[14px] font-normal leading-[18px] text-[#DC2626]">
            {card.note}
          </span>
        )}
        {card.action ? (
          <button
            className={[
              "inline-flex h-7 items-center justify-center rounded-[8px] border",
              "border-[#E5E5E5] bg-white px-5 text-[12px] font-medium leading-4",
              "text-[#0A0A0A] shadow-[0px_1px_2px_rgba(0,0,0,0.05)]",
              isSubmitting ? "cursor-not-allowed opacity-60" : "",
            ].join(" ")}
            disabled={isSubmitting}
            onClick={() => onRequest(card)}
            type="button"
          >
            {isSubmitting ? "Requesting..." : "Request"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
