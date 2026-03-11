import type { SVGProps } from "react";
import type { JSX } from "react/jsx-runtime";

const DashboardIcon = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={26}
    fill="none"
    viewBox="0 0 26 26"
    {...props}
  >
    <path
      fill="currentColor"
      d="M22.667 2.833v2.834H17V2.833h5.667Zm-14.167 0v8.5H2.833v-8.5H8.5Zm14.167 11.334v8.5H17v-8.5h5.667ZM8.5 19.833v2.834H2.833v-2.834H8.5ZM25.5 0H14.167v8.5H25.5V0ZM11.333 0H0v14.167h11.333V0ZM25.5 11.333H14.167V25.5H25.5V11.333ZM11.333 17H0v8.5h11.333V17Z"
    />
  </svg>
);
export default DashboardIcon;
