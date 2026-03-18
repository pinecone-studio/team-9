"use client";

import { useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import {
  EmployeesPageDocument,
  useDeleteEmployeeRecordMutation,
  useUpdateEmployeeRecordMutation,
} from "@/shared/apollo/generated";
import type { Employee } from "@/shared/apollo/types";
import EmployeeRecordDialogShell from "@/shared/graphql/employee-record-dialog-shell";
import EmployeeRecordForm from "@/shared/graphql/employee-record-form";
import {
  buildEmployeeFormOptions,
  buildEmployeeFormValues,
  toEmployeeMutationInput,
  validateEmployeeForm,
  type EmployeeFormValues,
} from "@/shared/graphql/employee-record-form-utils";

type EmployeeEditDialogProps = {
  employee: Employee;
  employees: Employee[];
  onClose: () => void;
  onDeleted: () => void | Promise<void>;
  onSaved: () => void | Promise<void>;
};

export default function EmployeeEditDialog({
  employee,
  employees,
  onClose,
  onDeleted,
  onSaved,
}: EmployeeEditDialogProps) {
  const client = useApolloClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [values, setValues] = useState<EmployeeFormValues>(() =>
    buildEmployeeFormValues(employee),
  );
  const [updateEmployeeRecord, { loading: saving }] =
    useUpdateEmployeeRecordMutation();
  const [deleteEmployeeRecord, { loading: deleting }] =
    useDeleteEmployeeRecordMutation();
  const options = buildEmployeeFormOptions(employees, employee);

  async function handleSave() {
    const validationError = validateEmployeeForm(values, false);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setErrorMessage(null);
      await updateEmployeeRecord({
        variables: {
          input: { id: employee.id, ...toEmployeeMutationInput(values) },
        },
      });
      await client.refetchQueries({ include: [EmployeesPageDocument] });
      await onSaved();
    } catch (caughtError) {
      setErrorMessage(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to update employee.",
      );
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete ${employee.name} from the employee directory?`)) {
      return;
    }

    try {
      setErrorMessage(null);
      await deleteEmployeeRecord({ variables: { id: employee.id } });
      await client.refetchQueries({ include: [EmployeesPageDocument] });
      await onDeleted();
    } catch (caughtError) {
      setErrorMessage(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to delete employee.",
      );
    }
  }

  return (
    <EmployeeRecordDialogShell
      footer={
        <div className="flex items-center justify-between gap-3">
          <button
            className="rounded-[8px] border border-[#F3C7C7] bg-[#FFF7F7] px-4 py-2 text-[14px] font-medium text-[#B42318] disabled:opacity-60"
            disabled={saving || deleting}
            onClick={() => void handleDelete()}
            type="button"
          >
            Delete Employee
          </button>
          <div className="flex gap-2">
            <button
              className="rounded-[8px] border border-[#E5E5E5] bg-white px-4 py-2 text-[14px] font-medium text-[#0A0A0A]"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-[8px] bg-[#171717] px-4 py-2 text-[14px] font-medium text-[#FAFAFA] disabled:opacity-60"
              disabled={saving || deleting}
              onClick={() => void handleSave()}
              type="button"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      }
      onClose={onClose}
      subtitle="Update employee information and eligibility signals. Changes will automatically recalculate benefit eligibility."
      title="Edit Employee Data"
    >
      {errorMessage ? (
        <div className="mb-4 rounded-[8px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[12px] leading-4 text-[#B42318]">
          {errorMessage}
        </div>
      ) : null}
      <EmployeeRecordForm
        includeIdentity={false}
        onChange={(field, value) =>
          setValues((current) => ({ ...current, [field]: value }))
        }
        options={options}
        values={values}
      />
    </EmployeeRecordDialogShell>
  );
}
