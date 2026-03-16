import type { ComponentType } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Shield,
  Star,
} from "lucide-react";

export type RuleSectionMeta = {
  description: string;
  examples: string[];
  icon: ComponentType<{ className?: string }>;
  whenToUse: string;
  title: string;
};

export const sectionMeta: readonly RuleSectionMeta[] = [
  {
    description: "This category is for simple yes/no or exact-match rules, such as employee status, OKR completion, or job role.",
    examples: ["Employee status must be Active", "OKR must be submitted", "Role must be HR Specialist"],
    title: "Gate Rules",
    icon: Shield,
    whenToUse: "Choose this for straightforward checks where a person either matches the condition or does not.",
  },
  {
    description: "This category is for attendance and lateness rules where you compare a number to a limit.",
    examples: ["Late arrival count must be 3 or less", "Late arrival count must be at least 1"],
    title: "Threshold Rules",
    icon: AlertTriangle,
    whenToUse: "Choose this when you want to count something, such as how many times an employee arrived late.",
  },
  {
    description: "This category is for service-length rules based on how long the employee has worked here.",
    examples: ["Days worked must be at least 90", "Days worked must be at least 365"],
    title: "Tenure Rules",
    icon: CalendarDays,
    whenToUse: "Choose this when eligibility should depend on time worked since hire date.",
  },
  {
    description: "This category is for level-based rules, such as responsibility or seniority level.",
    examples: ["Responsibility level must be at least 3", "Responsibility level must be at least 5"],
    title: "Level Rules",
    icon: Star,
    whenToUse: "Choose this when a benefit is only for employees above a certain level.",
  },
];
