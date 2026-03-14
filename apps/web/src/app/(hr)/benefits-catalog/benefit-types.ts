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
  badges: readonly BenefitBadge[];
  category: string;
  categoryId: string;
  description: string;
  enabled: boolean;
  id: string;
  icon: ComponentType<LucideProps>;
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
  category: string;
  categoryId: string;
  description: string;
  id: string;
  isActive: boolean;
  subsidyPercent?: number | null;
  title: string;
  vendorName?: string | null;
};
