import { X } from "lucide-react";

export default function ApprovalRequestReviewHeader({
  fallbackMeta,
  loading,
  onClose,
  subtitle,
  title,
}: {
  fallbackMeta: React.ReactNode;
  loading: boolean;
  onClose: () => void;
  subtitle: string | null;
  title: string;
}) {
  return (
    <div className="relative flex items-start justify-between px-6 pt-6">
      <div className="flex min-w-0 flex-col gap-2">
        {loading ? (
          <>
            <div className="h-7 w-48 animate-pulse rounded-md bg-slate-200/80" />
            <div className="h-5 w-72 animate-pulse rounded-md bg-slate-200/70" />
          </>
        ) : (
          <h2 className="font-['Inter',var(--font-geist-sans)] text-[18px] leading-7 font-semibold text-[#0F172A]">
            {title}
          </h2>
        )}
        {!loading && subtitle ? (
          <p className="font-['Inter',var(--font-geist-sans)] text-[14px] leading-5 text-[#64748B]">
            {subtitle}
          </p>
        ) : !loading ? (
          fallbackMeta
        ) : null}
      </div>
      <button
        aria-label="Close dialog"
        className="-mr-2 -mt-2 rounded-[8px] p-2 text-[#111827] transition hover:bg-[#F5F5F5]"
        onClick={onClose}
        type="button"
      >
        <X className="h-6 w-6" strokeWidth={2.25} />
      </button>
    </div>
  );
}
