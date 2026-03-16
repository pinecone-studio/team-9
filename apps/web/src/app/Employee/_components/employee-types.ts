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
