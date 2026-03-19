"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  useEmployeeDirectoryDialogQuery,
  useOverrideEmployeeBenefitEligibilityMutation,
} from "@/shared/apollo/generated";
import type { Employee } from "@/shared/apollo/types";
import EmployeeDirectoryDialogBenefits from "@/shared/graphql/employee-directory-dialog-benefits";
import EmployeeDirectoryDialogLoading from "@/shared/graphql/employee-directory-dialog-loading";
import EmployeeEditDialog from "@/shared/graphql/employee-edit-dialog";
import EmployeeDirectoryDialogOverview from "@/shared/graphql/employee-directory-dialog-overview";
import EmployeeDirectoryDialogRecentActions from "@/shared/graphql/employee-directory-dialog-recent-actions";
import { formatStatusLabel } from "@/shared/graphql/employee-directory-dialog-utils";
import { getStatusBadgeTone } from "@/shared/graphql/employees-page-view-utils";
const BULK_OVERRIDE_KEY = "__bulk__";
type EmployeeDirectoryDialogProps = {
  allEmployees: Employee[];
  currentUserIdentifier: string | null;
  employee: Employee;
  onClose: () => void;
};
export default function EmployeeDirectoryDialog({
  allEmployees,
  currentUserIdentifier,
  employee,
  onClose,
}: EmployeeDirectoryDialogProps) {
  const [actionError, setActionError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [overridingKey, setOverridingKey] = useState<string | null>(null);
  const isEditDialogOpenRef = useRef(false);
  const { data, error, loading, refetch } = useEmployeeDirectoryDialogQuery({
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    variables: { employeeId: employee.id },
  });
  const [overrideEligibility] = useOverrideEmployeeBenefitEligibilityMutation();
  const dialogEmployee = data?.employee ?? employee;
  const employeeBenefits = data?.employeeEligibility ?? [];
  const benefitRequests = data?.benefitRequests ?? [];
  const overrideDisabled =
    !currentUserIdentifier ||
    overridingKey !== null ||
    employeeBenefits.every((benefit) => benefit.status !== "locked");
  isEditDialogOpenRef.current = isEditDialogOpen;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isEditDialogOpenRef.current) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  async function handleOverride(benefitId?: string) {
    if (!currentUserIdentifier) {
      setActionError("Your employee record could not be resolved for override actions.");
      return;
    }

    setActionError(null);
    setOverridingKey(benefitId ?? BULK_OVERRIDE_KEY);

    try {
      await overrideEligibility({
        variables: {
          input: {
            benefitId,
            employeeId: employee.id,
            overrideBy: currentUserIdentifier,
          },
        },
      });
      await refetch();
    } catch (caughtError) {
      setActionError(
        caughtError instanceof Error ? caughtError.message : "Unable to override eligibility.",
      );
    } finally {
      setOverridingKey(null);
    }
  }

  if (isEditDialogOpen) {
    return (
      <EmployeeEditDialog
        employee={dialogEmployee}
        employees={allEmployees}
        onClose={() => setIsEditDialogOpen(false)}
        onDeleted={() => {
          setIsEditDialogOpen(false);
          onClose();
        }}
        onSaved={async () => {
          await refetch();
          setIsEditDialogOpen(false);
        }}
      />
    );
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
      <div
        className="mx-auto flex min-h-full items-center justify-center"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="relative flex h-[780px] max-h-[calc(100vh-48px)] w-full max-w-[600px] flex-col overflow-hidden rounded-[12px] border border-[#D4D4D8] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.18)]">
          <button aria-label="Close dialog" className="absolute top-3 right-3 rounded-[8px] p-2 text-[#737373]" onClick={onClose} type="button"><X className="h-5 w-5" /></button>
          <div className="shrink-0 border-b border-[#E5E5E5] px-6 py-5">
            <div className="flex flex-wrap items-center gap-3 pr-10">
              <h2 className="text-[20px] leading-7 font-semibold text-[#0A0A0A]">{dialogEmployee.name}</h2>
              <span className={`rounded-[4px] px-2 py-1 text-[12px] leading-4 font-medium ${getStatusBadgeTone(dialogEmployee.employmentStatus)}`}>{formatStatusLabel(dialogEmployee.employmentStatus)}</span>
            </div>
            <p className="mt-2 text-[14px] leading-5 text-[#737373]">{dialogEmployee.position} · {dialogEmployee.department}</p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {actionError || error ? (
              <div className="mb-4 rounded-[8px] border border-[#FFC9C9] bg-[#FEF2F2] px-4 py-3 text-[14px] leading-5 text-[#B42318]">
                {actionError ?? error?.message}
              </div>
            ) : null}

            {loading && !data ? (
              <div className="space-y-3">
                <EmployeeDirectoryDialogLoading className="h-24 w-full" />
                <EmployeeDirectoryDialogLoading className="h-20 w-full" />
                <EmployeeDirectoryDialogLoading className="h-20 w-full" />
              </div>
            ) : (
              <div className="space-y-6">
                <EmployeeDirectoryDialogOverview
                  benefits={employeeBenefits}
                  employee={dialogEmployee}
                  onEditEmployee={() => setIsEditDialogOpen(true)}
                />
                <EmployeeDirectoryDialogBenefits
                  benefits={employeeBenefits}
                  onBulkOverride={() => void handleOverride()}
                  onOverrideBenefit={(benefitId) => void handleOverride(benefitId)}
                  overrideDisabled={overrideDisabled}
                  overridingAll={overridingKey === BULK_OVERRIDE_KEY}
                  overridingBenefitId={overridingKey}
                />
                <EmployeeDirectoryDialogRecentActions
                  employeeName={dialogEmployee.name}
                  requests={benefitRequests}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
