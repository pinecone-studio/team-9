import { summaryCards } from "./employee-data";

export function SummaryCards() {
  return (
    <section
      className={[
        "absolute left-1/2 top-[240px] flex h-[74px] w-[1300px]",
        "-translate-x-1/2 items-center gap-5",
      ].join(" ")}
    >
      {summaryCards.map((card) => (
        <article
          className={[
            "flex h-[74px] flex-1 items-center justify-between rounded-[10px]",
            "border border-[#EEF0F3] bg-white px-4",
            "shadow-[0px_10px_20px_rgba(17,24,39,0.06)]",
          ].join(" ")}
          key={card.label}
        >
          <div>
            <p className="text-[11px] font-medium text-[#9CA3AF]">{card.label}</p>
            <p className="text-lg font-semibold text-[#111827]">{card.value}</p>
          </div>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#EEF0F3]">
            {card.icon === "check" && (
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke={card.color}
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  d="M8 12.5l2.5 2.5L16 9.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {card.icon === "clover" && (
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill={card.color}
                viewBox="0 0 24 24"
              >
                <circle cx="9" cy="8" r="4" />
                <circle cx="15" cy="8" r="4" />
                <circle cx="9" cy="14" r="4" />
                <circle cx="15" cy="14" r="4" />
                <rect x="11.2" y="15" width="1.6" height="6" rx="0.8" />
              </svg>
            )}
            {card.icon === "lock" && (
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke={card.color}
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                <circle cx="12" cy="15" r="1.2" fill={card.color} stroke="none" />
              </svg>
            )}
            {card.icon === "clock" && (
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
                stroke={card.color}
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        </article>
      ))}
    </section>
  );
}
