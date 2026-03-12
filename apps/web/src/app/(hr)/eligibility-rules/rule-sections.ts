import type { ComponentType } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Shield,
  Star,
} from "lucide-react";

export type RuleCard = {
  description: string;
  enabled: boolean;
  metricLabel?: string;
  metricSuffix?: string;
  metricValue?: string;
  title: string;
};

export type RuleSection = {
  cards: readonly RuleCard[];
  count: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
};

export const sections: readonly RuleSection[] = [
  {
    title: "Gate Rules",
    count: "2 Rules",
    icon: Shield,
    cards: [
      {
        title: "OKR Submission Gate",
        description: "Require OKR submission for non-core benefits",
        enabled: true,
      },
      {
        title: "Probation Gate",
        description: "Block benefits during probation period for new employees",
        enabled: true,
      },
    ],
  },
  {
    title: "Threshold Rules",
    count: "3 Rules",
    icon: AlertTriangle,
    cards: [
      {
        title: "Late Arrival Threshold",
        description: "Maximum late arrivals within 30 days",
        metricLabel: "Late arrivals",
        metricValue: "3",
        metricSuffix: "Times",
        enabled: false,
      },
      {
        title: "Teacher Late Arrival Time",
        description: "Check-in time after which teacher is considered late",
        metricLabel: "Late arrivals",
        metricValue: "9",
        metricSuffix: "AM",
        enabled: true,
      },
      {
        title: "General Late Arrival Time",
        description: "Check-in time after which non-teacher is considered late",
        metricLabel: "Late arrivals",
        metricValue: "10",
        metricSuffix: "AM",
        enabled: true,
      },
    ],
  },
  {
    title: "Tenure Rules",
    count: "3 Rules",
    icon: CalendarDays,
    cards: [
      {
        title: "MacBook Tenure Requirement",
        description: "Minimum months of employment for MacBook subsidy",
        metricLabel: "Minimum Tenure",
        metricValue: "6",
        metricSuffix: "Months",
        enabled: true,
      },
      {
        title: "Travel Tenure Requirement",
        description: "Minimum months of employment for travel subsidy",
        metricLabel: "Minimum Tenure",
        metricValue: "12",
        metricSuffix: "Months",
        enabled: true,
      },
      {
        title: "Down Payment Tenure Requirement",
        description: "Minimum months for down payment assistance",
        metricLabel: "Minimum Tenure",
        metricValue: "24",
        metricSuffix: "Months",
        enabled: true,
      },
    ],
  },
  {
    title: "Level Rules",
    count: "2 Rules",
    icon: Star,
    cards: [
      {
        title: "Extra Responsibility Level",
        description: "Minimum responsibility level required",
        metricLabel: "Minimum Level",
        metricValue: "6",
        metricSuffix: "Months",
        enabled: true,
      },
      {
        title: "Down Payment Level",
        description: "Minimum months of employment for travel subsidy",
        metricLabel: "Minimum Tenure",
        metricValue: "12",
        metricSuffix: "Months",
        enabled: true,
      },
    ],
  },
];
