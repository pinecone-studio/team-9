import {
  AuditLogsIcon,
  BenefitsIcon,
  ContractsIcon,
  DashboardIcon,
  EmployeesIcon,
  RequestsIcon,
  RulesIcon,
} from "./top-nav.icons";
import type { NavigationItem } from "./top-nav.types";

export const navigationItems = [
  {
    href: "/dashboard",
    icon: DashboardIcon,
    key: "dashboard",
    label: "Dashboard",
  },
  {
    hasNotification: true,
    href: "/requests",
    icon: RequestsIcon,
    key: "requests",
    label: "Requests",
  },
  {
    href: "/employees",
    icon: EmployeesIcon,
    key: "employees",
    label: "Employees",
  },
  {
    href: "/benefits-catalog",
    icon: BenefitsIcon,
    key: "benefits-catalog",
    label: "Benefits",
  },
  {
    href: "/eligibility-rules",
    icon: RulesIcon,
    key: "eligibility-rules",
    label: "Rules",
  },
  {
    hasNotification: true,
    href: "/contracts",
    icon: ContractsIcon,
    key: "contracts",
    label: "Contracts",
  },
  {
    hasNotification: true,
    href: "/audit-logs",
    icon: AuditLogsIcon,
    key: "audit-logs",
    label: "Audit Logs",
  },
] satisfies NavigationItem[];
