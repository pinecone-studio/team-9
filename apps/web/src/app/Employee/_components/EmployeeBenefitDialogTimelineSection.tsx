import type { BenefitTimelineItem } from "./employee-benefit-request.helpers";

type EmployeeBenefitDialogTimelineSectionProps = {
  items: BenefitTimelineItem[];
  title?: string;
};

export default function EmployeeBenefitDialogTimelineSection({
  items,
  title = "Request Timeline",
}: EmployeeBenefitDialogTimelineSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
        {title}
      </h3>
      <div className="flex flex-col gap-4">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div className="flex items-start gap-3" key={item.id}>
              <div className="flex w-[10px] flex-col items-center">
                <span
                  className={[
                    "h-[10px] w-[10px] rounded-full",
                    item.tone === "danger"
                      ? "bg-[#EF4444]"
                      : item.tone === "success"
                        ? "bg-[#22C55E]"
                        : "bg-[rgba(115,115,115,0.4)]",
                  ].join(" ")}
                />
                {!isLast ? (
                  <span className="mt-1 h-full min-h-[38px] w-px bg-[#E5E5E5]" />
                ) : null}
              </div>
              <div className="pb-3">
                <p className="text-[14px] leading-5 text-[#0A0A0A]">{item.label}</p>
                <p className="mt-1 text-[12px] leading-4 text-[#737373]">
                  {item.timestamp}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
