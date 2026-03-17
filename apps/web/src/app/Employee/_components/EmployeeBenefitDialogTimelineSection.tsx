type BenefitTimelineItem = {
  id: string;
  label: string;
  timestamp: string;
  tone: "neutral" | "warning";
};

type EmployeeBenefitDialogTimelineSectionProps = {
  items: BenefitTimelineItem[];
};

export default function EmployeeBenefitDialogTimelineSection({
  items,
}: EmployeeBenefitDialogTimelineSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
        Request Timeline
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
                    item.tone === "warning"
                      ? "bg-[#EAB308]"
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
