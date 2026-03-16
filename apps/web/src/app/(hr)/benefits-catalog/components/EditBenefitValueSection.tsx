import BenefitDialogFieldLabel from "./BenefitDialogFieldLabel";

type EditBenefitValueSectionProps = {
  onSubsidyPercentChange: (value: string) => void;
  onVendorNameChange: (value: string) => void;
  subsidyPercentValue: string;
  vendorNameValue: string;
};

export default function EditBenefitValueSection({
  onSubsidyPercentChange,
  onVendorNameChange,
  subsidyPercentValue,
  vendorNameValue,
}: EditBenefitValueSectionProps) {
  return (
    <section className="flex flex-col gap-5">
      <h3 className="text-[16px] leading-4 font-semibold text-black">Benefit Value</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-[10px]">
          <BenefitDialogFieldLabel>Subsidy Percent</BenefitDialogFieldLabel>
          <input
            className="h-[33px] rounded-[6px] border border-[#CBD5E1] bg-white px-[18px] text-[12px] leading-4 outline-none"
            max={100}
            min={0}
            onChange={(event) => onSubsidyPercentChange(event.target.value)}
            type="number"
            value={subsidyPercentValue}
          />
        </label>

        <label className="flex flex-col gap-[10px]">
          <BenefitDialogFieldLabel>Vendor name</BenefitDialogFieldLabel>
          <input
            className="h-[33px] rounded-[6px] border border-[#CBD5E1] bg-white px-[18px] text-[12px] leading-4 outline-none"
            onChange={(event) => onVendorNameChange(event.target.value)}
            type="text"
            value={vendorNameValue}
          />
        </label>
      </div>
    </section>
  );
}
