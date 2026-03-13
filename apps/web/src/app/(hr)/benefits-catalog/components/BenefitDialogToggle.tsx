type BenefitDialogToggleProps = {
  checked?: boolean;
};

export default function BenefitDialogToggle({
  checked = false,
}: BenefitDialogToggleProps) {
  return (
    <span
      className={`relative inline-flex h-6 w-11 items-center rounded-[50px] ${
        checked ? "bg-black" : "bg-[#E2E8F0]"
      }`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </span>
  );
}
