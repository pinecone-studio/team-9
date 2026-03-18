import { CalendarDays, FileText } from "lucide-react";
import type {
  ChangeEvent,
  DragEvent,
  MutableRefObject,
} from "react";

export function ContractTextField({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">{label}</span>
      <input
        className="h-9 rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 text-[14px] leading-[18px] text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
    </label>
  );
}

export function ContractDateField({
  label,
  onChange,
  onPickerChange,
  pickerRef,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  onPickerChange: (value: string) => void;
  pickerRef: MutableRefObject<HTMLInputElement | null>;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">{label}</label>
      <div className="flex h-9 items-center rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <input
          className="w-full border-0 bg-transparent text-[14px] leading-5 text-[#0A0A0A] outline-none placeholder:text-[#737373]"
          onChange={(event) => onChange(event.target.value)}
          placeholder="yyyy.mm.dd"
          type="text"
          value={value}
        />
        <button className="ml-2 text-black" onClick={() => pickerRef.current?.showPicker?.()} type="button">
          <CalendarDays className="h-[18px] w-[18px]" />
        </button>
        <input className="hidden" onChange={(event) => onPickerChange(event.target.value)} ref={pickerRef} type="date" />
      </div>
    </div>
  );
}

export function ContractFileField({
  accept,
  dragActive,
  fileInputRef,
  fileName,
  onDragActiveChange,
  onDrop,
  onFileChange,
  onOpen,
}: {
  accept: string;
  dragActive: boolean;
  fileInputRef: MutableRefObject<HTMLInputElement | null>;
  fileName: string | null;
  onDragActiveChange: (active: boolean) => void;
  onDrop: (event: DragEvent<HTMLButtonElement>) => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onOpen: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">Contract File</span>
      <input accept={accept} className="hidden" onChange={onFileChange} ref={fileInputRef} type="file" />
      <button
        className={`relative flex h-[132px] w-full flex-col items-center justify-center rounded-[10px] border-2 border-dashed px-6 text-center transition ${dragActive ? "border-[#A3A3A3] bg-[#FAFAFA]" : "border-[#E5E5E5] bg-white"}`}
        onClick={onOpen}
        onDragEnter={(event) => {
          event.preventDefault();
          onDragActiveChange(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          onDragActiveChange(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          onDragActiveChange(true);
        }}
        onDrop={onDrop}
        type="button"
      >
        <FileText className="h-8 w-8 text-[#737373]" />
        <span className="mt-[18px] text-[14px] leading-5 text-[#737373]">{fileName ?? "Click to upload or drag and drop"}</span>
        <span className="mt-1 text-[12px] leading-4 text-[#737373]">PDF files only</span>
      </button>
    </div>
  );
}

export function ContractTextareaField({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[14px] leading-[14px] font-medium text-[#0A0A0A]">{label}</span>
      <textarea
        className="min-h-16 rounded-[8px] border border-[#E5E5E5] bg-[rgba(255,255,255,0.002)] px-[13px] py-[9px] text-[14px] leading-5 text-[#0A0A0A] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#737373]"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
}

export function ContractDialogError({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="rounded-[8px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[12px] leading-4 text-[#B42318]">{message}</p>;
}
