import type { EmployeeBenefitStatus } from "./employee-types";

export function splitSubsidyLabel(label: string) {
  const [subsidyText, ...rest] = label.split(" by ");

  if (rest.length === 0) {
    return [label, ""] as const;
  }

  return [subsidyText, `by ${rest.join(" by ")}`] as const;
}

export function getBadgeClass(status: EmployeeBenefitStatus) {
  if (status === "Eligible") {
    return "bg-[#DBEAFE] text-[#193CB8]";
  }

  if (status === "Pending") {
    return "bg-[#FEF3C7] text-[#973C00]";
  }

  if (status === "Active") {
    return "bg-[#DCFCE7] text-[#15803D]";
  }

  return "bg-[#F5F5F5] text-[#737373]";
}

export function StatusBadgeIcon({ status }: { status: EmployeeBenefitStatus }) {
  if (status === "Eligible") {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        height="10"
        viewBox="0 0 10 10"
        width="10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.995 0C2.235 0 0 2.24 0 5C0 7.76 2.235 10 4.995 10C7.76 10 10 7.76 10 5C10 2.24 7.76 0 4.995 0ZM5 9C2.79 9 1 7.21 1 5C1 2.79 2.79 1 5 1C7.21 1 9 2.79 9 5C9 7.21 7.21 9 5 9ZM6.75 4.5C7.165 4.5 7.5 4.165 7.5 3.75C7.5 3.335 7.165 3 6.75 3C6.335 3 6 3.335 6 3.75C6 4.165 6.335 4.5 6.75 4.5ZM3.25 4.5C3.665 4.5 4 4.165 4 3.75C4 3.335 3.665 3 3.25 3C2.835 3 2.5 3.335 2.5 3.75C2.5 4.165 2.835 4.5 3.25 4.5ZM5 7.75C6.165 7.75 7.155 7.02 7.555 6H2.445C2.845 7.02 3.835 7.75 5 7.75Z"
          fill="#193CB8"
        />
      </svg>
    );
  }

  if (status === "Locked") {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        height="11"
        viewBox="0 0 8 11"
        width="8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 3.5H6.5V2.5C6.5 1.12 5.38 0 4 0C2.62 0 1.5 1.12 1.5 2.5V3.5H1C0.45 3.5 0 3.95 0 4.5V9.5C0 10.05 0.45 10.5 1 10.5H7C7.55 10.5 8 10.05 8 9.5V4.5C8 3.95 7.55 3.5 7 3.5ZM2.5 2.5C2.5 1.67 3.17 1 4 1C4.83 1 5.5 1.67 5.5 2.5V3.5H2.5V2.5ZM7 9.5H1V4.5H7V9.5ZM4 8C4.55 8 5 7.55 5 7C5 6.45 4.55 6 4 6C3.45 6 3 6.45 3 7C3 7.55 3.45 8 4 8Z"
          fill="#737373"
        />
      </svg>
    );
  }

  if (status === "Pending") {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        height="10"
        viewBox="0 0 10 10"
        width="10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.995 0C2.235 0 0 2.24 0 5C0 7.76 2.235 10 4.995 10C7.76 10 10 7.76 10 5C10 2.24 7.76 0 4.995 0ZM5 9C2.79 9 1 7.21 1 5C1 2.79 2.79 1 5 1C7.21 1 9 2.79 9 5C9 7.21 7.21 9 5 9ZM5.25 2.5H4.5V5.5L7.125 7.075L7.5 6.46L5.25 5.125V2.5Z"
          fill="#973C00"
        />
      </svg>
    );
  }

  if (status === "Active") {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        height="10"
        viewBox="0 0 10 10"
        width="10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 0C2.24 0 0 2.24 0 5C0 7.76 2.24 10 5 10C7.76 10 10 7.76 10 5C10 2.24 7.76 0 5 0ZM5 9C2.79 9 1 7.21 1 5C1 2.79 2.79 1 5 1C7.21 1 9 2.79 9 5C9 7.21 7.21 9 5 9ZM4.2 7L2.7 5.5L3.41 4.8L4.2 5.59L6.59 3.2L7.3 3.91L4.2 7Z"
          fill="#15803D"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="10"
      viewBox="0 0 10 10"
      width="10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5" cy="5" r="4.3" stroke="#737373" strokeWidth="1" />
      <path
        d="M5 2.8V5.4"
        stroke="#737373"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
      />
      <circle cx="5" cy="7.1" fill="#737373" r="0.55" />
    </svg>
  );
}
