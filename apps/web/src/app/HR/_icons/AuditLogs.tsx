import * as React from "react";
import type { JSX } from "react/jsx-runtime";
const AuditLogsIcon = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={20}
    fill="none"
    viewBox="0 0 16 20"
    {...props}
  >
    <path
      fill="currentColor"
      d="M8 0 0 3v6.09C0 14.14 3.41 18.85 8 20c4.59-1.15 8-5.86 8-10.91V3L8 0Zm6 9.09c0 4-2.55 7.7-6 8.83-3.45-1.13-6-4.82-6-8.83v-4.7l6-2.25 6 2.25v4.7Z"
    />
  </svg>
);
export default AuditLogsIcon;
