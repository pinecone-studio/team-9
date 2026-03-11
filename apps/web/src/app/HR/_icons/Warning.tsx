import * as React from "react";
import { JSX } from "react/jsx-runtime";
const WarningIcon = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={19}
    fill="none"
    {...props}
  >
    <path fill="#000" d="M0 19h22L11 0 0 19Zm12-3h-2v-2h2v2Zm0-4h-2V8h2v4Z" />
  </svg>
);
export default WarningIcon;
