type BenefitDialogFieldLabelProps = {
  children: string;
};

export default function BenefitDialogFieldLabel({
  children,
}: BenefitDialogFieldLabelProps) {
  return (
    <span className="text-[14px] leading-[14px] font-medium text-black">
      {children}
    </span>
  );
}
