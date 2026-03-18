"use client";

import { ChevronDown } from "lucide-react";
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

type BenefitOption = {
  id: string;
  label: string;
  vendorName?: string | null;
};

type UploadContractDialogProps = {
  benefitOptions: BenefitOption[];
  initialBenefitId?: string;
  initialVendorName?: string;
  onClose: () => void;
  onCreate: (input: {
    benefitId: string;
    effectiveDate: string;
    expiryDate: string;
    file: File;
    notes: string;
    vendorName: string;
    version: string;
  }) => Promise<void>;
  creating?: boolean;
};

export default function UploadContractDialog({
  benefitOptions,
  initialBenefitId,
  initialVendorName,
  onClose,
  onCreate,
  creating = false,
}: UploadContractDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const effectiveDatePickerRef = useRef<HTMLInputElement | null>(null);
  const expiryDatePickerRef = useRef<HTMLInputElement | null>(null);
  const [vendorName, setVendorName] = useState(initialVendorName ?? "");
  const [version, setVersion] = useState("");
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [effectiveDate, setEffectiveDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [benefitId, setBenefitId] = useState(initialBenefitId ?? "");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const handleBenefitChange = (nextBenefitId: string) => {
    setBenefitId(nextBenefitId);
    const option = benefitOptions.find((item) => item.id === nextBenefitId) ?? null;
    if (option?.vendorName) setVendorName(option.vendorName);
  };

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

  async function handleCreate() {
    if (!vendorName.trim() || !version.trim() || !benefitId || !contractFile) {
      setErrorMessage("Vendor, version, benefit, and PDF file are required.");
      return;
    }
    if (!effectiveDate || !expiryDate) {
      setErrorMessage("Effective and expiry dates are required.");
      return;
    }

    try {
      setErrorMessage(null);
      await onCreate({
        benefitId,
        effectiveDate,
        expiryDate,
        file: contractFile,
        notes,
        vendorName: vendorName.trim(),
        version: version.trim(),
      });
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create contract.");
    }
  }

  return (
    <ContractDialogShell
      onClose={onClose}
      subtitle="Upload a new contract version for a benefit."
      title="Upload Contract"
      zIndexClass="z-[80]"
    >
      <div className="flex flex-col gap-4">
        <ContractTextField label="Vendor Name" onChange={setVendorName} placeholder="e.g., PineFit Corp" value={vendorName} />
        <ContractTextField label="Version" onChange={setVersion} placeholder="e.g., v2025.1" value={version} />
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
            label="Effective Date"
            onChange={(value) => setEffectiveDate(normalizeDateInput(value))}
            onPickerChange={(value) => setEffectiveDate(fromNativeDate(value))}
            pickerRef={effectiveDatePickerRef}
            value={effectiveDate}
          />
          <ContractDateField
            label="Expiry Date"
            onChange={(value) => setExpiryDate(normalizeDateInput(value))}
            onPickerChange={(value) => setExpiryDate(fromNativeDate(value))}
            pickerRef={expiryDatePickerRef}
            value={expiryDate}
          />
        </div>
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">Benefit</span>
          <div className="relative w-fit">
            <select
              className="h-9 appearance-none rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] py-2 pr-9 pl-3 text-[14px] leading-5 text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none"
              onChange={(event) => handleBenefitChange(event.target.value)}
              value={benefitId}
            >
              <option value="">Select a benefit</option>
              {benefitOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#737373]" />
          </div>
        </label>
        <ContractTextareaField label="Notes (optional)" onChange={setNotes} placeholder="Short description of contract changes..." value={notes} />
        <ContractDialogError message={errorMessage} />
      </div>

      <ContractDialogFooter
        onPrimary={() => void handleCreate()}
        onSecondary={onClose}
        primaryDisabled={creating}
        primaryLabel={creating ? "Creating..." : "Create a new Contract"}
        secondaryLabel="Cancel"
      />
    </ContractDialogShell>
  );
}
