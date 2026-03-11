import * as React from "react";
import { JSX } from "react/jsx-runtime";

const RequestsIcon = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={15}
    fill="none"
    viewBox="0 0 19 15"
    {...props}
  >
    <path
      fill="currentColor"
      d="M0 4h11v2H0V4Zm0-2h11V0H0v2Zm0 8h7V8H0v2Zm15.01-3.13.71-.71a.996.996 0 0 1 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.71-2.12-2.12Zm-.71.71L9 12.88V15h2.12l5.3-5.3-2.12-2.12Z"
    />
  </svg>
);
export default RequestsIcon;
