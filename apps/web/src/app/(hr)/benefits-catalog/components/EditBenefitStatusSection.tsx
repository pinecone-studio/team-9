type EditBenefitStatusSectionProps = {
  isActive: boolean;
  onIsActiveChange: (value: boolean) => void;
};

function StatusOption({
  checked,
  description,
  label,
  onClick,
}: {
  checked: boolean;
  description: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="flex min-h-[46px] w-full items-center gap-3 rounded-[10px] border border-[#E5E5E5] bg-white px-3 py-3 text-left"
      onClick={onClick}
      type="button"
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        {checked ? <span className="h-2 w-2 rounded-full bg-[#171717]" /> : null}
      </span>
      <span className="flex flex-wrap items-center gap-2">
        <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">{label}</span>
        <span className="text-[14px] leading-5 font-normal text-[#737373]">{description}</span>
      </span>
    </button>
  );
}

export default function EditBenefitStatusSection({
  isActive,
  onIsActiveChange,
}: EditBenefitStatusSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-[16px] leading-4 font-semibold text-black">Benefit Status</h3>
      <div className="flex flex-col gap-3">
        <StatusOption
          checked={isActive}
          description="- Benefit is visible and available to eligible employees"
          label="Active"
          onClick={() => onIsActiveChange(true)}
        />
        <StatusOption
          checked={!isActive}
          description="- Benefit is hidden and not available"
          label="Disabled"
          onClick={() => onIsActiveChange(false)}
        />
      </div>
    </section>
  );
}
