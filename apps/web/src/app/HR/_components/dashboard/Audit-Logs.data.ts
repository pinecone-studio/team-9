import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Ban,
  FileCheck2,
  FileText,
  FileUp,
  Leaf,
  Lock,
  RefreshCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
export type SummaryCard = {
  icon: LucideIcon;
  label: string;
  value: string;
};
export type PerformedBy = {
  name: string;
  role: string;
};
export const statusStyles = {
  Approved: "bg-[#DCFCE7] text-[#016630]",
  Eligible: "bg-[#DCFCE7] text-[#016630]",
  Locked: "bg-[#FEF2F2] text-[#C10007] border border-[#FFA2A2]",
  Pending: "bg-[#FEF3C6] text-[#973C00]",
  Rejected: "bg-[#FEF2F2] text-[#C10007] border border-[#FFA2A2]",
  Success: "bg-[#DCFCE7] text-[#016630]",
  Updated: "bg-[#DBEAFE] text-[#193CB8]",
} as const;
export type AuditStatus = keyof typeof statusStyles;
export type AuditRow = {
  event: string;
  icon: LucideIcon;
  performedBy: PerformedBy;
  result: AuditStatus;
  subject: string;
  target: string;
  timestamp: string;
};
export const summaryCards: SummaryCard[] = [
  {
    icon: FileText,
    label: "Total Log Entries",
    value: "12",
  },
  {
    icon: ShieldCheck,
    label: "Overrides This Week",
    value: "0",
  },
  {
    icon: BadgeCheck,
    label: "Approval Actions Today",
    value: "0",
  },
  {
    icon: FileCheck2,
    label: "Contract Events",
    value: "2",
  },
];

export const filterOptions = ["All Events", "All Results", "All Actors"];

export const auditRows: AuditRow[] = [
  {
    event: "Eligibility Recalculated",
    icon: RefreshCcw,
    performedBy: { name: "System", role: "Automated" },
    result: "Eligible",
    subject: "Gym — PineFit",
    target: "Ariunaa B.",
    timestamp: "Mar 12, 2:30 PM",
  },
  {
    event: "Benefit Approved",
    icon: Leaf,
    performedBy: { name: "Sarah Johnson", role: "HR Admin" },
    result: "Approved",
    subject: "Private Insurance",
    target: "Bold E.",
    timestamp: "Mar 12, 11:45 AM",
  },
  {
    event: "Override Approved",
    icon: ShieldCheck,
    performedBy: { name: "Finance Manager", role: "Finance" },
    result: "Approved",
    subject: "MacBook Subsidy",
    target: "Bataa M.",
    timestamp: "Mar 12, 10:20 AM",
  },
  {
    event: "Benefit Requested",
    icon: Leaf,
    performedBy: { name: "Tuvshin D.", role: "Employee" },
    result: "Pending",
    subject: "Learning & Development",
    target: "Tuvshin D.",
    timestamp: "Mar 12, 9:15 AM",
  },
  {
    event: "Rule Updated",
    icon: Scale,
    performedBy: { name: "Sarah Johnson", role: "HR Admin" },
    result: "Updated",
    subject: "Late Arrivals Threshold",
    target: "—",
    timestamp: "Mar 11, 4:30 PM",
  },
  {
    event: "Benefit Created",
    icon: Leaf,
    performedBy: { name: "Mike Chen", role: "HR Admin" },
    result: "Pending",
    subject: "Mental Health Support",
    target: "—",
    timestamp: "Mar 11, 2:00 PM",
  },
  {
    event: "Contract Accepted",
    icon: FileCheck2,
    performedBy: { name: "Ariunaa B.", role: "Employee" },
    result: "Success",
    subject: "Gym — PineFit v2.1",
    target: "Ariunaa B.",
    timestamp: "Mar 11, 11:20 AM",
  },
  {
    event: "Employee Locked",
    icon: Lock,
    performedBy: { name: "System", role: "Automated" },
    result: "Locked",
    subject: "Travel Subsidy",
    target: "Oyunaa T.",
    timestamp: "Mar 11, 9:00 AM",
  },
  {
    event: "Configuration Approved",
    icon: BadgeCheck,
    performedBy: { name: "David Kim", role: "Finance Director" },
    result: "Approved",
    subject: "Gym — PineFit",
    target: "—",
    timestamp: "Mar 10, 3:45 PM",
  },
  {
    event: "Benefit Rejected",
    icon: Ban,
    performedBy: { name: "Mike Chen", role: "HR Admin" },
    result: "Rejected",
    subject: "Meal Allowance",
    target: "Bataa M.",
    timestamp: "Mar 10, 2:30 PM",
  },
  {
    event: "Contract Uploaded",
    icon: FileUp,
    performedBy: { name: "Sarah Johnson", role: "HR Admin" },
    result: "Success",
    subject: "Private Insurance v3.0",
    target: "—",
    timestamp: "Mar 10, 10:00 AM",
  },
  {
    event: "Override Requested",
    icon: ShieldAlert,
    performedBy: { name: "Sarah Johnson", role: "HR Admin" },
    result: "Pending",
    subject: "MacBook Subsidy",
    target: "Bataa M.",
    timestamp: "Mar 9, 4:00 PM",
  },
];
