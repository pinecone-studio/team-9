type EditBenefitAuditSectionProps = {
  benefitName: string;
};

export default function EditBenefitAuditSection({
  benefitName,
}: EditBenefitAuditSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-[16px] leading-4 font-semibold text-black">Audit Information</h3>
      <div className="grid grid-cols-1 gap-4 rounded-[10px] border border-[#CBD5E1] bg-[rgba(245,245,245,0.2)] p-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-[12px] leading-4 font-medium tracking-[0.3px] text-[#737373] uppercase">
            Last Updated
          </span>
          <span className="text-[14px] leading-5 text-[#0A0A0A]">Pending approval workflow</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[12px] leading-4 font-medium tracking-[0.3px] text-[#737373] uppercase">
            Last Updated By
          </span>
          <span className="text-[14px] leading-5 text-[#0A0A0A]">{benefitName}</span>
        </div>
      </div>
    </section>
  );
}
