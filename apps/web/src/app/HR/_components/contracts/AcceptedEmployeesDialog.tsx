"use client";

import { useBenefitAcceptedEmployeesLazyQuery } from "@/shared/apollo/generated";
import { Loader2, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ContractDialogShell from "./ContractDialogShell";
import type { ContractRow } from "./contracts-types";
import {
  buildAcceptedEmployeesPrintHtml,
  formatPrintedDate,
} from "./accepted-employees-print";
import AcceptedEmployeesSelectionPanel from "./AcceptedEmployeesSelectionPanel";

type AcceptedEmployeesDialogProps = {
  contract: ContractRow;
  onClose: () => void;
};

export default function AcceptedEmployeesDialog({
  contract,
  onClose,
}: AcceptedEmployeesDialogProps) {
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [printError, setPrintError] = useState<string | null>(null);
  const [loadEmployees, { data, error, loading }] =
    useBenefitAcceptedEmployeesLazyQuery({
      fetchPolicy: "network-only",
    });

  useEffect(() => {
    void loadEmployees({ variables: { benefitId: contract.benefitId } });
  }, [contract.benefitId, loadEmployees]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const employees = useMemo(
    () => data?.benefitAcceptedEmployees ?? [],
    [data?.benefitAcceptedEmployees],
  );
  const printedDate = formatPrintedDate();
  const selectedEmployees = useMemo(
    () =>
      employees.filter((employee) => selectedEmployeeIds.includes(employee.id)),
    [employees, selectedEmployeeIds],
  );
  const selectedCount = selectedEmployees.length;
  const allSelected =
    employees.length > 0 && selectedCount === employees.length;

  function toggleEmployee(employeeId: string) {
    setPrintError(null);
    setSelectedEmployeeIds((current) =>
      current.includes(employeeId)
        ? current.filter((id) => id !== employeeId)
        : [...current, employeeId],
    );
  }

  function toggleSelectAll() {
    setPrintError(null);
    setSelectedEmployeeIds(
      allSelected ? [] : employees.map((employee) => employee.id),
    );
  }

  function handlePrintSelected() {
    if (selectedEmployees.length === 0) {
      setPrintError("Select at least one employee before printing.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setPrintError(
        "Allow pop-ups in your browser to print the selected contracts.",
      );
      return;
    }

    printWindow.document.open();
    printWindow.document.write(
      buildAcceptedEmployeesPrintHtml({
        benefit: contract.benefit,
        benefitId: contract.benefitId,
        employees: selectedEmployees.map(({ id, name }) => ({ id, name })),
        printedDate,
      }),
    );
    printWindow.document.close();
    setPrintError(null);
  }

  const content = loading ? (
    <div className="flex min-h-45 items-center justify-center gap-2 rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] text-[14px] leading-5 text-[#525252]">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading employees...
    </div>
  ) : error ? (
    <div className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[14px] leading-5 text-[#B91C1C]">
      Failed to load accepted employees.
    </div>
  ) : employees.length === 0 ? (
    <div className="flex min-h-45 flex-col items-center justify-center gap-3 rounded-[10px] border border-[#E5E5E5] bg-[rgba(245,245,245,0.3)] px-4 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#737373]">
        <Users className="h-5 w-5" />
      </div>
      <div className="space-y-1">
        <p className="text-[14px] leading-5 font-medium text-[#0A0A0A]">
          No accepted employees yet
        </p>
        <p className="text-[13px] leading-5 text-[#737373]">
          This contract version does not have any active employee acceptances
          right now.
        </p>
      </div>
    </div>
  ) : (
    <AcceptedEmployeesSelectionPanel
      allSelected={allSelected}
      employees={employees}
      onPrint={handlePrintSelected}
      onToggleEmployee={toggleEmployee}
      onToggleSelectAll={toggleSelectAll}
      printError={printError}
      printedDate={printedDate}
      selectedCount={selectedCount}
      selectedEmployeeIds={selectedEmployeeIds}
    />
  );

  return (
    <ContractDialogShell
      onClose={onClose}
      subtitle={`${contract.acceptedCount} active employees accepted ${contract.version}`}
      title={contract.benefit}
      zIndexClass="z-[70]"
    >
      <div className="flex max-h-105 w-full flex-col gap-4 overflow-y-auto">
        {content}
      </div>
    </ContractDialogShell>
  );
}
