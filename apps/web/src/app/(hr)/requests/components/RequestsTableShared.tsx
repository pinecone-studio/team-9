import type { KeyboardEvent, ReactNode } from "react";

export {
  AssigneeLabel,
  EntityTypeBadge,
  isAssignedToCurrentRole,
  OverrideTypeBadge,
  RequestStatusBadge,
} from "./RequestsTableDecorators";

export function EmptyTableState({ message }: { message: string }) {
  return (
    <div className="rounded-[16px] border border-dashed border-[#D9DEE5] bg-white px-6 py-12 text-center font-sans text-[14px] leading-6 text-[#737373]">
      {message}
    </div>
  );
}

export function DataTableShell({
  children,
  className,
  colgroup,
  tableClassName,
}: {
  children: ReactNode;
  className?: string;
  colgroup?: ReactNode;
  tableClassName?: string;
}) {
  return (
    <div className={`relative z-[1] h-full w-full overflow-auto ${className ?? ""}`}>
      <table
        className={`table-fixed border-collapse text-left font-sans ${tableClassName ?? "w-full min-w-full"}`}
      >
        {colgroup}
        {children}
      </table>
    </div>
  );
}

export function DataTableHeader({ labels }: { labels: string[] }) {
  return (
    <thead className="sticky top-0 z-10 bg-white">
      <tr className="border-b border-[#E5E5E5]">
        {labels.map((label) => (
          <th
            className="px-3 pt-[18px] pb-[18px] font-sans text-[14px] leading-5 font-medium text-[#171717]"
            key={label}
          >
            {label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function handleRowKeyDown(
  event: KeyboardEvent<HTMLTableRowElement>,
  onSelect: () => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onSelect();
  }
}

export function DataTableRow({
  children,
  dimmed = false,
  highlighted = false,
  onSelect,
}: {
  children: ReactNode;
  dimmed?: boolean;
  highlighted?: boolean;
  onSelect: () => void;
}) {
  return (
    <tr
      className={`h-[58px] cursor-pointer border-b border-[#E5E5E5] align-middle transition-colors hover:bg-[#FAFBFC] focus-visible:outline-none ${
        highlighted ? "bg-[rgba(239,246,255,0.3)]" : "bg-transparent"
      } ${dimmed ? "opacity-60" : ""}`}
      onClick={onSelect}
      onKeyDown={(event) => handleRowKeyDown(event, onSelect)}
      tabIndex={0}
    >
      {children}
    </tr>
  );
}

export function PrimaryCell({
  subtitle,
  title,
}: {
  subtitle?: string | null;
  title: string;
}) {
  return (
    <div className="flex flex-col items-start gap-0 font-sans">
      <span className="w-full truncate text-[16px] leading-6 font-medium text-[#171717]">
        {title}
      </span>
      {subtitle ? (
        <span className="w-full truncate text-[14px] leading-5 font-normal text-[#737373]">
          {subtitle}
        </span>
      ) : null}
    </div>
  );
}
