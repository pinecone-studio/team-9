"use client";

import { CalendarDays, FileText, RefreshCw, X } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

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

const ACCEPTED_CONTRACT_TYPES = ".pdf";

function normalizeDateInput(value: string) {
  return value.replace(/[^\d.]/g, "").slice(0, 10);
}

function fromNativeDate(value: string) {
  if (!value) {
    return "";
  }

  return value.replace(/-/g, ".");
}

function isAcceptedFile(file: File) {
  return file.name.toLowerCase().endsWith(".pdf");
}

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
    if (!file) {
      return;
    }

    if (!isAcceptedFile(file)) {
      setErrorMessage("Only PDF files are allowed.");
      return;
    }

    setContractFile(file);
    setErrorMessage(null);
  }

  function openFilePicker() {
    fileInputRef.current?.click();
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
    <div
      className="fixed inset-0 z-[85] overflow-y-auto bg-black/50 px-4 py-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="mx-auto flex min-h-full items-center justify-center">
        <div
          aria-modal="true"
          className="relative flex w-full max-w-[500px] flex-col rounded-[8px] border border-[#CBD5E1] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.18)]"
          role="dialog"
        >
          <button
            aria-label="Close dialog"
            className="absolute top-[14px] right-3 rounded-[8px] p-1 text-black"
            onClick={onClose}
            type="button"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-2 pr-10">
              <h2 className="text-[18px] leading-7 font-semibold text-[#0F172A]">
                Renew Contract
              </h2>
              <p className="text-[14px] leading-5 text-[#64748B]">
                Upload a new contract version for a benefit.
              </p>
            </div>

            <div className="flex flex-col gap-4 py-2">
              <div className="rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] px-[13px] py-[13px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[12px] leading-4 text-[#737373]">
                    Renewing expired contract
                  </span>
                  <span className="inline-flex h-[22px] items-center rounded-[8px] bg-[#E7000B] px-2 text-[12px] leading-4 font-medium text-white">
                    Expired
                  </span>
                </div>
                <div className="mt-2 text-[14px] leading-5 font-medium text-[#0A0A0A]">
                  {contract.benefit}
                </div>
                <div className="text-[12px] leading-4 text-[#737373]">
                  {contract.vendor} - {contract.version}
                </div>
                <div className="mt-2 text-[12px] leading-4 text-[#737373]">
                  Current term: {contract.effectiveDate} - {contract.expiryDate}
                </div>
                <div className="text-[12px] leading-4 text-[#737373]">
                  {contract.acceptedCount} employees accepted this version
                </div>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">
                  New Version
                </span>
                <input
                  className="h-9 rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]"
                  onChange={(event) => setVersion(event.target.value)}
                  placeholder="e.g., v2025.1"
                  type="text"
                  value={version}
                />
              </label>

              <div className="flex flex-col gap-2">
                <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">
                  Contract File
                </span>
                <input
                  accept={ACCEPTED_CONTRACT_TYPES}
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  type="file"
                />
                <button
                  className={`relative flex h-[132px] w-full flex-col items-center justify-center rounded-[10px] border-2 border-dashed px-6 text-center transition ${
                    dragActive
                      ? "border-[#A3A3A3] bg-[#FAFAFA]"
                      : "border-[#E5E5E5] bg-white"
                  }`}
                  onClick={openFilePicker}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    setDragActive(false);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDrop={handleDrop}
                  type="button"
                >
                  <FileText className="h-8 w-8 text-[#737373]" />
                  <span className="mt-[18px] text-[14px] leading-5 text-[#737373]">
                    {contractFile ? contractFile.name : "Click to upload or drag and drop"}
                  </span>
                  <span className="mt-1 text-[12px] leading-4 text-[#737373]">
                    PDF files only
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">
                    New Effective Date
                  </label>
                  <div className="flex h-9 items-center rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    <input
                      className="w-full border-0 bg-transparent text-[14px] leading-5 text-[#0A0A0A] outline-none placeholder:text-[#737373]"
                      onChange={(event) => setEffectiveDate(normalizeDateInput(event.target.value))}
                      placeholder="yyyy.mm.dd"
                      type="text"
                      value={effectiveDate}
                    />
                    <button
                      className="ml-2 text-black"
                      onClick={() => effectiveDatePickerRef.current?.showPicker?.()}
                      type="button"
                    >
                      <CalendarDays className="h-[18px] w-[18px]" />
                    </button>
                    <input
                      className="hidden"
                      onChange={(event) => setEffectiveDate(fromNativeDate(event.target.value))}
                      ref={effectiveDatePickerRef}
                      type="date"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">
                    New Expiry Date
                  </label>
                  <div className="flex h-9 items-center rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    <input
                      className="w-full border-0 bg-transparent text-[14px] leading-5 text-[#0A0A0A] outline-none placeholder:text-[#737373]"
                      onChange={(event) => setExpiryDate(normalizeDateInput(event.target.value))}
                      placeholder="yyyy.mm.dd"
                      type="text"
                      value={expiryDate}
                    />
                    <button
                      className="ml-2 text-black"
                      onClick={() => expiryDatePickerRef.current?.showPicker?.()}
                      type="button"
                    >
                      <CalendarDays className="h-[18px] w-[18px]" />
                    </button>
                    <input
                      className="hidden"
                      onChange={(event) => setExpiryDate(fromNativeDate(event.target.value))}
                      ref={expiryDatePickerRef}
                      type="date"
                    />
                  </div>
                </div>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">
                  Notes / Change Summary (optional)
                </span>
                <textarea
                  className="min-h-16 rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-[13px] py-[9px] text-[14px] leading-5 text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]"
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Describe key changes from the previous version..."
                  value={notes}
                />
              </label>

              <p className="text-[12px] leading-4 text-[#737373]">
                The new version will be uploaded and can be activated immediately or kept
                as a draft until you're ready.
              </p>

              {errorMessage ? (
                <p className="rounded-[8px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[12px] leading-4 text-[#B42318]">
                  {errorMessage}
                </p>
              ) : null}
            </div>

            <div className="flex justify-end">
              <div className="flex items-center gap-[9px]">
                <button
                  className="inline-flex h-9 items-center justify-center rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] px-[14px] text-[14px] leading-4 text-black"
                  onClick={onClose}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] bg-black px-[26px] text-[14px] leading-4 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={renewing}
                  onClick={() => void handleRenew()}
                  type="button"
                >
                  <RefreshCw className="h-4 w-4" />
                  {renewing ? "Renewing..." : "Renew Contract"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
