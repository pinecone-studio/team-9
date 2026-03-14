/* eslint-disable max-lines */

import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import {
  BadgePercent,
  CircleCheck,
  Dumbbell,
  Heart,
  Laptop,
  Bus,
  BookOpen,
  ShieldPlus,
  StickyNote,
  Users,
  type LucideIcon,
} from "lucide-react";

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

const DEFAULT_SECTION_ICON = Heart;
const DEFAULT_CARD_ICON = Dumbbell;

const sectionIconMatchers: Array<{ icon: LucideIcon; keywords: string[] }> = [
  { icon: Heart, keywords: ["wellness", "mental", "health"] },
  { icon: ShieldPlus, keywords: ["insurance", "medical", "care"] },
  { icon: BookOpen, keywords: ["learning", "education", "conference"] },
  { icon: Laptop, keywords: ["equipment", "office", "flex", "remote", "setup"] },
  { icon: Bus, keywords: ["transport", "commute", "travel"] },
];

const cardIconMatchers: Array<{ icon: LucideIcon; keywords: string[] }> = [
  { icon: Dumbbell, keywords: ["gym", "fitness"] },
  { icon: ShieldPlus, keywords: ["insurance", "health"] },
  { icon: BookOpen, keywords: ["learning", "conference", "certification"] },
  { icon: Laptop, keywords: ["equipment", "office", "flex", "setup"] },
  { icon: Bus, keywords: ["transport", "commute", "travel"] },
];

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

function findMatchingIcon(
  value: string,
  matchers: Array<{ icon: LucideIcon; keywords: string[] }>,
  fallback: LucideIcon,
) {
  const normalizedValue = normalizeText(value);

  return (
    matchers.find(({ keywords }) =>
      keywords.some((keyword) => normalizedValue.includes(keyword)),
    )?.icon ?? fallback
  );
}

function buildBadges(record: BenefitCatalogRecord): BenefitBadge[] {
  const normalizedVendorName = record.vendorName?.trim() ?? "";
  const badges: BenefitBadge[] = [];

  if (
    typeof record.subsidyPercent === "number" &&
    Number.isFinite(record.subsidyPercent)
  ) {
    badges.push({
      icon: BadgePercent,
      label: `${record.subsidyPercent}% OFF`,
      weight: "semibold",
    });
  }

  if (normalizedVendorName) {
    badges.push({
      icon: StickyNote,
      label: normalizedVendorName,
      weight: "medium",
    });
  } else {
    badges.push({
      icon: StickyNote,
      label: "No vendor",
      weight: "medium",
    });
  }

  return badges;
}

export function buildBenefitSections(
  benefits: BenefitCatalogRecord[],
): BenefitSection[] {
  const groupedBenefits = new Map<string, BenefitCatalogRecord[]>();

  benefits.forEach((benefit) => {
    const category = benefit.category.trim() || "General";
    const group = groupedBenefits.get(category) ?? [];
    group.push(benefit);
    groupedBenefits.set(category, group);
  });

  return Array.from(groupedBenefits.entries()).map(([category, records]) => {
    const sectionIcon = findMatchingIcon(
      category,
      sectionIconMatchers,
      DEFAULT_SECTION_ICON,
    );

    return {
      categoryId: records[0]?.categoryId ?? "",
      title: category,
      count: `${records.length} Benefit${records.length === 1 ? "" : "s"}`,
      icon: sectionIcon,
      stats: [
        {
          icon: CircleCheck,
          label: `${records.filter((record) => record.isActive).length} Active`,
        },
        {
          icon: Users,
          label: `${records.filter((record) => (record.vendorName?.trim() ?? "").length > 0).length} Vendors`,
        },
      ],
      cards: records.map((record) => ({
        id: record.id,
        category,
        categoryId: record.categoryId,
        title: record.title,
        icon: findMatchingIcon(
          `${record.title} ${category}`,
          cardIconMatchers,
          DEFAULT_CARD_ICON,
        ),
        enabled: record.isActive,
        subsidyPercent: record.subsidyPercent,
        vendorName: record.vendorName ?? null,
        badges: buildBadges(record),
        description: record.description,
      })),
    };
  });
}
