import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

export type PendingBenefitRequest = {
  actionType: "create" | "delete" | "update";
  createdAt: string;
  id: string;
  requestedBy: string;
  status: "approved" | "pending" | "rejected";
  targetRole: "finance_manager" | "hr_admin";
};

export type BenefitBadge = {
  icon: ComponentType<LucideProps>;
  label: string;
  weight?: "medium" | "semibold";
};

export type BenefitCategory = {
  id: string;
  name: string;
};

export type BenefitCard = {
  activeEmployees: number;
  approvalRole: "finance_manager" | "hr_admin";
  badges: readonly BenefitBadge[];
  category: string;
  categoryId: string;
  description: string;
  enabled: boolean;
  id: string;
  icon: ComponentType<LucideProps>;
  isCore: boolean;
  eligibleEmployees: number;
  pendingRequest?: PendingBenefitRequest | null;
  requiresContract: boolean;
  subsidyPercent?: number | null;
  title: string;
  titleIcon?: ComponentType<LucideProps>;
  vendorName?: string | null;
};

export type BenefitSection = {
  categoryId: string;
  cards: readonly BenefitCard[];
  count: string;
  icon: ComponentType<LucideProps>;
  title: string;
};

export type BenefitCatalogRecord = {
  activeEmployees?: number | null;
  approvalRole: "finance_manager" | "hr_admin";
  category: string;
  categoryId: string;
  description: string;
  eligibleEmployees?: number | null;
  id: string;
  isActive: boolean;
  isCore: boolean;
  pendingRequest?: PendingBenefitRequest | null;
  requiresContract: boolean;
  subsidyPercent?: number | null;
  title: string;
  vendorName?: string | null;
};
