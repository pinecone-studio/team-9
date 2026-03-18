import {
  getBadgeClass,
  getOverrideBadgeClass,
  splitSubsidyLabel,
  StatusBadgeIcon,
} from "./benefit-card-ui";
import type { EmployeeBenefitCard } from "./employee-types";

type BenefitCardItemProps = {
  card: EmployeeBenefitCard;
  onSelect: (card: EmployeeBenefitCard) => void;
};

function BenefitCardBody({ card }: { card: EmployeeBenefitCard }) {
  const [subsidyText, providerText] = splitSubsidyLabel(card.subsidyLabel);

  return (
    <>
      <div className="flex w-full items-center justify-between gap-[23px]">
        <h3 className="text-[16px] font-semibold leading-[21px] text-[#060B10]">
          {card.title}
        </h3>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {card.isOverridden ? (
            <span
              className={[
                "inline-flex h-[22px] items-center justify-center rounded-[4px] px-2 py-[2px]",
                "text-[12px] font-medium leading-4",
                getOverrideBadgeClass(),
              ].join(" ")}
            >
              Overridden
            </span>
          ) : null}
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
      </div>
      <p className="text-[14px] font-normal leading-[18px] text-[#51565B]">
        {card.description}
      </p>
      {card.passed && (card.dots.length > 0 || card.isOverridden) ? (
        <div className="flex h-4 w-full items-center gap-[9px]">
          {card.dots.length > 0 ? (
            <div className="flex h-2 w-fit items-center gap-[2px]">
              {card.dots.map((dot, dotIndex) => (
                <span
                  className="inline-flex h-2 w-2 rounded-full"
                  key={`${card.id}-dot-${dotIndex}`}
                  style={{ backgroundColor: dot }}
                />
              ))}
            </div>
          ) : null}
          <span className="flex items-center text-[12px] font-normal leading-4 text-[#737373]">
            {card.passed}
          </span>
        </div>
      ) : (
        <p className="h-4 text-[14px] font-normal leading-[18px] text-[#DC2626]">
          {card.note ?? ""}
        </p>
      )}
      <div className="flex min-h-7 w-full items-center justify-between">
        <p className="flex items-center gap-2 text-[14px] font-normal leading-[18px] text-[#737373]">
          <span>{subsidyText}</span>
          {providerText ? <span>{providerText}</span> : null}
        </p>
        {card.note && card.dots.length > 0 && (
          <span className="ml-3 text-right text-[14px] font-normal leading-[18px] text-[#DC2626]">
            {card.note}
          </span>
        )}
      </div>
    </>
  );
}

export function BenefitCardItem({ card, onSelect }: BenefitCardItemProps) {
  const isInteractive =
    card.status === "Eligible" ||
    card.status === "Pending" ||
    card.status === "Active" ||
    card.status === "Locked";
  const className = [
    "box-border flex min-h-[184px] w-full flex-col justify-between rounded-[8px] border border-[#DBDEE1] bg-white p-4 text-left",
    isInteractive
      ? "cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 hover:border-[#CBD5E1] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
      : "",
    card.accent,
  ].join(" ");

  if (isInteractive) {
    return (
      <button className={className} onClick={() => onSelect(card)} type="button">
        <BenefitCardBody card={card} />
      </button>
    );
  }

  return (
    <article className={className}>
      <BenefitCardBody card={card} />
    </article>
  );
}
