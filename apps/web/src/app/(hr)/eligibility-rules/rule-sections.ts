import type { ComponentType } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Shield,
  Star,
} from "lucide-react";

export type RuleSectionMeta = {
  icon: ComponentType<{ className?: string }>;
  title: string;
};

export const sectionMeta: readonly RuleSectionMeta[] = [
  {
    title: "Gate Rules",
    icon: Shield,
  },
  {
    title: "Threshold Rules",
    icon: AlertTriangle,
  },
  {
    title: "Tenure Rules",
    icon: CalendarDays,
  },
  {
    title: "Level Rules",
    icon: Star,
  },
];
