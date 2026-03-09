"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Gift, Lock, Clock, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  stats: {
    total: number;
    active: number;
    eligible: number;
    locked: number;
    pending: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Active Benefits",
      value: stats.active,
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20",
    },
    {
      label: "Eligible to Claim",
      value: stats.eligible,
      icon: Gift,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      label: "Pending Approval",
      value: stats.pending,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/20",
    },
    {
      label: "Currently Locked",
      value: stats.locked,
      icon: Lock,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      borderColor: "",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className={`overflow-hidden ${card.borderColor}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">
                    {card.value}
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// HR Dashboard Stats
interface HRStatsCardsProps {
  employeeCount: number;
  pendingRequests: number;
  activeContracts: number;
  recentActions: number;
}

export function HRStatsCards({ employeeCount, pendingRequests, activeContracts, recentActions }: HRStatsCardsProps) {
  const cards = [
    {
      label: "Total Employees",
      value: employeeCount,
      icon: Gift,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
      change: "+2 this month",
    },
    {
      label: "Pending Requests",
      value: pendingRequests,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: pendingRequests > 0 ? "border-warning/30" : "",
      change: pendingRequests > 0 ? "Needs attention" : "All clear",
    },
    {
      label: "Active Contracts",
      value: activeContracts,
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success/20",
      change: "All up to date",
    },
    {
      label: "Actions This Week",
      value: recentActions,
      icon: TrendingUp,
      color: "text-info",
      bgColor: "bg-info/10",
      borderColor: "border-info/20",
      change: "View audit log",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className={`overflow-hidden ${card.borderColor}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{card.change}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
