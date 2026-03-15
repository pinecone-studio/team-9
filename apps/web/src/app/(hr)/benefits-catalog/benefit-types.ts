import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

export type BenefitBadge = {
  icon: ComponentType<LucideProps>;
  label: string;
  weight?: "medium" | "semibold";
};

export type BenefitStat = {
  icon: ComponentType<LucideProps>;
  label: string;
};

export type BenefitCard = {
  approvalRole: "finance_manager" | "hr_admin";
  badges: readonly BenefitBadge[];
  category: string;
  categoryId: string;
  description: string;
  enabled: boolean;
  id: string;
  icon: ComponentType<LucideProps>;
  isCore: boolean;
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
  stats: readonly BenefitStat[];
  title: string;
};

export type BenefitCatalogRecord = {
  approvalRole: "finance_manager" | "hr_admin";
  category: string;
  categoryId: string;
  description: string;
  id: string;
  isActive: boolean;
  isCore: boolean;
  requiresContract: boolean;
  subsidyPercent?: number | null;
  title: string;
  vendorName?: string | null;
};
