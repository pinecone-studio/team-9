"use client";

import { RefreshCw } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  ContractDateField,
  ContractDialogError,
  ContractFileField,
  ContractTextareaField,
  ContractTextField,
} from "./ContractDialogFields";
import ContractDialogFooter from "./ContractDialogFooter";
import ContractDialogShell from "./ContractDialogShell";
import {
  ACCEPTED_CONTRACT_TYPES,
  fromNativeDate,
  isAcceptedContractFile,
  normalizeDateInput,
} from "./contract-dialog-utils";

type RenewContractDialogProps = {
  contract: {
    acceptedCount: number;
    benefit: string;
    benefitId: string;
    effectiveDate: string;
    expiryDate: string;
    status: "active" | "expiring" | "expired" | "archived";
    vendor: string;
    version: string;
  };
  onClose: () => void;
  onRenew: (input: {
    effectiveDate: string;
    expiryDate: string;
    file: File;
    notes: string;
    vendorName: string;
    version: string;
  }) => Promise<void>;
  renewing?: boolean;
};

export default function RenewContractDialog({
  contract,
  onClose,
  onRenew,
  renewing = false,
}: RenewContractDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const effectiveDatePickerRef = useRef<HTMLInputElement | null>(null);
  const expiryDatePickerRef = useRef<HTMLInputElement | null>(null);
  const [version, setVersion] = useState("");
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [effectiveDate, setEffectiveDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  function handlePickedFile(file: File | null) {
    if (!file) return;
    if (!isAcceptedContractFile(file)) {
      setErrorMessage("Only PDF files are allowed.");
      return;
    }
    setContractFile(file);
    setErrorMessage(null);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    handlePickedFile(event.target.files?.[0] ?? null);
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragActive(false);
    handlePickedFile(event.dataTransfer.files?.[0] ?? null);
  }

  async function handleRenew() {
    if (!version.trim() || !contractFile || !effectiveDate || !expiryDate) {
      setErrorMessage("Version, PDF file, and both dates are required.");
      return;
    }

    try {
      setErrorMessage(null);
      await onRenew({
        effectiveDate,
        expiryDate,
        file: contractFile,
        notes,
        vendorName: contract.vendor,
        version: version.trim(),
      });
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to renew contract.");
    }
  }

  return (
    <ContractDialogShell
      onClose={onClose}
      subtitle="Upload a new contract version for a benefit."
      title="Renew Contract"
      zIndexClass="z-[85]"
    >
      <div className="flex flex-col gap-4 py-2">
        <div className="rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] px-[13px] py-[13px]">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[12px] leading-4 text-[#737373]">Renewing expired contract</span>
            <span className="inline-flex h-[22px] items-center rounded-[8px] bg-[#E7000B] px-2 text-[12px] leading-4 font-medium text-white">Expired</span>
          </div>
          <div className="mt-2 text-[14px] leading-5 font-medium text-[#0A0A0A]">{contract.benefit}</div>
          <div className="text-[12px] leading-4 text-[#737373]">{contract.vendor} - {contract.version}</div>
          <div className="mt-2 text-[12px] leading-4 text-[#737373]">Current term: {contract.effectiveDate} - {contract.expiryDate}</div>
          <div className="text-[12px] leading-4 text-[#737373]">{contract.acceptedCount} employees accepted this version</div>
        </div>
        <ContractTextField label="New Version" onChange={setVersion} placeholder="e.g., v2025.1" value={version} />
        <ContractFileField
          accept={ACCEPTED_CONTRACT_TYPES}
          dragActive={dragActive}
          fileInputRef={fileInputRef}
          fileName={contractFile?.name ?? null}
          onDragActiveChange={setDragActive}
          onDrop={handleDrop}
          onFileChange={handleFileChange}
          onOpen={() => fileInputRef.current?.click()}
        />
        <div className="grid grid-cols-2 gap-4">
          <ContractDateField
            label="New Effective Date"
            onChange={(value) => setEffectiveDate(normalizeDateInput(value))}
            onPickerChange={(value) => setEffectiveDate(fromNativeDate(value))}
            pickerRef={effectiveDatePickerRef}
            value={effectiveDate}
          />
          <ContractDateField
            label="New Expiry Date"
            onChange={(value) => setExpiryDate(normalizeDateInput(value))}
            onPickerChange={(value) => setExpiryDate(fromNativeDate(value))}
            pickerRef={expiryDatePickerRef}
            value={expiryDate}
          />
        </div>
        <ContractTextareaField label="Notes / Change Summary (optional)" onChange={setNotes} placeholder="Describe key changes from the previous version..." value={notes} />
        <p className="text-[12px] leading-4 text-[#737373]">The new version will be uploaded and can be activated immediately or kept as a draft until you&apos;re ready.</p>
        <ContractDialogError message={errorMessage} />
      </div>

      <ContractDialogFooter
        onPrimary={() => void handleRenew()}
        onSecondary={onClose}
        primaryDisabled={renewing}
        primaryIcon={<RefreshCw className="h-4 w-4" />}
        primaryLabel={renewing ? "Renewing..." : "Renew Contract"}
        secondaryLabel="Cancel"
      />
    </ContractDialogShell>
  );
}
