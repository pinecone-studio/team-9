import * as React from "react";
import type { JSX } from "react/jsx-runtime";

const ContractsIcon = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M17 3H5a2 2 0 0 0-2 2v14l4-4h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 10H6.17L5 14.17V5h12v8Zm-8-5h6v2H9V8Zm0 3h6v1.5H9V11Z"
    />
  </svg>
);

export default ContractsIcon;
