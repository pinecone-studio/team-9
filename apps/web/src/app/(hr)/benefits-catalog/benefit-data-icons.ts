import {
  BadgeDollarSign,
  BriefcaseBusiness,
  BookOpen,
  Bus,
  Clock3,
  CreditCard,
  Dumbbell,
  GraduationCap,
  Heart,
  House,
  Laptop,
  LifeBuoy,
  Monitor,
  Plane,
  ShieldPlus,
  Smile,
  Trophy,
  Utensils,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const DEFAULT_SECTION_ICON = Heart;
export const DEFAULT_CARD_ICON = Dumbbell;

export const CATEGORY_ICON_OPTIONS = [
  { icon: Smile, key: "smile", label: "Smile" },
  { icon: Heart, key: "heart", label: "Heart" },
  { icon: Laptop, key: "laptop", label: "Laptop" },
  { icon: Monitor, key: "monitor", label: "Monitor" },
  { icon: Wrench, key: "wrench", label: "Tools" },
  { icon: Wallet, key: "wallet", label: "Wallet" },
  { icon: BadgeDollarSign, key: "badgeDollar", label: "Money" },
  { icon: CreditCard, key: "creditCard", label: "Card" },
  { icon: GraduationCap, key: "graduationCap", label: "Education" },
  { icon: BriefcaseBusiness, key: "briefcase", label: "Work" },
  { icon: Trophy, key: "trophy", label: "Awards" },
  { icon: Plane, key: "plane", label: "Travel" },
  { icon: House, key: "house", label: "Home" },
  { icon: Clock3, key: "clock", label: "Time" },
  { icon: Utensils, key: "utensils", label: "Food" },
  { icon: LifeBuoy, key: "support", label: "Support" },
] as const;

export type CategoryIconKey = (typeof CATEGORY_ICON_OPTIONS)[number]["key"];

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

export function getCategoryIconByKey(key: CategoryIconKey) {
  return (
    CATEGORY_ICON_OPTIONS.find((option) => option.key === key)?.icon ?? DEFAULT_SECTION_ICON
  );
}
