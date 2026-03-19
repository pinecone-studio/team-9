"use client";

import { CalendarDays, Eye, FileText, Trash2, Upload } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";

const ACCEPTED_CONTRACT_TYPES = ".pdf,.doc,.docx";

type AddBenefitContractUploadProps = {
  contractFile: File | null;
  contractEffectiveDate: string;
  contractExpiryDate: string;
  onContractFileChange: (file: File | null) => void;
  onContractEffectiveDateChange: (value: string) => void;
  onContractExpiryDateChange: (value: string) => void;
  requiresContract: boolean;
};

function isAcceptedContractFile(fileName: string) {
  const lowered = fileName.toLowerCase();
  return lowered.endsWith(".pdf") || lowered.endsWith(".doc") || lowered.endsWith(".docx");
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  return `${(kb / 1024).toFixed(1)} MB`;
}

function normalizeDateInput(value: string) {
  return value.replace(/[^\d.]/g, "").slice(0, 10);
}

function formatNativeDate(value: string) {
  return value.replace(/-/g, ".");
}

export default function AddBenefitContractUpload({
  contractFile,
  contractEffectiveDate,
  contractExpiryDate,
  onContractFileChange,
  onContractEffectiveDateChange,
  onContractExpiryDateChange,
  requiresContract,
}: AddBenefitContractUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const effectiveDatePickerRef = useRef<HTMLInputElement | null>(null);
  const expiryDatePickerRef = useRef<HTMLInputElement | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  function openFilePicker() {
    if (!requiresContract) {
      return;
    }

    inputRef.current?.click();
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!isAcceptedContractFile(file.name)) {
      setFileError("Only PDF, DOC, or DOCX files are allowed.");
      event.target.value = "";
      return;
    }

    setFileError(null);
    onContractFileChange(file);
  }

  function clearFile() {
    onContractFileChange(null);
    setFileError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function viewFile() {
    if (!contractFile) {
      return;
    }

    const fileUrl = URL.createObjectURL(contractFile);
    window.open(fileUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(fileUrl), 60_000);
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <input
        accept={ACCEPTED_CONTRACT_TYPES}
        className="hidden"
        onChange={handleFileChange}
        ref={inputRef}
        type="file"
      />

      <button
        className="flex h-9 w-full items-center justify-center gap-2 rounded-[8px] border border-[#CBD5E1] bg-white text-[14px] leading-5 font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:text-[#BFBFBF]"
        disabled={!requiresContract}
        onClick={openFilePicker}
        type="button"
      >
        <Upload className="h-4 w-4" />
        {contractFile ? "Replace Contract" : "Upload Contract"}
      </button>

      {fileError ? (
        <p className="rounded-[6px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[12px] leading-4 text-[#B42318]">
          {fileError}
        </p>
      ) : null}

      <div className="grid w-full gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-4 font-medium text-black">Effective Date</span>
          <div className={`flex h-9 items-center rounded-[8px] border border-[#CBD5E1] bg-white px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${requiresContract ? "" : "opacity-60"}`}>
            <input
              className="w-full border-0 bg-transparent text-[14px] leading-5 text-[#0F172A] outline-none placeholder:text-[#94A3B8] disabled:cursor-not-allowed"
              disabled={!requiresContract}
              onChange={(event) => onContractEffectiveDateChange(normalizeDateInput(event.target.value))}
              placeholder="yyyy.mm.dd"
              type="text"
              value={contractEffectiveDate}
            />
            <button
              className="ml-2 text-black disabled:cursor-not-allowed disabled:text-[#94A3B8]"
              disabled={!requiresContract}
              onClick={() => effectiveDatePickerRef.current?.showPicker?.()}
              type="button"
            >
              <CalendarDays className="h-[18px] w-[18px]" />
            </button>
            <input
              className="hidden"
              onChange={(event) => onContractEffectiveDateChange(formatNativeDate(event.target.value))}
              ref={effectiveDatePickerRef}
              type="date"
            />
          </div>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[14px] leading-4 font-medium text-black">Expiry Date</span>
          <div className={`flex h-9 items-center rounded-[8px] border border-[#CBD5E1] bg-white px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${requiresContract ? "" : "opacity-60"}`}>
            <input
              className="w-full border-0 bg-transparent text-[14px] leading-5 text-[#0F172A] outline-none placeholder:text-[#94A3B8] disabled:cursor-not-allowed"
              disabled={!requiresContract}
              onChange={(event) => onContractExpiryDateChange(normalizeDateInput(event.target.value))}
              placeholder="yyyy.mm.dd"
              type="text"
              value={contractExpiryDate}
            />
            <button
              className="ml-2 text-black disabled:cursor-not-allowed disabled:text-[#94A3B8]"
              disabled={!requiresContract}
              onClick={() => expiryDatePickerRef.current?.showPicker?.()}
              type="button"
            >
              <CalendarDays className="h-[18px] w-[18px]" />
            </button>
            <input
              className="hidden"
              onChange={(event) => onContractExpiryDateChange(formatNativeDate(event.target.value))}
              ref={expiryDatePickerRef}
              type="date"
            />
          </div>
        </label>
      </div>

      {requiresContract && contractFile ? (
        <div className="flex w-full items-center justify-between rounded-[10px] border border-[#CBD5E1] bg-[rgba(245,245,245,0.3)] p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#E5E5E5] bg-white">
              <FileText className="h-5 w-5 text-[#737373]" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[14px] leading-5 font-medium text-[#0A0A0A]">
                {contractFile.name}
              </p>
              <p className="text-[12px] leading-4 text-[#737373]">{formatFileSize(contractFile.size)}</p>
            </div>
          </div>

          <div className="ml-3 flex items-center gap-2">
            <button
              className="flex h-8 items-center justify-center gap-1 rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[12px] leading-4 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              onClick={viewFile}
              type="button"
            >
              <Eye className="h-3.5 w-3.5" />
              View
            </button>
            <button
              className="flex h-8 items-center justify-center gap-1 rounded-[8px] border border-[#E5E5E5] bg-white px-3 text-[12px] leading-4 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              onClick={clearFile}
              type="button"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
