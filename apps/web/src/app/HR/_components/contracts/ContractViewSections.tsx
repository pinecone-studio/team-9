import { Download, FileText, Upload } from "lucide-react";
import type { MutableRefObject, ReactNode } from "react";
import {
  ContractDateField,
  ContractDialogError,
  ContractTextareaField,
} from "./ContractDialogFields";
import type { HistoryRow, ContractViewContract } from "./contract-view-utils";
import { getStatusBadge, getStatusLabel } from "./contract-view-utils";

function OverviewItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] leading-4 text-[#737373]">{label}</span>
      <div className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{value}</div>
    </div>
  );
}

function ContractHistoryTable({ rows }: { rows: HistoryRow[] }) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#E5E5E5]">
      <div className="grid grid-cols-[76px_1fr_1fr_96px_82px] border-b border-[#E5E5E5] bg-white">
        {["Version", "Effective Date", "Expiry Date", "Status", "Actions"].map((label) => (
          <div className="px-4 py-[9.75px] text-[14px] leading-5 font-medium text-[#0A0A0A]" key={label}>{label}</div>
        ))}
      </div>
      <div className="bg-white">
        {rows.map((row, index) => (
          <div className={`grid grid-cols-[76px_1fr_1fr_96px_82px] ${index === rows.length - 1 ? "" : "border-b border-[#E5E5E5]"}`} key={`${row.version}-${row.effectiveDate}`}>
            <div className="px-4 py-2"><span className="inline-flex h-[22px] items-center rounded-[8px] border border-[#E5E5E5] px-2 text-[12px] leading-4 font-medium text-[#0A0A0A]">{row.version}</span></div>
            <div className="px-4 py-[9.5px] text-[14px] leading-5 text-[#737373]">{row.effectiveDate}</div>
            <div className="px-4 py-[9.5px] text-[14px] leading-5 text-[#737373]">{row.expiryDate}</div>
            <div className="px-4 py-2"><span className={`inline-flex h-[22px] items-center rounded-[8px] px-2 text-[12px] leading-4 font-medium ${getStatusBadge(row.status)}`}>{getStatusLabel(row.status)}</span></div>
            <div className={`px-4 py-[12px] text-[12px] leading-4 ${row.actionTone}`}>{row.actionLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContractOverviewSection({ contract, editMode }: { contract: ContractViewContract; editMode: boolean }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Contract Overview</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-[10px] rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] p-4">
        <div className="flex flex-col gap-[10px]">
          <OverviewItem label="Benefit" value={contract.benefit} />
          <OverviewItem label="Version" value={contract.version} />
          <div className={editMode ? "opacity-30" : ""}><OverviewItem label="Effective Date" value={contract.effectiveDate} /></div>
        </div>
        <div className="flex flex-col gap-[10px]">
          <OverviewItem label="Benefit" value={contract.benefit} />
          <OverviewItem label="Status" value={<span className={`inline-flex h-[22px] items-center rounded-[8px] px-2 text-[12px] leading-4 font-medium ${getStatusBadge(contract.status)}`}>{getStatusLabel(contract.status)}</span>} />
          <div className={editMode ? "opacity-30" : ""}><OverviewItem label="Expiry Date" value={contract.expiryDate} /></div>
        </div>
      </div>
    </section>
  );
}

type ContractFileSectionProps = {
  actionError: string | null;
  downloading: boolean;
  editMode: boolean;
  fileName: string;
  onDownload: () => void;
  onOpenFilePicker: () => void;
  uploadSummary: string;
};

export function ContractFileSection({ actionError, downloading, editMode, fileName, onDownload, onOpenFilePicker, uploadSummary }: ContractFileSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Contract File</h3>
      <div className="flex flex-col gap-4 rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] p-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center text-[#737373]"><FileText className="h-8 w-8" /></div>
          <div className="min-w-0">
            <p className="truncate text-[14px] leading-5 font-medium text-[#0A0A0A]">{fileName}</p>
            <p className="text-[12px] leading-4 text-[#737373]">{uploadSummary}</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-[156px]">
          {!editMode ? <button className="inline-flex h-8 items-center justify-center gap-2 rounded-[4px] border border-[#E5E5E5] bg-white px-[10px] text-[14px] leading-5 font-medium text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)]" onClick={onDownload} type="button"><Download className="h-4 w-4" />{downloading ? "Loading..." : "Download"}</button> : null}
          <button className="inline-flex h-8 w-[156px] items-center justify-center gap-[6px] rounded-[4px] bg-black px-[10px] text-center text-[12px] leading-5 font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]" onClick={onOpenFilePicker} type="button"><Upload className="h-4 w-4 shrink-0" />Upload New Version</button>
        </div>
      </div>
      <ContractDialogError message={actionError} />
    </section>
  );
}

type ContractEditFieldsProps = {
  actionError: string | null;
  draftEffectiveDate: string;
  draftExpiryDate: string;
  draftNotes: string;
  effectiveDatePickerRef: MutableRefObject<HTMLInputElement | null>;
  expiryDatePickerRef: MutableRefObject<HTMLInputElement | null>;
  onDraftEffectiveDateChange: (value: string) => void;
  onDraftExpiryDateChange: (value: string) => void;
  onDraftNotesChange: (value: string) => void;
  onPickerValueChange: (value: string, kind: "effective" | "expiry") => void;
};

export function ContractEditFields({ actionError, draftEffectiveDate, draftExpiryDate, draftNotes, effectiveDatePickerRef, expiryDatePickerRef, onDraftEffectiveDateChange, onDraftExpiryDateChange, onDraftNotesChange, onPickerValueChange }: ContractEditFieldsProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <ContractDateField label="Effective Date" onChange={onDraftEffectiveDateChange} onPickerChange={(value) => onPickerValueChange(value, "effective")} pickerRef={effectiveDatePickerRef} value={draftEffectiveDate} />
        <ContractDateField label="Expiry Date" onChange={onDraftExpiryDateChange} onPickerChange={(value) => onPickerValueChange(value, "expiry")} pickerRef={expiryDatePickerRef} value={draftExpiryDate} />
      </div>
      <ContractTextareaField label="Notes / Change Summary (optional)" onChange={onDraftNotesChange} placeholder="Describe key changes from the previous version..." value={draftNotes} />
      <ContractDialogError message={actionError} />
    </section>
  );
}

export function ContractHistorySection({ acceptedCount, rows }: { acceptedCount: number; rows: HistoryRow[] }) {
  return (
    <>
      <section className="flex items-center justify-between gap-4">
        <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Employee Acceptance Records</h3>
        <span className="inline-flex h-[30px] items-center rounded-[8px] bg-[#F5F5F5] px-3 text-[12px] leading-4 font-medium text-[#171717]">{acceptedCount} employees accepted this version</span>
      </section>
      <div className="h-px w-full bg-[#E5E5E5]" />
      <section className="flex flex-col gap-3">
        <h3 className="text-[14px] leading-5 font-semibold text-[#0A0A0A]">Version History</h3>
        <ContractHistoryTable rows={rows} />
      </section>
    </>
  );
}
