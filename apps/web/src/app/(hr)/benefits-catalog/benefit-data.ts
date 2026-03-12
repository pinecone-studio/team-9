import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import {
  BadgePercent,
  CalendarDays,
  CircleCheck,
  Dumbbell,
  Heart,
  Pencil,
  ShieldPlus,
  Smartphone,
  StickyNote,
  Users,
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

export const wellnessSection: BenefitSection = {
  title: "Wellness",
  count: "3 Benefits",
  icon: Heart,
  stats: [
    { icon: CircleCheck, label: "0 Active" },
    { icon: Users, label: "12 Eligible" },
  ],
  cards: [
    {
      title: "Gym Membership",
      icon: Dumbbell,
      titleIcon: Pencil,
      enabled: true,
      badges: [
        { icon: BadgePercent, label: "50% OFF", weight: "semibold" },
        { icon: StickyNote, label: "Expires: Dec 31, 2027", weight: "medium" },
      ],
      description: "Access to PineFit gym facilities with personal training sessions",
    },
    {
      title: "Private Insurance",
      icon: ShieldPlus,
      titleIcon: Pencil,
      enabled: true,
      badges: [
        { icon: BadgePercent, label: "50% OFF", weight: "semibold" },
        { icon: StickyNote, label: "Expires: Dec 31, 2027", weight: "medium" },
      ],
      description: "Comprehensive health coverage including dental and vision",
    },
    {
      title: "Digital Wellness",
      icon: Smartphone,
      titleIcon: Pencil,
      enabled: true,
      badges: [
        { icon: BadgePercent, label: "50% OFF", weight: "semibold" },
        { icon: StickyNote, label: "Expires: Dec 31, 2027", weight: "medium" },
        { icon: CalendarDays, label: "Core benefit", weight: "medium" },
      ],
      description: "Access to meditation apps, mental health support, and wellness resources",
    },
  ],
};
