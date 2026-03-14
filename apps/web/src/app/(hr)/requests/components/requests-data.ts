import type { LucideIcon } from "lucide-react";
import { AlertCircle, CheckCircle2, CircleX, Clock3 } from "lucide-react";

export type RequestStatus = "approved" | "pending" | "rejected";

export type SummaryCard = {
  icon: LucideIcon;
  label: string;
  value: number;
};

export type ConfigurationRow = {
  action: string;
  changes: string;
  createdBy: string;
  name: string;
  status: RequestStatus;
  submitted: string;
  type: "benefit" | "rule";
};

export type BenefitRequestRow = {
  action: string;
  approvedBy: string;
  benefit: string;
  category: string;
  employee: string;
  id: string;
  position: string;
  progress: string;
  status: RequestStatus;
  submitted: string;
};

export const summaryCards: SummaryCard[] = [
  { icon: Clock3, label: "Pending Requests", value: 5 },
  { icon: CircleX, label: "Rejected Today", value: 1 },
  { icon: AlertCircle, label: "Awaiting Finance", value: 1 },
  { icon: CheckCircle2, label: "Approved Today", value: 1 },
];

export const configurationRows: ConfigurationRow[] = [
  {
    action: "Review",
    changes: "New benefit creation",
    createdBy: "Sarah Johnson",
    name: "Mental Health Support",
    status: "pending",
    submitted: "Mar 12",
    type: "benefit",
  },
  {
    action: "Review",
    changes: "New rule creation",
    createdBy: "Mike Chen",
    name: "Tenure 24+ Months",
    status: "pending",
    submitted: "Mar 11",
    type: "rule",
  },
  {
    action: "Review",
    changes: "Subsidy percentage: 50% -> 60%",
    createdBy: "Sarah Johnson",
    name: "Gym — PineFit",
    status: "pending",
    submitted: "Mar 10",
    type: "benefit",
  },
];

export const benefitRequestRows: BenefitRequestRow[] = [
  {
    action: "Review",
    approvedBy: "HR",
    benefit: "Gym — PineFit",
    category: "Wellness",
    employee: "Ariunaa B.",
    id: "benefit-req-1",
    position: "UX Engineer",
    progress: "Waiting for HR",
    status: "pending",
    submitted: "Mar 12",
  },
  {
    action: "Review",
    approvedBy: "Finance",
    benefit: "Down Payment Assistance",
    category: "Financial",
    employee: "Bold E.",
    id: "benefit-req-2",
    position: "Finance Analyst",
    progress: "Waiting for Finance",
    status: "pending",
    submitted: "Mar 11",
  },
  {
    action: "Review",
    approvedBy: "HR",
    benefit: "Private Insurance",
    category: "Financial",
    employee: "Oyunaa T.",
    id: "benefit-req-3",
    position: "HR Specialist",
    progress: "Waiting for HR",
    status: "pending",
    submitted: "Mar 11",
  },
  {
    action: "Review",
    approvedBy: "Sarah J.",
    benefit: "Travel",
    category: "Flexibility",
    employee: "Sarnai G.",
    id: "benefit-req-4",
    position: "Marketing Manager",
    progress: "Approved",
    status: "approved",
    submitted: "Mar 11",
  },
  {
    action: "Review",
    approvedBy: "Department Manager",
    benefit: "Learning & Development",
    category: "Career Development",
    employee: "Tuvshin D.",
    id: "benefit-req-5",
    position: "Backend Developer",
    progress: "Waiting for Department Manager",
    status: "pending",
    submitted: "Mar 10",
  },
  {
    action: "Review",
    approvedBy: "HR",
    benefit: "Meal Allowance",
    category: "Wellness",
    employee: "Bataa M.",
    id: "benefit-req-6",
    position: "Product Manager",
    progress: "Rejected",
    status: "rejected",
    submitted: "Mar 9",
  },
  {
    action: "Review",
    approvedBy: "Finance",
    benefit: "Equipment Allowance",
    category: "Equipment",
    employee: "Munkh B.",
    id: "benefit-req-7",
    position: "Data Analyst",
    progress: "Waiting for Finance",
    status: "pending",
    submitted: "Mar 12",
  },
];

export const statusStyles: Record<RequestStatus, string> = {
  approved: "border-[#B9F8CF] bg-[#F0FDF4] text-[#008236]",
  pending: "border-[#FEE685] bg-[#FFFBEB] text-[#BB4D00]",
  rejected: "border-[#FFC9C9] bg-[#FEF2F2] text-[#C10007]",
};
