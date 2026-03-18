import type { ComponentType, SVGProps } from "react";

export type HrNavKey =
  | "dashboard"
  | "benefits-catalog"
  | "employees"
  | "requests"
  | "eligibility-rules"
  | "audit-logs"
  | "contracts";

export type NavigationItem = {
  hasNotification?: boolean;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  key: HrNavKey;
  label: string;
};
