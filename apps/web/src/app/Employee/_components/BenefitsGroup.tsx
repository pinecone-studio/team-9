import type { BenefitCard } from "./employee-types";
import { wellnessIconPath } from "./benefit-data";

type BenefitsGroupProps = {
  items: BenefitCard[];
};

export function BenefitsGroup({ items }: BenefitsGroupProps) {
  return (
    <>
      <div className="flex items-center gap-2 text-xs font-semibold text-[#111827]">
        <svg
          aria-hidden="true"
          className="h-4 w-4 text-[#111827]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          viewBox="0 0 24 24"
        >
          <path d={wellnessIconPath} />
        </svg>
        <span>Wellness</span>
        <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[10px] text-[#6B7280]">
          3 Benefits
        </span>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {items.map((card, index) => (
          <article
            className={[
              "rounded-[12px] border border-[#E5E7EB] bg-white px-5 py-4",
              "shadow-[0px_10px_20px_rgba(17,24,39,0.06)]",
              card.accent,
            ].join(" ")}
            key={`${card.status}-${index}`}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[15px] font-semibold text-[#111827]">Gym Membership</h3>
              <span
                className={[
                  "inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-[11px]",
                  card.badge,
                ].join(" ")}
              >
                {card.status === "Eligible" && (
                  <span className="inline-flex h-3 w-3 items-center justify-center rounded-full border border-current">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-2.5 w-2.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 12l4 4 8-9" />
                    </svg>
                  </span>
                )}
                {card.status === "Locked" && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <rect x="6" y="11" width="12" height="9" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                )}
                {card.status === "Pending" && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {card.status === "Active" && (
                  <span className="inline-flex h-2 w-2 rounded-full bg-[#16A34A]" />
                )}
                {card.status === "Inactive" && (
                  <span className="inline-flex h-2 w-2 rounded-full bg-[#9CA3AF]" />
                )}
                {card.status}
              </span>
            </div>
            <p className="mt-3 text-[12px] text-[#6B7280]">
              Access to PineFit gym facilities with personal training sessions
            </p>
            {card.dots.length > 0 && (
              <div className="mt-4 flex items-center gap-1 text-[11px] text-[#6B7280]">
                {card.dots.map((dot, dotIndex) => (
                  <span
                    className="inline-flex h-2.5 w-2.5 rounded-full"
                    key={`${card.status}-dot-${dotIndex}`}
                    style={{ backgroundColor: dot }}
                  />
                ))}
                <span className="ml-2">{card.passed}</span>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between text-[11px] text-[#6B7280]">
              <span>50% subsidy &nbsp;by PineFit Corp</span>
              {card.note && <span className="text-[#EF4444]">{card.note}</span>}
              {card.action && (
                <button
                  className="rounded-[8px] border border-[#E5E7EB] px-3 py-1 text-[10px] font-semibold text-[#111827]"
                  type="button"
                >
                  Request
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
