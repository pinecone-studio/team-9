import * as React from "react";
import { JSX } from "react/jsx-runtime";

const PaperIcon = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M15.833 4.167v7.5h-4.166v4.166h-7.5V4.167h11.666Zm0-1.667H4.167C3.25 2.5 2.5 3.25 2.5 4.167v11.666c0 .917.75 1.667 1.667 1.667H12.5l5-5V4.167c0-.917-.75-1.667-1.667-1.667ZM10 11.667H5.833V10H10v1.667Zm4.167-3.334H5.833V6.667h8.334v1.666Z"
    />
  </svg>
);
export default PaperIcon;
