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
  description: string;
  enabled: boolean;
  icon: ComponentType<LucideProps>;
  title: string;
  titleIcon?: ComponentType<LucideProps>;
};

export type BenefitSection = {
  cards: readonly BenefitCard[];
  count: string;
  icon: ComponentType<LucideProps>;
  stats: readonly BenefitStat[];
  title: string;
};

export type BenefitCatalogRecord = {
  category: string;
  description: string;
  id: string;
  title: string;
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

function buildBadges(description: string, category: string): BenefitBadge[] {
  const subsidyMatch = description.match(/(\d+)% subsidy/i);
  const vendorName = description.includes(" - ")
    ? description.split(" - ")[0]?.trim()
    : "";

  const badges: BenefitBadge[] = [];

  if (subsidyMatch?.[1]) {
    badges.push({
      icon: BadgePercent,
      label: `${subsidyMatch[1]}% OFF`,
      weight: "semibold",
    });
  }

  if (vendorName) {
    badges.push({
      icon: StickyNote,
      label: vendorName,
      weight: "medium",
    });
  }

  if (badges.length === 0) {
    badges.push({
      icon: StickyNote,
      label: category,
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
      title: category,
      count: `${records.length} Benefit${records.length === 1 ? "" : "s"}`,
      icon: sectionIcon,
      stats: [
        {
          icon: CircleCheck,
          label: `${records.length} Active`,
        },
        {
          icon: Users,
          label: `${records.filter((record) => record.description.includes(" - ")).length} Vendors`,
        },
      ],
      cards: records.map((record) => ({
        title: record.title,
        icon: findMatchingIcon(
          `${record.title} ${category}`,
          cardIconMatchers,
          DEFAULT_CARD_ICON,
        ),
        enabled: true,
        badges: buildBadges(record.description, category),
        description: record.description,
      })),
    };
  });
}
