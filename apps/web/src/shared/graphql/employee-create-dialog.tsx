"use client";

import { useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import {
  EmployeesPageDocument,
  useCreateEmployeeRecordMutation,
} from "@/shared/apollo/generated";
import EmployeeRecordDialogShell from "@/shared/graphql/employee-record-dialog-shell";
import EmployeeRecordForm from "@/shared/graphql/employee-record-form";
import type { Employee } from "@/shared/apollo/types";
import {
  buildEmployeeFormOptions,
  buildEmployeeFormValues,
  toEmployeeMutationInput,
  validateEmployeeForm,
  type EmployeeFormValues,
} from "@/shared/graphql/employee-record-form-utils";

type EmployeeCreateDialogProps = {
  employees: Employee[];
  onClose: () => void;
};

export default function EmployeeCreateDialog({
  employees,
  onClose,
}: EmployeeCreateDialogProps) {
  const client = useApolloClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [values, setValues] = useState<EmployeeFormValues>(() =>
    buildEmployeeFormValues(),
  );
  const [createEmployeeRecord, { loading }] = useCreateEmployeeRecordMutation();
  const options = buildEmployeeFormOptions(employees);

  async function handleSubmit() {
    const validationError = validateEmployeeForm(values, true);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setErrorMessage(null);
      await createEmployeeRecord({
        variables: { input: toEmployeeMutationInput(values) },
      });
      await client.refetchQueries({ include: [EmployeesPageDocument] });
      onClose();
    } catch (caughtError) {
      setErrorMessage(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to create employee.",
      );
    }
  }

  return (
    <EmployeeRecordDialogShell
      footer={
        <div className="flex justify-end gap-2">
          <button
            className="rounded-[8px] border border-[#E5E5E5] bg-white px-4 py-2 text-[14px] font-medium text-[#0A0A0A]"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-[8px] bg-[#171717] px-4 py-2 text-[14px] font-medium text-[#FAFAFA] disabled:opacity-60"
            disabled={loading}
            onClick={() => void handleSubmit()}
            type="button"
          >
            {loading ? "Creating..." : "Create Employee"}
          </button>
        </div>
      }
      onClose={onClose}
      subtitle="Add a new employee record to the directory and eligibility engine."
      title="Add Employee"
    >
      {errorMessage ? (
        <div className="mb-4 rounded-[8px] border border-[#F3C7C7] bg-[#FFF7F7] px-3 py-2 text-[12px] leading-4 text-[#B42318]">
          {errorMessage}
        </div>
      ) : null}
      <EmployeeRecordForm
        includeIdentity
        onChange={(field, value) =>
          setValues((current) => ({ ...current, [field]: value }))
        }
        options={options}
        values={values}
      />
    </EmployeeRecordDialogShell>
  );
}
