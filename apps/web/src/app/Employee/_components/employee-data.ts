import DashboardIcon from "@/app/HR/_icons/Dashboard";
import RequestsIcon from "@/app/HR/_icons/Requests";
import type { RequestRow, SummaryCard } from "./employee-types";

export const summaryCards: SummaryCard[] = [
  {
    label: "Active Benefits",
    value: "5",
    icon: "check",
    color: "#22C55E",
  },
  {
    label: "Eligible Benefits",
    value: "1",
    icon: "clover",
    color: "#2563EB",
  },
  {
    label: "Locked Benefits",
    value: "1",
    icon: "lock",
    color: "#6B7280",
  },
  {
    label: "Pending Requests",
    value: "1",
    icon: "clock",
    color: "#F59E0B",
  },
];

export const employeeNavItems = [
  { label: "Dashboard", icon: DashboardIcon },
  { label: "My Requests", icon: RequestsIcon },
];

export const requestRows: RequestRow[] = [
  {
    status: "Accepted",
    color: "bg-[#DCFCE7] text-[#16A34A]",
    icon: "check",
  },
  {
    status: "Pending",
    color: "bg-[#FEF3C7] text-[#D97706]",
    icon: "clock",
  },
  {
    status: "Rejected",
    color: "bg-[#FEE2E2] text-[#DC2626]",
    icon: "alert",
  },
];
