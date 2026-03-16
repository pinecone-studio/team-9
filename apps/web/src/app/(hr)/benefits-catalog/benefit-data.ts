import {
  BadgePercent,
  Dumbbell,
  Heart,
  Laptop,
  Bus,
  BookOpen,
  ShieldPlus,
  StickyNote,
  type LucideIcon,
} from "lucide-react";

import type {
  BenefitBadge,
  BenefitCategory,
  BenefitCatalogRecord,
  BenefitSection,
} from "./benefit-types";

export type {
  BenefitBadge,
  BenefitCategory,
  BenefitCard,
  BenefitCatalogRecord,
  BenefitSection,
} from "./benefit-types";

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
  categories: BenefitCategory[] = [],
): BenefitSection[] {
  const groupedBenefits = new Map<
    string,
    { categoryId: string; categoryName: string; records: BenefitCatalogRecord[] }
  >();

  benefits.forEach((benefit) => {
    const categoryName = benefit.category.trim() || "General";
    const categoryId = benefit.categoryId || categoryName;
    const group = groupedBenefits.get(categoryId) ?? {
      categoryId,
      categoryName,
      records: [],
    };
    group.records.push(benefit);
    groupedBenefits.set(categoryId, group);
  });

  categories.forEach((category) => {
    const categoryName = category.name.trim();
    const categoryId = category.id.trim();

    if (!categoryName || !categoryId || groupedBenefits.has(categoryId)) {
      return;
    }

    groupedBenefits.set(categoryId, {
      categoryId,
      categoryName,
      records: [],
    });
  });

  return Array.from(groupedBenefits.values())
    .sort((left, right) => left.categoryName.localeCompare(right.categoryName))
    .map(({ categoryId, categoryName, records }) => {
      const sectionIcon = findMatchingIcon(
        categoryName,
        sectionIconMatchers,
        DEFAULT_SECTION_ICON,
      );

      return {
        categoryId,
        title: categoryName,
        count: `${records.length} Benefit${records.length === 1 ? "" : "s"}`,
        icon: sectionIcon,
        cards: records.map((record) => ({
          activeEmployees: Math.max(0, record.activeEmployees ?? 0),
          id: record.id,
          approvalRole: record.approvalRole,
          category: categoryName,
          categoryId: record.categoryId,
          title: record.title,
          icon: findMatchingIcon(
            `${record.title} ${categoryName}`,
            cardIconMatchers,
            DEFAULT_CARD_ICON,
          ),
          enabled: record.isActive,
          isCore: record.isCore,
          eligibleEmployees: Math.max(0, record.eligibleEmployees ?? 0),
          requiresContract: record.requiresContract,
          subsidyPercent: record.subsidyPercent,
          vendorName: record.vendorName ?? null,
          badges: buildBadges(record),
          description: record.description,
        })),
      };
    });
}
