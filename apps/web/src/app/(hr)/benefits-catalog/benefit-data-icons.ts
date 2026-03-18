import {
  BookOpen,
  Bus,
  Dumbbell,
  Heart,
  Laptop,
  ShieldPlus,
  type LucideIcon,
} from "lucide-react";

export const DEFAULT_SECTION_ICON = Heart;
export const DEFAULT_CARD_ICON = Dumbbell;

export const sectionIconMatchers: Array<{ icon: LucideIcon; keywords: string[] }> = [
  { icon: Heart, keywords: ["wellness", "mental", "health"] },
  { icon: ShieldPlus, keywords: ["insurance", "medical", "care"] },
  { icon: BookOpen, keywords: ["learning", "education", "conference"] },
  { icon: Laptop, keywords: ["equipment", "office", "flex", "remote", "setup"] },
  { icon: Bus, keywords: ["transport", "commute", "travel"] },
];

export const cardIconMatchers: Array<{ icon: LucideIcon; keywords: string[] }> = [
  { icon: Dumbbell, keywords: ["gym", "fitness"] },
  { icon: ShieldPlus, keywords: ["insurance", "health"] },
  { icon: BookOpen, keywords: ["learning", "conference", "certification"] },
  { icon: Laptop, keywords: ["equipment", "office", "flex", "setup"] },
  { icon: Bus, keywords: ["transport", "commute", "travel"] },
];

function normalizeBenefitText(value: string) {
  return value.trim().toLowerCase();
}

export function findMatchingBenefitIcon(
  value: string,
  matchers: Array<{ icon: LucideIcon; keywords: string[] }>,
  fallback: LucideIcon,
) {
  const normalizedValue = normalizeBenefitText(value);

  return (
    matchers.find(({ keywords }) =>
      keywords.some((keyword) => normalizedValue.includes(keyword)),
    )?.icon ?? fallback
  );
}
