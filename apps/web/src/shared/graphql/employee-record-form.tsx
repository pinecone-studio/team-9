"use client";

import { useRef } from "react";
import type { EmployeeFormOptions, EmployeeFormValues } from "@/shared/graphql/employee-record-form-utils";
import {
  EmployeeDateField,
  EmployeeSelectField,
  EmployeeSwitchField,
  EmployeeTextField,
} from "@/shared/graphql/employee-record-form-fields";
import {
  normalizeEmployeeDateInput,
  toDisplayDateValue,
} from "@/shared/graphql/employee-record-form-utils";

type EmployeeRecordFormProps = {
  includeIdentity: boolean;
  onChange: <Key extends keyof EmployeeFormValues>(
    field: Key,
    value: EmployeeFormValues[Key],
  ) => void;
  options: EmployeeFormOptions;
  values: EmployeeFormValues;
};

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-[14px] leading-5 font-medium text-[#0A0A0A]">{title}</h3>;
}

function Divider() {
  return <div className="border-t border-[#E5E5E5]" />;
}

export default function EmployeeRecordForm({
  includeIdentity,
  onChange,
  options,
  values,
}: EmployeeRecordFormProps) {
  const hireDatePickerRef = useRef<HTMLInputElement | null>(null);
  const departmentOptions = options.departments.map((value) => ({
    label: value,
    value,
  }));
  const responsibilityLevelOptions = options.responsibilityLevels.map((value) => ({
    label: `Level ${value}`,
    value,
  }));
  const roleOptions = options.roles.map((value) => ({ label: value, value }));

  return (
    <div className="space-y-6">
      {includeIdentity ? (
        <section className="space-y-4">
          <SectionTitle title="Identity" />
          <div className="grid gap-4 md:grid-cols-2">
            <EmployeeTextField
              label="Employee Name"
              onChange={(value) => onChange("name", value)}
              placeholder="e.g. Saruul"
              value={values.name}
            />
            <EmployeeTextField
              label="Work Email"
              onChange={(value) => onChange("email", value)}
              placeholder="name@company.mn"
              type="email"
              value={values.email}
            />
          </div>
        </section>
      ) : null}

      {includeIdentity ? <Divider /> : null}

      <section className="space-y-4">
        <SectionTitle title="Employment Info" />
        <div className="grid gap-4 md:grid-cols-2">
          <EmployeeSelectField
            label="Employment Status"
            onChange={(value) =>
              onChange("employmentStatus", value as EmployeeFormValues["employmentStatus"])
            }
            options={options.employmentStatuses}
            value={values.employmentStatus}
          />
          <EmployeeSelectField
            label="Department"
            onChange={(value) => onChange("department", value)}
            options={departmentOptions}
            value={values.department}
          />
          <EmployeeSelectField
            label="Role"
            onChange={(value) => onChange("position", value)}
            options={roleOptions}
            value={values.position}
          />
          <EmployeeSelectField
            label="Responsibility Level"
            onChange={(value) => onChange("responsibilityLevel", value)}
            options={responsibilityLevelOptions}
            value={values.responsibilityLevel}
          />
        </div>
      </section>

      <Divider />

      <section className="space-y-4">
        <SectionTitle title="Dates" />
        <div className="max-w-[223px]">
          <EmployeeDateField
            label="Hire Date"
            onChange={(value) => onChange("hireDate", normalizeEmployeeDateInput(value))}
            onPickerChange={(value) => onChange("hireDate", toDisplayDateValue(value))}
            pickerRef={hireDatePickerRef}
            value={values.hireDate}
          />
        </div>
      </section>

      <Divider />

      <section className="space-y-4">
        <SectionTitle title="Eligibility Signals" />
        <EmployeeSwitchField
          checked={values.okrSubmitted}
          description="Has the employee submitted their OKR for the current quarter?"
          label="OKR Submitted"
          onChange={(value) => onChange("okrSubmitted", value)}
        />
        <div className="space-y-2">
          <EmployeeTextField
            label="Late Arrivals (last 30 days)"
            onChange={(value) => onChange("lateArrivalCount", value)}
            type="number"
            value={values.lateArrivalCount}
          />
          <p className="text-[12px] leading-4 text-[#737373]">
            Used in attendance-based eligibility rules. Maximum allowed: 3.
          </p>
        </div>
      </section>
    </div>
  );
}
