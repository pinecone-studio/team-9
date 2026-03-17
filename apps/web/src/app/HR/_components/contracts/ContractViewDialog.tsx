"use client";

import { useContractSignedUrlByBenefitLazyQuery } from "@/shared/apollo/generated";
import { CalendarDays, Download, FileText, Upload, X } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

type ContractStatus = "active" | "expiring" | "expired" | "archived";

type ContractViewDialogProps = {
  contract: {
    acceptedCount: number;
    benefit: string;
    benefitId: string;
    effectiveDate: string;
    expiryDate: string;
    status: ContractStatus;
    vendor: string;
    version: string;
  };
  onClose: () => void;
  onSaveNewVersion: (input: {
    benefitId: string;
    effectiveDate: string;
    expiryDate: string;
    file: File;
    notes: string;
    vendorName: string;
    version: string;
  }) => Promise<void>;
  savingNewVersion?: boolean;
};

type HistoryRow = {
  actionLabel: string;
  actionTone: string;
  effectiveDate: string;
  expiryDate: string;
  status: ContractStatus;
  version: string;
};

const ACCEPTED_CONTRACT_TYPES = ".pdf,.doc,.docx";

function resolveSignedContractUrl(signedUrl: string) {
  if (/^https?:\/\//i.test(signedUrl)) {
    return signedUrl;
  }

  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
  if (endpoint) {
    return new URL(signedUrl, new URL(endpoint).origin).toString();
  }

  return new URL(signedUrl, window.location.origin).toString();
}

function slugifyFilePart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function buildContractFileName(vendor: string, version: string) {
  const vendorPart = slugifyFilePart(vendor || "contract");
  const versionPart = slugifyFilePart(version || "v1");
  return `${vendorPart || "contract"}_contract_${versionPart || "v1"}.pdf`;
}

function getStatusBadge(status: ContractStatus) {
  if (status === "active") {
    return "bg-[#DCFCE7] text-[#016630]";
  }

  if (status === "expiring") {
    return "bg-[#FEF3C6] text-[#973C00]";
  }

  if (status === "expired") {
    return "bg-[#FEF2F2] text-[#E7000B]";
  }

  return "bg-[#F5F5F5] text-[#171717]";
}

function getStatusLabel(status: ContractStatus) {
  if (status === "expiring") {
    return "Expiring Soon";
  }

  if (status === "expired") {
    return "Expired";
  }

  if (status === "archived") {
    return "Archived";
  }

  return "Active";
}

function shiftDate(value: string, years: number) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  parsed.setFullYear(parsed.getFullYear() + years);

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function derivePreviousVersion(version: string) {
  const match = version.match(/^v(\d+)(?:\.(\d+))?$/i);
  if (!match) {
    return null;
  }

  const major = Number.parseInt(match[1] ?? "0", 10);
  const minor = Number.parseInt(match[2] ?? "0", 10);

  if (major <= 0 && minor <= 0) {
    return null;
  }

  if (minor > 0) {
    return `v${major}.${minor - 1}`;
  }

  if (major > 1) {
    return `v${major - 1}.0`;
  }

  return null;
}

function deriveNextVersion(version: string) {
  const match = version.match(/^v(\d+)(?:\.(\d+))?$/i);
  if (!match) {
    return version;
  }

  const major = Number.parseInt(match[1] ?? "1", 10);
  const minor = Number.parseInt(match[2] ?? "0", 10);
  return `v${major}.${minor + 1}`;
}

function buildHistoryRows(contract: ContractViewDialogProps["contract"]): HistoryRow[] {
  const rows: HistoryRow[] = [
    {
      actionLabel: contract.status === "active" ? "Current" : "Expired",
      actionTone: contract.status === "active" ? "text-[#00A63E]" : "text-[#E7000B]",
      effectiveDate: contract.effectiveDate,
      expiryDate: contract.expiryDate,
      status: contract.status,
      version: contract.version,
    },
  ];

  const previousVersion = derivePreviousVersion(contract.version);
  if (previousVersion) {
    rows.push({
      actionLabel: "Expired",
      actionTone: "text-[#E7000B]",
      effectiveDate: shiftDate(contract.effectiveDate, -1),
      expiryDate: shiftDate(contract.expiryDate, -1),
      status: "archived",
      version: previousVersion,
    });
  }

  return rows;
}

function toEditableDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

function toDisplayDate(value: string) {
  const normalized = value.replace(/\./g, "-");
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function ContractHistoryTable({ rows }: { rows: HistoryRow[] }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#E5E5E5]">
      <div className="grid grid-cols-[76px_1fr_1fr_96px_82px] border-b border-[#E5E5E5] bg-white">
        {["Version", "Effective Date", "Expiry Date", "Status", "Actions"].map((label) => (
          <div
            className="px-4 py-[9.75px] text-[14px] leading-5 font-medium text-[#0A0A0A]"
            key={label}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="bg-white">
        {rows.map((row, index) => (
          <div
            className={`grid grid-cols-[76px_1fr_1fr_96px_82px] ${
              index === rows.length - 1 ? "" : "border-b border-[#E5E5E5]"
            }`}
            key={`${row.version}-${row.effectiveDate}`}
          >
            <div className="px-4 py-2">
              <span className="inline-flex h-[22px] items-center rounded-[8px] border border-[#E5E5E5] px-2 text-[12px] leading-4 font-medium text-[#0A0A0A]">
                {row.version}
              </span>
            </div>
            <div className="px-4 py-[9.5px] text-[14px] leading-5 text-[#737373]">
              {row.effectiveDate}
            </div>
            <div className="px-4 py-[9.5px] text-[14px] leading-5 text-[#737373]">
              {row.expiryDate}
            </div>
            <div className="px-4 py-2">
              <span
                className={`inline-flex h-[22px] items-center rounded-[8px] px-2 text-[12px] leading-4 font-medium ${getStatusBadge(
                  row.status,
                )}`}
              >
                {getStatusLabel(row.status)}
              </span>
            </div>
            <div className={`px-4 py-[12px] text-[12px] leading-4 ${row.actionTone}`}>
              {row.actionLabel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverviewItem({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] leading-4 text-[#737373]">{label}</span>
      <div className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{value}</div>
    </div>
  );
}

export default function ContractViewDialog({
  contract,
  onClose,
  onSaveNewVersion,
  savingNewVersion = false,
}: ContractViewDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const effectiveDatePickerRef = useRef<HTMLInputElement | null>(null);
  const expiryDatePickerRef = useRef<HTMLInputElement | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [savedFile, setSavedFile] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [savedEffectiveDate, setSavedEffectiveDate] = useState(contract.effectiveDate);
  const [savedExpiryDate, setSavedExpiryDate] = useState(contract.expiryDate);
  const [draftEffectiveDate, setDraftEffectiveDate] = useState(toEditableDate(contract.effectiveDate));
  const [draftExpiryDate, setDraftExpiryDate] = useState(toEditableDate(contract.expiryDate));
  const [draftNotes, setDraftNotes] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);
  const [fetchSignedUrl, { loading: downloading }] = useContractSignedUrlByBenefitLazyQuery({
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    setSavedEffectiveDate(contract.effectiveDate);
    setSavedExpiryDate(contract.expiryDate);
  }, [contract.effectiveDate, contract.expiryDate]);

  const historyRows = useMemo(() => buildHistoryRows(contract), [contract]);
  const fileName = useMemo(
    () =>
      savedFile?.name ??
      buildContractFileName(contract.vendor || contract.benefit, contract.version),
    [contract.benefit, contract.vendor, contract.version, savedFile?.name],
  );

  const uploadSummary = savedFile
    ? "New contract file selected for this version."
    : `Uploaded for ${contract.version} and active since ${savedEffectiveDate}.`;

  function openFilePicker() {
    setEditMode(true);
    fileInputRef.current?.click();
  }

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setActionError(null);
  }

  function normalizeDateInput(value: string) {
    return value.replace(/[^\d.]/g, "").slice(0, 10);
  }

  function handleDatePickerValue(value: string, kind: "effective" | "expiry") {
    if (!value) {
      return;
    }

    const formatted = value.replace(/-/g, ".");
    if (kind === "effective") {
      setDraftEffectiveDate(formatted);
      return;
    }

    setDraftExpiryDate(formatted);
  }

  async function handleDownload() {
    if (savedFile) {
      const blobUrl = URL.createObjectURL(savedFile);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = savedFile.name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
      return;
    }

    setActionError(null);

    try {
      const { data } = await fetchSignedUrl({
        variables: { benefitId: contract.benefitId },
      });
      const signedUrl = data?.contractSignedUrlByBenefit.signedUrl;

      if (!signedUrl) {
        setActionError("No active contract file found for this benefit.");
        return;
      }

      window.open(resolveSignedContractUrl(signedUrl), "_blank", "noopener,noreferrer");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to download contract.");
    }
  }

  async function handleSaveNewVersion() {
    if (!selectedFile) {
      setActionError("Select a new contract file before saving.");
      return;
    }

    if (!draftEffectiveDate || !draftExpiryDate) {
      setActionError("Enter both effective and expiry dates.");
      return;
    }

    try {
      setActionError(null);
      await onSaveNewVersion({
        benefitId: contract.benefitId,
        effectiveDate: draftEffectiveDate,
        expiryDate: draftExpiryDate,
        file: selectedFile,
        notes: draftNotes,
        vendorName: contract.vendor,
        version: deriveNextVersion(contract.version),
      });
      setSavedFile(selectedFile);
      setSavedEffectiveDate(toDisplayDate(draftEffectiveDate));
      setSavedExpiryDate(toDisplayDate(draftExpiryDate));
      setEditMode(false);
      setDraftNotes("");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to save new version.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-black/50 px-4 py-6"
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
            <div className="z-0 flex w-full flex-col gap-2 pr-10">
              <h2 className="text-[18px] leading-7 font-semibold text-[#0F172A]">
                {contract.benefit}
              </h2>
              <p className="text-[14px] leading-5 text-[#64748B]">Contract Details</p>
            </div>

            <div className="z-10 flex max-h-[651px] w-full flex-col gap-5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <section className="flex flex-col gap-3">
                <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">
                  Contract Overview
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-[10px] rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] p-4">
                  <div className="flex flex-col gap-[10px]">
                    <OverviewItem label="Benefit" value={contract.benefit} />
                    <OverviewItem label="Version" value={contract.version} />
                    <div className={editMode ? "opacity-30" : ""}>
                      <OverviewItem label="Effective Date" value={savedEffectiveDate} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[10px]">
                    <OverviewItem label="Benefit" value={contract.benefit} />
                    <OverviewItem
                      label="Status"
                      value={
                        <span
                          className={`inline-flex h-[22px] items-center rounded-[8px] px-2 text-[12px] leading-4 font-medium ${getStatusBadge(
                            contract.status,
                          )}`}
                        >
                          {getStatusLabel(contract.status)}
                        </span>
                      }
                    />
                    <div className={editMode ? "opacity-30" : ""}>
                      <OverviewItem label="Expiry Date" value={savedExpiryDate} />
                    </div>
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-3">
                <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">
                  Contract File
                </h3>

                <div className="flex flex-col gap-4 rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] p-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center text-[#737373]">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] leading-5 font-medium text-[#0A0A0A]">
                        {fileName}
                      </p>
                      <p className="text-[12px] leading-4 text-[#737373]">{uploadSummary}</p>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-3 sm:w-[156px]">
                    {!editMode ? (
                      <button
                        className="inline-flex h-8 items-center justify-center gap-2 rounded-[4px] border border-[#E5E5E5] bg-white px-[10px] text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                        onClick={() => void handleDownload()}
                        type="button"
                      >
                        <Download className="h-4 w-4" />
                        {downloading ? "Loading..." : "Download"}
                      </button>
                    ) : null}
                    <button
                      className="inline-flex h-8 w-[156px] items-center justify-center gap-[6px] rounded-[4px] bg-black px-[10px] text-center text-[12px] leading-5 font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                      onClick={openFilePicker}
                      type="button"
                    >
                      <Upload className="h-4 w-4 shrink-0" />
                      Upload New Version
                    </button>
                  </div>
                </div>

                <input
                  accept={ACCEPTED_CONTRACT_TYPES}
                  className="hidden"
                  onChange={handleFileSelected}
                  ref={fileInputRef}
                  type="file"
                />

                {actionError ? (
                  <p className="rounded-[8px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[12px] leading-4 text-[#B42318]">
                    {actionError}
                  </p>
                ) : null}
              </section>

              {editMode ? (
                <section className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">
                        Effective Date
                      </label>
                      <div className="flex h-9 items-center rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                        <input
                          className="w-full border-0 bg-transparent text-[14px] leading-5 text-[#0A0A0A] outline-none placeholder:text-[#737373]"
                          onChange={(event) => setDraftEffectiveDate(normalizeDateInput(event.target.value))}
                          placeholder="yyyy.mm.dd"
                          type="text"
                          value={draftEffectiveDate}
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
                          onChange={(event) => handleDatePickerValue(event.target.value, "effective")}
                          ref={effectiveDatePickerRef}
                          type="date"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">
                        Expiry Date
                      </label>
                      <div className="flex h-9 items-center rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                        <input
                          className="w-full border-0 bg-transparent text-[14px] leading-5 text-[#0A0A0A] outline-none placeholder:text-[#737373]"
                          onChange={(event) => setDraftExpiryDate(normalizeDateInput(event.target.value))}
                          placeholder="yyyy.mm.dd"
                          type="text"
                          value={draftExpiryDate}
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
                          onChange={(event) => handleDatePickerValue(event.target.value, "expiry")}
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
                      onChange={(event) => setDraftNotes(event.target.value)}
                      placeholder="Describe key changes from the previous version..."
                      value={draftNotes}
                    />
                  </label>
                </section>
              ) : null}

              <section className="flex items-center justify-between gap-4">
                <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">
                  Employee Acceptance Records
                </h3>
                <span className="inline-flex h-[30px] items-center rounded-[8px] bg-[#F5F5F5] px-3 text-[12px] leading-4 font-medium text-[#171717]">
                  {contract.acceptedCount} employees accepted this version
                </span>
              </section>

              <div className="h-px w-full bg-[#E5E5E5]" />

              <section className="flex flex-col gap-3">
                <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">
                  Version History
                </h3>
                <ContractHistoryTable rows={historyRows} />
              </section>
            </div>

            <div className="z-20 flex w-full justify-end">
              <div className="flex items-center gap-[9px]">
                <button
                  className="inline-flex h-9 items-center justify-center rounded-[6px] border border-[#D8DFE6] bg-[#F3F5F8] px-[18px] text-[14px] leading-4 text-black"
                  onClick={onClose}
                  type="button"
                >
                  Close
                </button>
                <button
                  className={`inline-flex h-9 items-center justify-center rounded-[6px] px-[26px] text-[14px] leading-4 font-medium text-white ${
                    editMode ? "bg-black" : "bg-[#737373]"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                  disabled={editMode && savingNewVersion}
                  onClick={editMode ? () => void handleSaveNewVersion() : openFilePicker}
                  type="button"
                >
                  {editMode && savingNewVersion ? "Saving..." : "Save New Version"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
