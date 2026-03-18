import BenefitDialogFieldLabel from "./BenefitDialogFieldLabel";

export default function AddBenefitValueFields({
  onSubsidyPercentChange,
  onVendorNameChange,
  requiresContract,
  subsidyPercent,
  vendorName,
}: {
  onSubsidyPercentChange: (value: string) => void;
  onVendorNameChange: (value: string) => void;
  requiresContract: boolean;
  subsidyPercent: string;
  vendorName: string;
}) {
  return (
    <section className="flex w-full flex-col gap-5">
      <h3 className="text-[16px] leading-4 font-semibold text-black">Benefit Value</h3>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-[10px]">
          <BenefitDialogFieldLabel>Subsidy Percent</BenefitDialogFieldLabel>
          <div className="flex h-[33px] items-center justify-between rounded-[6px] border border-[#CBD5E1] bg-white px-[18px]">
            <input
              className="w-full text-[12px] leading-4 font-normal text-black outline-none"
              max={100}
              min={0}
              onChange={(event) => onSubsidyPercentChange(event.target.value)}
              type="number"
              value={subsidyPercent}
            />
            <span className="text-[14px] leading-4 text-black">%</span>
          </div>
        </label>

        <label className="flex flex-col gap-[10px]">
          <BenefitDialogFieldLabel>
            {requiresContract ? "Vendor name" : "Vendor name (optional)"}
          </BenefitDialogFieldLabel>
          <input
            className="h-[33px] rounded-[6px] border border-[#CBD5E1] bg-white px-[18px] text-[12px] leading-4 font-normal text-black outline-none"
            onChange={(event) => onVendorNameChange(event.target.value)}
            placeholder={requiresContract ? "PineFit Corp" : "Optional"}
            type="text"
            value={vendorName}
          />
        </label>
      </div>
    </section>
  );
}
