export type SummaryCard = {
  label: string;
  value: string;
  icon: "check" | "clover" | "lock" | "clock";
  color: string;
};

export type RequestRow = {
  status: "Accepted" | "Pending" | "Rejected";
  color: string;
  icon: "check" | "clock" | "alert";
};

export type BenefitCard = {
  status: "Eligible" | "Locked" | "Pending" | "Active" | "Inactive";
  badge: string;
  accent: string;
  dots: string[];
  passed: string;
  action?: boolean;
  note?: string;
};

export type EmployeeRequestItem = {
  benefit: string;
  id: string;
  reviewedBy: string;
  status: "Accepted" | "Pending" | "Rejected";
  submittedAt: string;
};

export type EmployeeBenefitStatus =
  | "Eligible"
  | "Locked"
  | "Pending"
  | "Active"
  | "Inactive";

export type EmployeeBenefitCard = {
  accent: string;
  action?: boolean;
  approvalRole: "finance_manager" | "hr_admin";
  badge: string;
  categoryId: string;
  description: string;
  dots: string[];
  id: string;
  isActive: boolean;
  isCore: boolean;
  note?: string;
  passed: string;
  requiresContract: boolean;
  status: EmployeeBenefitStatus;
  subsidyPercent: number | null;
  subsidyLabel: string;
  title: string;
  vendorName: string | null;
};

export type EmployeeBenefitSection = {
  id: string;
  items: EmployeeBenefitCard[];
  title: string;
};

export type EmployeeEligibilitySignals = {
  employmentStatus: string;
  lateArrivals30Days: number | null;
  okrSubmitted: boolean | null;
  responsibilityLevel: number | null;
};

export type EmployeeDashboardViewData = {
  requests: EmployeeRequestItem[];
  sections: EmployeeBenefitSection[];
  signals: EmployeeEligibilitySignals;
  summaryCards: SummaryCard[];
};
