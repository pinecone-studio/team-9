import { Printer } from "lucide-react";

type AcceptedEmployee = {
  department: string | null;
  email: string | null;
  id: string;
  name: string;
};

type AcceptedEmployeesSelectionPanelProps = {
  allSelected: boolean;
  employees: AcceptedEmployee[];
  onPrint: () => void;
  onToggleEmployee: (employeeId: string) => void;
  onToggleSelectAll: () => void;
  printError: string | null;
  printedDate: string;
  selectedCount: number;
  selectedEmployeeIds: string[];
};

export default function AcceptedEmployeesSelectionPanel({
  allSelected,
  employees,
  onPrint,
  onToggleEmployee,
  onToggleSelectAll,
  printError,
  printedDate,
  selectedCount,
  selectedEmployeeIds,
}: AcceptedEmployeesSelectionPanelProps) {
  const selectedIds = new Set(selectedEmployeeIds);

  return (
    <>
      <div className="flex items-center justify-between gap-3 rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] px-4 py-3">
        <label className="inline-flex items-center gap-2 text-[14px] leading-5 text-[#0A0A0A]">
          <input
            checked={allSelected}
            className="h-4 w-4 rounded border-[#D4D4D8] text-black focus:ring-black"
            onChange={onToggleSelectAll}
            type="checkbox"
          />
          Select all
        </label>
        <span className="text-[13px] leading-5 text-[#525252]">
          {selectedCount} selected
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-[10px] border border-[#E5E5E5] bg-white px-4 py-3">
        <span className="text-[13px] leading-5 text-[#525252]">
          Print date: {printedDate}
        </span>
        <button
          className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] bg-black px-3 text-[14px] leading-5 font-medium text-white disabled:cursor-not-allowed disabled:bg-[#A3A3A3]"
          disabled={selectedCount === 0}
          onClick={onPrint}
          type="button"
        >
          <Printer className="h-4 w-4" />
          Print selected
        </button>
      </div>

      {printError ? (
        <div className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[14px] leading-5 text-[#B91C1C]">
          {printError}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[10px] border border-[#E5E5E5]">
        <div className="grid grid-cols-[48px_1fr_160px] border-b border-[#E5E5E5] bg-white">
          <div className="px-4 py-[9.75px]" />
          <div className="px-4 py-[9.75px] text-[14px] leading-5 font-medium text-[#0A0A0A]">
            Employee Name
          </div>
          <div className="px-4 py-[9.75px] text-[14px] leading-5 font-medium text-[#0A0A0A]">
            Department
          </div>
        </div>
        <div className="bg-white">
          {employees.map((employee, index) => {
            const isSelected = selectedIds.has(employee.id);
            const rowClass = index === employees.length - 1 ? "" : "border-b border-[#E5E5E5]";

            return (
              <label
                className={`grid cursor-pointer grid-cols-[48px_1fr_160px] ${rowClass} ${isSelected ? "bg-[#F5F5F5]" : "bg-white"}`}
                key={employee.id}
              >
                <div className="flex items-center justify-center px-4 py-3">
                  <input
                    checked={isSelected}
                    className="h-4 w-4 rounded border-[#D4D4D8] text-black focus:ring-black"
                    onChange={() => onToggleEmployee(employee.id)}
                    type="checkbox"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
                    {employee.name}
                  </p>
                  <p className="text-[12px] leading-4 text-[#737373]">
                    {employee.email || "-"}
                  </p>
                </div>
                <div className="px-4 py-3 text-[14px] leading-5 text-[#525252]">
                  {employee.department || "-"}
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </>
  );
}
