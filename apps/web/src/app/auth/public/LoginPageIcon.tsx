import * as React from "react";
import type { JSX } from "react/jsx-runtime";

const LoginPageIcon = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={8}
    fill="none"
    {...props}
  >
    <path
      fill="#788BA5"
      d="M.75 2.981a.75.75 0 0 0 0 1.5h6.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 0 0-1.06 1.06l1.72 1.72H.75Z"
    />
  </svg>
);
export default LoginPageIcon;
