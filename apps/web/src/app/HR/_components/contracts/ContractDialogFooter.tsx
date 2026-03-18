import type { ReactNode } from "react";

type ContractDialogFooterProps = {
  onPrimary: () => void;
  onSecondary: () => void;
  primaryLabel: string;
  secondaryLabel: string;
  primaryDisabled?: boolean;
  primaryIcon?: ReactNode;
};

export default function ContractDialogFooter({
  onPrimary,
  onSecondary,
  primaryLabel,
  secondaryLabel,
  primaryDisabled = false,
  primaryIcon,
}: ContractDialogFooterProps) {
  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-[9px]">
        <button className="inline-flex h-9 items-center justify-center rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] px-[14px] text-[14px] leading-4 text-black" onClick={onSecondary} type="button">{secondaryLabel}</button>
        <button className="inline-flex h-9 items-center justify-center gap-[10px] rounded-[6px] bg-black px-[26px] text-[14px] leading-4 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={primaryDisabled} onClick={onPrimary} type="button">{primaryIcon}{primaryLabel}</button>
      </div>
    </div>
  );
}
