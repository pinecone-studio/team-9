"use client";

import { cn } from "@/lib/utils";
import { Benefit, EmployeeBenefit } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dumbbell,
  Shield,
  Heart,
  Laptop,
  PenTool,
  Award,
  Home,
  Target,
  CalendarOff,
  Plane,
  Lock,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  dumbbell: Dumbbell,
  shield: Shield,
  heart: Heart,
  laptop: Laptop,
  "pen-tool": PenTool,
  award: Award,
  home: Home,
  target: Target,
  "calendar-off": CalendarOff,
  plane: Plane,
};

const statusConfig = {
  ACTIVE: {
    label: "Active",
    variant: "default" as const,
    icon: CheckCircle2,
    className: "bg-success text-success-foreground",
  },
  ELIGIBLE: {
    label: "Eligible",
    variant: "secondary" as const,
    icon: ArrowRight,
    className: "bg-primary text-primary-foreground",
  },
  LOCKED: {
    label: "Locked",
    variant: "outline" as const,
    icon: Lock,
    className: "bg-muted text-muted-foreground",
  },
  PENDING: {
    label: "Pending",
    variant: "outline" as const,
    icon: Clock,
    className: "bg-warning text-warning-foreground",
  },
};

interface BenefitCardProps {
  benefit: Benefit;
  eligibility: EmployeeBenefit;
  onClick: () => void;
}

export function BenefitCard({ benefit, eligibility, onClick }: BenefitCardProps) {
  const Icon = iconMap[benefit.icon] || Gift;
  const status = statusConfig[eligibility.status];
  const StatusIcon = status.icon;

  const failedRules = eligibility.rule_evaluations.filter((r) => !r.passed);
  const primaryLockReason = failedRules[0]?.explanation;

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
        eligibility.status === "ACTIVE" && "border-success/30 bg-success/5",
        eligibility.status === "LOCKED" && "opacity-75"
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors",
              eligibility.status === "LOCKED"
                ? "bg-muted"
                : "bg-primary/10 group-hover:bg-primary/20"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                eligibility.status === "LOCKED" ? "text-muted-foreground" : "text-primary"
              )}
            />
          </div>
          <Badge className={cn("shrink-0", status.className)}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {status.label}
          </Badge>
        </div>

        {/* Content */}
        <div className="mt-4">
          <h3 className="font-semibold text-foreground">{benefit.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {benefit.description}
          </p>
        </div>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {benefit.subsidy_percentage < 100 && (
            <Badge variant="outline" className="text-xs font-normal">
              {benefit.subsidy_percentage}% Subsidy
            </Badge>
          )}
          {benefit.subsidy_percentage === 100 && (
            <Badge variant="outline" className="text-xs font-normal">
              Fully Covered
            </Badge>
          )}
          {benefit.vendor_name && (
            <Badge variant="outline" className="text-xs font-normal">
              {benefit.vendor_name}
            </Badge>
          )}
          {benefit.is_core && (
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-xs font-normal text-primary">
              Core Benefit
            </Badge>
          )}
        </div>

        {/* Lock Reason */}
        {eligibility.status === "LOCKED" && primaryLockReason && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-xs text-destructive">{primaryLockReason}</p>
          </div>
        )}

        {/* Pending Message */}
        {eligibility.status === "PENDING" && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-warning/10 p-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-xs text-warning">Awaiting HR approval</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Compact variant for lists
export function BenefitCardCompact({ benefit, eligibility, onClick }: BenefitCardProps) {
  const Icon = iconMap[benefit.icon] || Gift;
  const status = statusConfig[eligibility.status];
  const StatusIcon = status.icon;

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary/50 hover:bg-accent"
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          eligibility.status === "LOCKED" ? "bg-muted" : "bg-primary/10"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            eligibility.status === "LOCKED" ? "text-muted-foreground" : "text-primary"
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{benefit.name}</p>
        <p className="text-sm text-muted-foreground">
          {benefit.subsidy_percentage}% subsidy
          {benefit.vendor_name && ` • ${benefit.vendor_name}`}
        </p>
      </div>
      <Badge className={cn("shrink-0", status.className)}>
        <StatusIcon className="mr-1 h-3 w-3" />
        {status.label}
      </Badge>
    </button>
  );
}

function Gift(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}
